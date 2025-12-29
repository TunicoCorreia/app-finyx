'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Plus,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Trash2,
  Edit,
} from 'lucide-react';
import type { Transaction } from '@/lib/types';

interface SpreadsheetsProps {
  transactions: Transaction[];
}

interface Spreadsheet {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  rows: number;
  lastModified: string;
}

export function SpreadsheetsSection({ transactions }: SpreadsheetsProps) {
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([
    {
      id: '1',
      name: 'Orçamento Mensal 2024',
      description: 'Planejamento financeiro completo',
      createdAt: '2024-01-01',
      rows: 45,
      lastModified: '2024-01-15',
    },
    {
      id: '2',
      name: 'Controle de Investimentos',
      description: 'Acompanhamento de carteira',
      createdAt: '2024-01-10',
      rows: 28,
      lastModified: '2024-01-14',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSpreadsheet, setNewSpreadsheet] = useState({
    name: '',
    description: '',
  });

  const handleCreateSpreadsheet = () => {
    if (!newSpreadsheet.name) return;

    const spreadsheet: Spreadsheet = {
      id: Date.now().toString(),
      name: newSpreadsheet.name,
      description: newSpreadsheet.description,
      createdAt: new Date().toISOString().split('T')[0],
      rows: 0,
      lastModified: new Date().toISOString().split('T')[0],
    };

    setSpreadsheets([...spreadsheets, spreadsheet]);
    setNewSpreadsheet({ name: '', description: '' });
    setIsDialogOpen(false);
  };

  const handleDeleteSpreadsheet = (id: string) => {
    setSpreadsheets(spreadsheets.filter(s => s.id !== id));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Estatísticas das transações
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Planilhas Financeiras</h2>
          <p className="text-gray-400">Organize e analise seus dados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D] font-semibold shadow-lg shadow-[#00FF66]/20">
              <Plus className="w-4 h-4 mr-2" />
              Nova Planilha
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#00FF66]/20">
            <DialogHeader>
              <DialogTitle className="text-[#FFFFFF]">Criar Nova Planilha</DialogTitle>
              <DialogDescription className="text-gray-400">
                Defina um nome e descrição para sua planilha
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#FFFFFF]">Nome da Planilha</Label>
                <Input
                  id="name"
                  placeholder="Ex: Orçamento Mensal"
                  value={newSpreadsheet.name}
                  onChange={(e) => setNewSpreadsheet({ ...newSpreadsheet, name: e.target.value })}
                  className="bg-[#0D0D0D] border-[#00FF66]/20 text-[#FFFFFF] focus:border-[#00FF66]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#FFFFFF]">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Controle de gastos mensais"
                  value={newSpreadsheet.description}
                  onChange={(e) => setNewSpreadsheet({ ...newSpreadsheet, description: e.target.value })}
                  className="bg-[#0D0D0D] border-[#00FF66]/20 text-[#FFFFFF] focus:border-[#00FF66]"
                />
              </div>
              <Button
                onClick={handleCreateSpreadsheet}
                className="w-full bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D] font-semibold"
              >
                Criar Planilha
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Receitas</p>
                <p className="text-2xl font-bold text-[#00FF66] mt-1">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#00FF66]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#00FF66]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Despesas</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Saldo</p>
                <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-[#00FF66]' : 'text-red-400'}`}>
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                balance >= 0 ? 'bg-[#00FF66]/10' : 'bg-red-500/10'
              }`}>
                <DollarSign className={`w-6 h-6 ${balance >= 0 ? 'text-[#00FF66]' : 'text-red-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Planilhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spreadsheets.map((sheet) => (
          <Card
            key={sheet.id}
            className="bg-[#1A1A1A] border-[#00FF66]/20 hover:border-[#00FF66]/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#00FF66]/10 group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#00FF66]/10 rounded-xl flex items-center justify-center group-hover:bg-[#00FF66]/20 transition-colors">
                  <FileText className="w-6 h-6 text-[#00FF66]" />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-[#00FF66]/10 hover:text-[#00FF66]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteSpreadsheet(sheet.id)}
                    className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-[#FFFFFF] mt-4">{sheet.name}</CardTitle>
              <CardDescription className="text-gray-400">{sheet.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Linhas</span>
                  <Badge variant="secondary" className="bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/20">
                    {sheet.rows}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Criado em</span>
                  <span className="text-[#FFFFFF]">{formatDate(sheet.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Modificado</span>
                  <span className="text-[#FFFFFF]">{formatDate(sheet.lastModified)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D] font-semibold"
                  >
                    Abrir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card de Importação */}
      <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFFFFF]">
            <Upload className="w-5 h-5 text-[#00FF66]" />
            Importar Dados
          </CardTitle>
          <CardDescription className="text-gray-400">
            Importe planilhas existentes em formato CSV ou Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-[#00FF66]/20 rounded-xl p-8 text-center hover:border-[#00FF66]/40 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-[#00FF66] mx-auto mb-4" />
            <p className="text-[#FFFFFF] font-medium mb-2">Arraste arquivos aqui</p>
            <p className="text-sm text-gray-400 mb-4">ou clique para selecionar</p>
            <Button className="bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D] font-semibold">
              Selecionar Arquivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
