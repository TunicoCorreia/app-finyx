'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionForm } from '@/components/custom/transaction-form';
import { VoiceTransactionModal } from '@/components/custom/voice-transaction-modal';
import { ExpensePieChart, MonthlyBarChart } from '@/components/custom/charts';
import { AccountsSection } from '@/components/custom/accounts-section';
import { CompaniesSection } from '@/components/custom/companies-section';
import { GoalsSection } from '@/components/custom/goals-section';
import { SpreadsheetsSection } from '@/components/custom/spreadsheets-section';
import { SettingsSection } from '@/components/custom/settings-section';
import { SuggestionsSection } from '@/components/custom/suggestions-section';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  LayoutDashboard,
  Receipt,
  Target,
  FileText,
  Settings,
  Building2,
  Lightbulb,
  Mic,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState(false);
  const { toast } = useToast();

  const currentMonth = new Date().toISOString().substring(0, 7);

  // Carregar transações do Supabase ao iniciar
  useEffect(() => {
    // Verificar se o Supabase está configurado
    if (!isSupabaseConfigured()) {
      setSupabaseError(true);
      setIsLoading(false);
      toast({
        title: '⚠️ Supabase não configurado',
        description: 'Configure as variáveis de ambiente do Supabase para usar o banco de dados.',
        variant: 'destructive',
      });
      return;
    }

    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setSupabaseError(false);

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      if (data) {
        setTransactions(data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar transações:', error);
      setSupabaseError(true);
      
      // Mensagem de erro mais específica
      const errorMessage = error?.message || 'Erro desconhecido';
      toast({
        title: '❌ Erro ao carregar transações',
        description: `${errorMessage}. Verifique se o Supabase está configurado corretamente.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const monthSummary = useMemo(() => {
    const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    
    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions, currentMonth]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    // Verificar se o Supabase está configurado
    if (!isSupabaseConfigured()) {
      toast({
        title: '⚠️ Supabase não configurado',
        description: 'Configure as variáveis de ambiente do Supabase para salvar transações.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Mostrar toast de loading
      toast({
        title: 'Salvando transação...',
        description: 'Aguarde enquanto salvamos sua transação.',
      });

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type: newTransaction.type,
          category: newTransaction.category,
          amount: newTransaction.amount,
          description: newTransaction.description,
          date: newTransaction.date,
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao salvar:', error);
        throw error;
      }

      if (data) {
        // Adicionar a nova transação ao estado
        setTransactions([data, ...transactions]);
        
        toast({
          title: '✅ Transação salva!',
          description: 'Sua transação foi registrada com sucesso.',
          variant: 'default',
        });
      }
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      toast({
        title: '❌ Erro ao salvar',
        description: `${errorMessage}. Verifique se o Supabase está configurado corretamente.`,
        variant: 'destructive',
      });
    }
  };

  const handleMenuClick = (section: string) => {
    setActiveSection(section);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    // Parse the date string as UTC to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  // Renderiza o conteúdo baseado na seção ativa
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#00FF66] animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando transações...</p>
          </div>
        </div>
      );
    }

    // Mostrar aviso se Supabase não estiver configurado
    if (supabaseError) {
      return (
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md bg-red-900/20 border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-6 h-6" />
                Supabase não configurado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Para usar o banco de dados, você precisa configurar as variáveis de ambiente do Supabase:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
              <p className="text-sm text-gray-400">
                Clique no banner laranja acima para configurar ou adicione as variáveis no arquivo .env.local
              </p>
              <Button
                onClick={() => loadTransactions()}
                className="w-full bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D]"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (activeSection) {
      case 'contas':
        return <AccountsSection />;
      case 'empresas':
        return <CompaniesSection />;
      case 'metas':
        return <GoalsSection />;
      case 'transacoes':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Transações</h2>
                <p className="text-gray-400">Gerencie todas as suas transações</p>
              </div>
              <Button
                onClick={() => setIsVoiceModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Mic className="w-4 h-4 mr-2" />
                Registrar por Voz
              </Button>
            </div>
            <Card className="shadow-xl bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  Todas as Transações
                </CardTitle>
                <CardDescription className="text-gray-400">Histórico completo de movimentações</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Nenhuma transação registrada</p>
                    <p className="text-sm text-gray-500">Adicione sua primeira transação para começar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
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
                          <div>
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
                        <div className={`text-lg font-bold ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'planilhas':
        return <SpreadsheetsSection transactions={transactions} />;
      case 'relatorios':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Relatórios</h2>
              <p className="text-gray-400">Análises detalhadas das suas finanças</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    Despesas por Categoria
                  </CardTitle>
                  <CardDescription className="text-gray-400">Distribuição dos seus gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpensePieChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription className="text-gray-400">Receitas vs Despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyBarChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'sugestoes':
        return <SuggestionsSection transactions={transactions} />;
      case 'config':
        return <SettingsSection />;
      default:
        // Dashboard padrão
        return (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardDescription className="text-emerald-100">Receitas do Mês</CardDescription>
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <ArrowUpRight className="w-6 h-6" />
                    {formatCurrency(monthSummary.totalIncome)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-emerald-100">
                    <TrendingUp className="w-4 h-4" />
                    <span>Entradas</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardDescription className="text-red-100">Despesas do Mês</CardDescription>
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <ArrowDownRight className="w-6 h-6" />
                    {formatCurrency(monthSummary.totalExpense)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-red-100">
                    <TrendingDown className="w-4 h-4" />
                    <span>Saídas</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${monthSummary.balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} text-white border-0 shadow-2xl`}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-100">Saldo Atual</CardDescription>
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <Wallet className="w-6 h-6" />
                    {formatCurrency(monthSummary.balance)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <Calendar className="w-4 h-4" />
                    <span suppressHydrationWarning>
                      {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    Despesas por Categoria
                  </CardTitle>
                  <CardDescription className="text-gray-400">Distribuição dos seus gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpensePieChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription className="text-gray-400">Receitas vs Despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyBarChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-xl bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  Transações Recentes
                </CardTitle>
                <CardDescription className="text-gray-400">Últimas movimentações financeiras</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Nenhuma transação registrada</p>
                    <p className="text-sm text-gray-500">Adicione sua primeira transação para começar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
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
                          <div>
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
                        <div className={`text-lg font-bold ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#0D0D0D] border-b border-[#00FF66]/20 sticky top-0 z-50 shadow-lg shadow-[#00FF66]/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00FF66] to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-[#00FF66]/30">
                <Wallet className="w-6 h-6 text-[#0D0D0D]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
                  Finyx
                </h1>
                <p className="text-sm text-gray-400">Gestão Financeira Premium</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsVoiceModalOpen(true)}
                className="bg-gradient-to-r from-[#00FF66] to-emerald-500 hover:from-[#00FF66]/90 hover:to-emerald-500/90 text-[#0D0D0D] font-semibold shadow-lg shadow-[#00FF66]/20"
              >
                <Mic className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Registrar por Voz</span>
                <span className="sm:hidden">Voz</span>
              </Button>
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Menu */}
        <nav className="mb-8">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl p-4 border border-[#00FF66]/10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('dashboard')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'dashboard' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${activeSection === 'dashboard' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'dashboard' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('contas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'contas' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <Wallet className={`w-5 h-5 ${activeSection === 'contas' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'contas' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Contas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('transacoes')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'transacoes' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <Receipt className={`w-5 h-5 ${activeSection === 'transacoes' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'transacoes' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Transações</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('planilhas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'planilhas' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <FileText className={`w-5 h-5 ${activeSection === 'planilhas' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'planilhas' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Planilhas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('relatorios')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'relatorios' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <FileText className={`w-5 h-5 ${activeSection === 'relatorios' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'relatorios' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Relatórios</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('metas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'metas' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <Target className={`w-5 h-5 ${activeSection === 'metas' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'metas' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Metas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('sugestoes')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'sugestoes' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <Lightbulb className={`w-5 h-5 ${activeSection === 'sugestoes' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'sugestoes' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Sugestões</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('empresas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'empresas' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <Building2 className={`w-5 h-5 ${activeSection === 'empresas' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'empresas' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Empresas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('config')}
                className={`flex flex-col items-center gap-2 h-auto py-3 transition-all duration-300 ${
                  activeSection === 'config' 
                    ? 'bg-[#00FF66]/10 border border-[#00FF66] shadow-lg shadow-[#00FF66]/20' 
                    : 'hover:bg-[#00FF66]/5 border border-transparent'
                }`}
              >
                <Settings className={`w-5 h-5 ${activeSection === 'config' ? 'text-[#00FF66]' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${activeSection === 'config' ? 'text-[#00FF66]' : 'text-gray-400'}`}>Config</span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Conteúdo dinâmico baseado na seção ativa */}
        {renderContent()}
      </div>

      {/* Voice Transaction Modal */}
      <VoiceTransactionModal
        open={isVoiceModalOpen}
        onOpenChange={setIsVoiceModalOpen}
        onConfirm={handleAddTransaction}
      />
    </div>
  );
}
