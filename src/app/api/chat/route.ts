import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildSystemPrompt, buildUserMessage } from '@/lib/utils/chat-prompt';

// Simple in-memory rate limiter (production should use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: 'Has enviado muchos mensajes. Esperá un momento.',
        fallback: true,
      },
      { status: 429 }
    );
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensaje vacío' },
        { status: 400 }
      );
    }

    // Get products for context
    const supabase = createAdminClient();
    const { data: products } = await supabase
      .from('products')
      .select('id, name, description, price, stock')
      .eq('is_active', true);

    // Check for order ID in message
    const orderIdMatch = message.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    );
    let orderContext = null;

    if (orderIdMatch) {
      const { data: order } = await supabase
        .from('orders')
        .select('id, payment_status')
        .eq('id', orderIdMatch[0])
        .single();

      if (order) {
        orderContext = {
          orderId: order.id,
          status: order.payment_status,
        };
      }
    }

    const systemPrompt = buildSystemPrompt(products ?? []);
    const userMessage = buildUserMessage(message, orderContext);

    // Call Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({
        reply:
          'En este momento no puedo responder. Contáctanos por WhatsApp: https://wa.me/18094670365',
        fallback: true,
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', await geminiResponse.text());
      return NextResponse.json({
        reply:
          'En este momento no puedo responder. Contáctanos por WhatsApp: https://wa.me/18094670365',
        fallback: true,
      });
    }

    const geminiData = await geminiResponse.json();
    const reply =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ??
      'No pude procesar tu mensaje. ¿Podrías repetirlo?';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      reply:
        'En este momento no puedo responder. Contáctanos por WhatsApp: https://wa.me/18094670365',
      fallback: true,
    });
  }
}
