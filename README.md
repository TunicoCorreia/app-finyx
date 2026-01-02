# Finyx - Gestão Financeira Premium

Sistema completo de gestão financeira com interface moderna e recursos avançados.

## 🚀 Funcionalidades

- ✅ Dashboard interativo com gráficos
- ✅ Registro de transações (receitas e despesas)
- ✅ Registro por voz com IA
- ✅ Gestão de contas bancárias
- ✅ Metas financeiras
- ✅ Relatórios e análises
- ✅ Exportação de planilhas
- ✅ Sugestões inteligentes com IA
- ✅ Gestão de empresas/fornecedores

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Conta na OpenAI (para recursos de IA)

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase (Obrigatório)
NEXT_PUBLIC_SUPABASE_URL="sua_url_do_supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_chave_anonima"
SUPABASE_SERVICE_ROLE_KEY="sua_chave_de_servico"

# PostgreSQL (Opcional - se não usar Supabase)
DATABASE_URL="postgresql://usuario:senha@host:5432/database"

# OpenAI (Opcional - para recursos de IA)
OPENAI_API_KEY="sua_chave_openai"
```

### 3. Configurar Banco de Dados Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em **SQL Editor**
4. Copie e execute o conteúdo do arquivo `supabase-init.sql`
5. Aguarde a criação das tabelas e índices

### 4. Obter Credenciais do Supabase

1. No Supabase Dashboard, vá em **Settings** → **API**
2. Copie a **URL** e cole em `NEXT_PUBLIC_SUPABASE_URL`
3. Copie a **anon/public key** e cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copie a **service_role key** e cole em `SUPABASE_SERVICE_ROLE_KEY`

## 🏃 Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Modo Produção

```bash
npm run build
npm start
```

## 📦 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no Vercel
4. Deploy automático!

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js 15:
- Netlify
- Railway
- Render
- AWS Amplify

## 🔍 Verificação de Ambiente

O sistema verifica automaticamente se todas as variáveis estão configuradas:

- ✅ Verde: Tudo configurado
- ⚠️ Amarelo: Variáveis opcionais faltando
- ❌ Vermelho: Variáveis obrigatórias faltando

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **transactions**: Receitas e despesas
- **accounts**: Contas bancárias
- **goals**: Metas financeiras
- **companies**: Empresas/fornecedores

Todas as tabelas incluem:
- `id`: UUID único
- `created_at`: Data de criação
- `updated_at`: Data de atualização automática

## 🛠️ Tecnologias

- **Next.js 15**: Framework React
- **TypeScript**: Tipagem estática
- **Tailwind CSS v4**: Estilização
- **Supabase**: Banco de dados PostgreSQL
- **Shadcn/ui**: Componentes UI
- **Recharts**: Gráficos interativos
- **OpenAI**: Inteligência artificial
- **Lucide Icons**: Ícones modernos

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não configurada"

Configure a variável `DATABASE_URL` no `.env.local` ou use o Supabase.

### Erro: "Supabase não configurado"

1. Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas
2. Execute o script `supabase-init.sql` no SQL Editor do Supabase
3. Reinicie o servidor de desenvolvimento

### Erro ao carregar transações

1. Verifique se as tabelas foram criadas no Supabase
2. Verifique as políticas RLS (Row Level Security)
3. Confira os logs do console do navegador

## 📝 Licença

Este projeto é privado e proprietário.

## 🤝 Suporte

Para suporte, entre em contato através do email ou abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js e Supabase
