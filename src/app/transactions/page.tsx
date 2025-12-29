'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionForm } from '@/components/custom/transaction-form';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  Wallet,
} from 'lucide-react';
import type { Transaction, TransactionType, Category } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import Link from 'next/link';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'salary',
      amount: 5000,
      description: 'Salário mensal',
      date: '2024-01-05',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'expense',
      category: 'food',
      amount: 450,
      description: 'Supermercado',
      date: '2024-01-10',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'expense',
      category: 'transport',
      amount: 200,
      description: 'Combustível',
      date: '2024-01-12',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      type: 'expense',
      category: 'housing',
      amount: 1200,
      description: 'Aluguel',
      date: '2024-01-15',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      type: 'income',
      category: 'freelance',
      amount: 1500,
      description: 'Projeto freelance',
      date: '2024-01-18',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      type: 'expense',
      category: 'entertainment',
      amount: 150,
      description: 'Cinema e jantar',
      date: '2024-01-20',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | Category>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          CATEGORY_LABELS[t.category].toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, filterCategory]);

  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions([...transactions, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Deseja realmente excluir esta transação?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Transações
                </h1>
                <p className="text-sm text-gray-400">Gerencie suas movimentações</p>
              </div>
            </div>
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Total de Transações</CardDescription>
              <CardTitle className="text-2xl text-white">{summary.count}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-emerald-100">Receitas</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(summary.totalIncome)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-100">Despesas</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(summary.totalExpense)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} text-white shadow-lg`}>
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-100">Saldo</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(summary.balance)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="w-5 h-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as any)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterCategory('all');
                }}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                Limpar Filtros
              </Button>
              <Button variant="outline" size="sm" className="ml-auto bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="shadow-lg bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Lista de Transações</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação encontrada' : 'transações encontradas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-emerald-900'
                          : 'bg-red-900'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {transaction.description || CATEGORY_LABELS[transaction.category]}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {CATEGORY_LABELS[transaction.category]}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
