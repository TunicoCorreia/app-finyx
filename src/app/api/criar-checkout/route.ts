import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, plano } = await request.json();

    if (!email || !plano || !['mensal', 'anual'].includes(plano)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    // Verificar se as variáveis de ambiente da Keoto estão configuradas
    if (!process.env.KEOTO_API_KEY || !process.env.KEOTO_PLAN_MENSAL_ID || !process.env.KEOTO_PLAN_ANUAL_ID) {
      return NextResponse.json({ 
        error: 'Configuração da Keoto incompleta. Configure as variáveis de ambiente KEOTO_API_KEY, KEOTO_PLAN_MENSAL_ID e KEOTO_PLAN_ANUAL_ID no arquivo .env.local' 
      }, { status: 500 });
    }

    // Identificar ID do plano
    const planId = plano === 'mensal' ? process.env.KEOTO_PLAN_MENSAL_ID : process.env.KEOTO_PLAN_ANUAL_ID;

    // Requisição para Keoto API
    const keotoResponse = await fetch('https://api.keoto.com/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KEOTO_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        plan_id: planId,
      }),
    });

    if (!keotoResponse.ok) {
      const errorData = await keotoResponse.json().catch(() => ({}));
      console.error('Erro da Keoto API:', errorData);
      return NextResponse.json({ 
        error: 'Falha ao criar checkout na Keoto',
        details: errorData 
      }, { status: 500 });
    }

    const data = await keotoResponse.json();
    const checkoutUrl = data.checkout_url;

    if (!checkoutUrl) {
      return NextResponse.json({ 
        error: 'URL de checkout não retornada pela Keoto' 
      }, { status: 500 });
    }

    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
