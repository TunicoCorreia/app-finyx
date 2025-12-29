import type { TransactionType, TransactionCategory } from './types';

export interface ParsedTransaction {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  confidence: number;
}

// Palavras-chave para identificar tipo de transação
const INCOME_KEYWORDS = [
  'recebi', 'receber', 'entrada', 'ganho', 'ganhei', 'salário', 
  'pagamento', 'depósito', 'crédito', 'rendimento'
];

const EXPENSE_KEYWORDS = [
  'gastei', 'gastar', 'paguei', 'pagar', 'comprei', 'comprar',
  'saída', 'despesa', 'débito', 'gasto'
];

// Mapeamento de categorias por palavras-chave
const CATEGORY_KEYWORDS: Record<string, TransactionCategory> = {
  // Alimentação
  'mercado': 'food',
  'supermercado': 'food',
  'comida': 'food',
  'restaurante': 'food',
  'lanche': 'food',
  'almoço': 'food',
  'jantar': 'food',
  'café': 'food',
  'padaria': 'food',
  
  // Transporte
  'uber': 'transport',
  'taxi': 'transport',
  'ônibus': 'transport',
  'metrô': 'transport',
  'combustível': 'transport',
  'gasolina': 'transport',
  'transporte': 'transport',
  'estacionamento': 'transport',
  
  // Moradia
  'aluguel': 'housing',
  'condomínio': 'housing',
  'água': 'housing',
  'luz': 'housing',
  'energia': 'housing',
  'internet': 'housing',
  'gás': 'housing',
  
  // Saúde
  'médico': 'health',
  'farmácia': 'health',
  'remédio': 'health',
  'consulta': 'health',
  'hospital': 'health',
  'dentista': 'health',
  
  // Entretenimento
  'cinema': 'entertainment',
  'show': 'entertainment',
  'festa': 'entertainment',
  'lazer': 'entertainment',
  'streaming': 'entertainment',
  'netflix': 'entertainment',
  'spotify': 'entertainment',
  
  // Educação
  'curso': 'education',
  'faculdade': 'education',
  'escola': 'education',
  'livro': 'education',
  'material': 'education',
  
  // Compras
  'roupa': 'shopping',
  'sapato': 'shopping',
  'loja': 'shopping',
  'compra': 'shopping',
  
  // Salário
  'salário': 'salary',
  'pagamento': 'salary',
  'freelance': 'freelance',
  'freela': 'freelance',
  
  // Investimentos
  'investimento': 'investment',
  'ação': 'investment',
  'fundo': 'investment',
  'renda': 'investment',
  
  // PIX
  'pix': 'pix',
  'transferência': 'pix',
};

// Palavras-chave para datas
const DATE_KEYWORDS: Record<string, number> = {
  'hoje': 0,
  'agora': 0,
  'ontem': -1,
  'anteontem': -2,
};

/**
 * Extrai o valor monetário do texto
 */
function extractAmount(text: string): number | null {
  // Padrões para valores monetários
  const patterns = [
    /(\d+(?:[.,]\d{1,2})?)\s*(?:reais?|r\$|brl)/i,
    /r\$\s*(\d+(?:[.,]\d{1,2})?)/i,
    /(\d+(?:[.,]\d{1,2})?)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = match[1].replace(',', '.');
      return parseFloat(value);
    }
  }

  return null;
}

/**
 * Identifica o tipo de transação (receita ou despesa)
 */
function extractType(text: string): TransactionType {
  const lowerText = text.toLowerCase();
  
  const hasIncomeKeyword = INCOME_KEYWORDS.some(keyword => 
    lowerText.includes(keyword)
  );
  
  const hasExpenseKeyword = EXPENSE_KEYWORDS.some(keyword => 
    lowerText.includes(keyword)
  );

  // Se ambos ou nenhum, assume despesa como padrão
  if (hasIncomeKeyword && !hasExpenseKeyword) {
    return 'income';
  }
  
  return 'expense';
}

