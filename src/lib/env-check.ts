/**
 * Verificação de variáveis de ambiente necessárias
 * Este arquivo valida se todas as variáveis críticas estão configuradas
 */

interface EnvConfig {
  name: string
  value: string | undefined
  required: boolean
  description: string
}

const envVariables: EnvConfig[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    required: true,
    description: 'URL do projeto Supabase',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    required: true,
    description: 'Chave anônima do Supabase',
  },
  {
    name: 'DATABASE_URL',
    value: process.env.DATABASE_URL,
    required: false,
    description: 'URL de conexão PostgreSQL (opcional se usar Supabase)',
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: process.env.SUPABASE_SERVICE_ROLE_KEY,
    required: false,
    description: 'Chave de serviço do Supabase (para operações administrativas)',
  },
]

export function checkEnvironmentVariables(): {
  isValid: boolean
  missing: string[]
  warnings: string[]
} {
  const missing: string[] = []
  const warnings: string[] = []

  envVariables.forEach((env) => {
    if (!env.value || env.value.trim() === '') {
      if (env.required) {
        missing.push(`${env.name}: ${env.description}`)
      } else {
        warnings.push(`${env.name}: ${env.description}`)
      }
    }
  })

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  }
}

export function logEnvironmentStatus(): void {
  const status = checkEnvironmentVariables()

  if (status.isValid) {
    console.log('✅ Todas as variáveis de ambiente obrigatórias estão configuradas!')
  } else {
    console.error('❌ Variáveis de ambiente faltando:')
    status.missing.forEach((msg) => console.error(`  - ${msg}`))
  }

  if (status.warnings.length > 0) {
    console.warn('⚠️ Variáveis opcionais não configuradas:')
    status.warnings.forEach((msg) => console.warn(`  - ${msg}`))
  }
}

// Executar verificação apenas no servidor
if (typeof window === 'undefined') {
  logEnvironmentStatus()
}
