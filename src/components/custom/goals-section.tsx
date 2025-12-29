'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { supabase, type Goal } from '@/lib/supabase';

export function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    target_amount: 0,
    current_amount: 0,
    deadline: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        // Atualizar meta existente
        const { error } = await supabase
          .from('goals')
          .update(formData)
          .eq('id', editingGoal.id);

        if (error) throw error;
        setEditingGoal(null);
      } else {
        // Criar nova meta
        const { error } = await supabase
          .from('goals')
          .insert([formData]);

        if (error) throw error;
        setShowForm(false);
      }

      setFormData({ name: '', target_amount: 0, current_amount: 0, deadline: '' });
      loadGoals();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      deadline: goal.deadline || '',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadGoals();
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
    setFormData({ name: '', target_amount: 0, current_amount: 0, deadline: '' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return <div className="text-white text-center py-8">Carregando metas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Minhas Metas</h2>
          <p className="text-gray-400">Acompanhe seus objetivos financeiros</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Formulário para nova meta ou edição */}
      {(showForm || editingGoal) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingGoal ? 'Editar Meta' : 'Adicionar Nova Meta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nome da Meta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Viagem de Férias"
                  required
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target" className="text-gray-300">Valor Alvo</Label>
                  <Input
                    id="target"
                    type="number"
                    step="0.01"
                    value={formData.target_amount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({ ...formData, target_amount: isNaN(value) ? 0 : value });
                    }}
                    placeholder="0.00"
                    required
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="current" className="text-gray-300">Valor Atual</Label>
                  <Input
                    id="current"
                    type="number"
                    step="0.01"
                    value={formData.current_amount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({ ...formData, current_amount: isNaN(value) ? 0 : value });
                    }}
                    placeholder="0.00"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="deadline" className="text-gray-300">Data Limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingGoal ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current_amount, goal.target_amount);
          return (
            <Card key={goal.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{goal.name}</CardTitle>
                      <CardDescription className="text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {goal.deadline ? formatDate(goal.deadline) : 'Sem prazo'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(goal)}
                      className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(goal.id)}
                      className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-white font-semibold">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400">Atual</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {formatCurrency(goal.current_amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Meta</p>
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && !showForm && !editingGoal && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Nenhuma meta cadastrada</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