/**
 * Identifica a categoria da transação
 */
function extractCategory(text: string, type: TransactionType): TransactionCategory {
  const lowerText = text.toLowerCase();
  
  // Procura por palavras-chave de categoria
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lowerText.includes(keyword)) {
      return category;
    }
  }
  
  // Categorias padrão baseadas no tipo
  if (type === 'income') {
    return 'salary';
  }
  
  return 'other';
}

/**
 * Extrai a data da transação
 */
function extractDate(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Procura por palavras-chave de data relativa
  for (const [keyword, daysOffset] of Object.entries(DATE_KEYWORDS)) {
    if (lowerText.includes(keyword)) {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      return date.toISOString().split('T')[0];
    }
  }
  
  // Procura por padrões de data específica
  const datePatterns = [
    /dia\s+(\d{1,2})/i,
    /(\d{1,2})\s+de\s+\w+/i,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const day = parseInt(match[1]);
      const date = new Date();
      date.setDate(day);
      return date.toISOString().split('T')[0];
    }
  }
  
  // Padrão: hoje
  return new Date().toISOString().split('T')[0];
}

/**
 * Gera uma descrição limpa da transação
 */
function generateDescription(text: string, category: TransactionCategory): string {
  // Remove palavras-chave comuns e mantém o essencial
  let description = text
    .toLowerCase()
    .replace(/gastei|recebi|paguei|comprei|adicionar|gasto|entrada/gi, '')
    .replace(/\d+(?:[.,]\d{1,2})?\s*(?:reais?|r\$|brl)/gi, '')
    .replace(/hoje|ontem|agora|anteontem/gi, '')
    .trim();
  
  // Se a descrição ficou vazia, usa a categoria
  if (!description || description.length < 3) {
    const categoryLabels: Record<TransactionCategory, string> = {
      food: 'Alimentação',
      transport: 'Transporte',
      housing: 'Moradia',
      health: 'Saúde',
      entertainment: 'Entretenimento',
      education: 'Educação',
      shopping: 'Compras',
      salary: 'Salário',
      freelance: 'Freelance',
      investment: 'Investimento',
      pix: 'Transferência PIX',
      other: 'Outros',
    };
    return categoryLabels[category];
  }
  
  // Capitaliza a primeira letra
  return description.charAt(0).toUpperCase() + description.slice(1);
}

/**
 * Calcula a confiança da análise
 */
function calculateConfidence(
  text: string,
  amount: number | null,
  type: TransactionType,
  category: TransactionCategory
): number {
  let confidence = 0;
  
  // Tem valor? +40%
  if (amount !== null) confidence += 40;
  
  // Tipo identificado com palavra-chave? +30%
  const lowerText = text.toLowerCase();
  const hasTypeKeyword = 
    (type === 'income' && INCOME_KEYWORDS.some(k => lowerText.includes(k))) ||
    (type === 'expense' && EXPENSE_KEYWORDS.some(k => lowerText.includes(k)));
  if (hasTypeKeyword) confidence += 30;
  
  // Categoria identificada? +30%
  if (category !== 'other') confidence += 30;
  
  return Math.min(confidence, 100);
}

/**
 * Função principal: analisa o texto e retorna uma transação estruturada
 */
export function parseTransactionFromSpeech(text: string): ParsedTransaction | null {
  if (!text || text.trim().length === 0) {
    return null;
  }
  
  const amount = extractAmount(text);
  
  // Se não encontrou valor, não pode criar transação
  if (amount === null) {
    return null;
  }
  
  const type = extractType(text);
  const category = extractCategory(text, type);
  const date = extractDate(text);
  const description = generateDescription(text, category);
  const confidence = calculateConfidence(text, amount, type, category);
  
  return {
    type,
    amount,
    category,
    description,
    date,
    confidence,
  };
}
