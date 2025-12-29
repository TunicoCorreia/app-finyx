// Tipos do Sistema de Gestão Financeira

export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'salary' 
  | 'freelance' 
  | 'investment'
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'bills'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}

export interface CategorySummary {
  category: Category;
  total: number;
  percentage: number;
  color: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  salary: 'Salário',
  freelance: 'Freelance',
  investment: 'Investimentos',
  food: 'Alimentação',
  transport: 'Transporte',
  housing: 'Moradia',
  entertainment: 'Lazer',
  health: 'Saúde',
  education: 'Educação',
  shopping: 'Compras',
  bills: 'Contas',
  other: 'Outros'
};

export const CATEGORY_COLORS: Record<Category, string> = {
  salary: '#10b981',
  freelance: '#3b82f6',
  investment: '#8b5cf6',
  food: '#f59e0b',
  transport: '#ef4444',
  housing: '#06b6d4',
  entertainment: '#ec4899',
  health: '#14b8a6',
  education: '#6366f1',
  shopping: '#f97316',
  bills: '#84cc16',
  other: '#64748b'
};

export const INCOME_CATEGORIES: Category[] = ['salary', 'freelance', 'investment', 'other'];
export const EXPENSE_CATEGORIES: Category[] = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'education',
  'shopping',
  'bills',
  'other'
];
