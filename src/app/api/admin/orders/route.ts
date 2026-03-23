import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('payment_status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Error al cargar pedidos' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, payment_status } = body;

    if (!id || !payment_status) {
      return NextResponse.json({ error: 'ID y status requeridos' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 });
    }

    // Add status history
    await supabase.from('order_status_history').insert({
      order_id: id,
      status: payment_status,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
