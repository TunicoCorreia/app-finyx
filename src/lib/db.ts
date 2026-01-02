import postgres from 'postgres'

// Validação da variável de ambiente
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('⚠️ ERRO: DATABASE_URL não configurada!')
  console.error('Configure a variável de ambiente DATABASE_URL no arquivo .env.local')
  throw new Error('DATABASE_URL não configurada. Configure a variável de ambiente para conectar ao banco de dados.')
}

// Configuração da conexão PostgreSQL
const sql = postgres(connectionString, {
  // Configurações de produção
  max: 10, // Máximo de conexões no pool
  idle_timeout: 20, // Tempo de inatividade antes de fechar conexão
  connect_timeout: 10, // Timeout de conexão
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false, // SSL em produção
  onnotice: () => {}, // Silenciar notices do PostgreSQL
})

// Teste de conexão (opcional, mas recomendado)
async function testConnection() {
  try {
    await sql`SELECT 1 as test`
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error)
    throw error
  }
}

// Executar teste de conexão apenas no servidor
if (typeof window === 'undefined') {
  testConnection().catch(console.error)
}

export default sql
