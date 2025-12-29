'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Plus, Phone, Edit, Save, X } from 'lucide-react';
import { supabase, type Company } from '@/lib/supabase';

export function CompaniesSection() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    category: '',
    contact: '',
    notes: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    notes: '',
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('companies')
        .insert([formData]);

      if (error) throw error;
      
      setFormData({ name: '', category: '', contact: '', notes: '' });
      setShowForm(false);
      loadCompanies();
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingId(company.id);
    setEditData({
      name: company.name,
      category: company.category,
      contact: company.contact || '',
      notes: company.notes || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      const { error } = await supabase
        .from('companies')
        .update(editData)
        .eq('id', editingId);

      if (error) throw error;
      
      setEditingId(null);
      loadCompanies();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', category: '', contact: '', notes: '' });
  };

  if (loading) {
    return <div className="text-white text-center py-8">Carregando empresas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Empresas e Fornecedores</h2>
          <p className="text-gray-400">Gerencie seus contatos comerciais</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Adicionar Nova Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Supermercado Central"
                  required
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Alimentação, Transporte, Serviços"
                  required
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contact" className="text-gray-300">Contato</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Ex: (11) 98765-4321"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-gray-300">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais..."
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Salvar
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors ${editingId === company.id ? 'lasy-highlight' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  {editingId === company.id ? (
                    <div className="flex-1">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="bg-gray-900 border-gray-700 text-white text-lg font-semibold"
                        placeholder="Nome da empresa"
                      />
                    </div>
                  ) : (
                    <div>
                      <CardTitle className="text-white text-lg">{company.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {company.category}
                      </CardDescription>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingId === company.id ? (
                    <>
                      <Button size="sm" onClick={handleSaveEdit} className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={handleCancelEdit} variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/10">
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleEdit(company)} variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-500/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {editingId === company.id ? (
                <>
                  <div>
                    <Label className="text-gray-300 text-sm">Categoria</Label>
                    <Input
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Categoria"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Contato</Label>
                    <Input
                      value={editData.contact}
                      onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Contato"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Observações</Label>
                    <Textarea
                      value={editData.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                      rows={2}
                      placeholder="Observações"
                    />
                  </div>
                </>
              ) : (
                <>
                  {company.contact && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{company.contact}</span>
                    </div>
                  )}
                  {company.notes && (
                    <p className="text-sm text-gray-400 mt-2">{company.notes}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && !showForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Nenhuma empresa cadastrada</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Empresa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}