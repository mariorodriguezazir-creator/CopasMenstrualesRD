import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: zones, error } = await supabase
    .from('delivery_zones')
    .select('id, name, zone_type')
    .eq('is_active', true)
    .order('name');

  if (error) {
    return NextResponse.json(
      { error: 'Error al cargar zonas de entrega' },
      { status: 500 }
    );
  }

  return NextResponse.json(zones ?? []);
}
