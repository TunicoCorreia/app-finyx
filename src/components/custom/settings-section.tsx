'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Bell,
  Moon,
  Globe,
  Lock,
  CreditCard,
  User,
  Mail,
  Smartphone,
  Shield,
  Download,
  Trash2,
  Check,
} from 'lucide-react';

export function SettingsSection() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  const [currency, setCurrency] = useState('BRL');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Configurações</h2>
          <p className="text-gray-400">Personalize sua experiência</p>
        </div>
        {savedMessage && (
          <Badge className="bg-[#00FF66] text-[#0D0D0D] animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 mr-2" />
            Configurações salvas!
          </Badge>
        )}
      </div>

      {/* Perfil */}
      <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFFFFF]">
            <div className="w-8 h-8 bg-[#00FF66]/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#00FF66]" />
            </div>
            Perfil
          </CardTitle>
          <CardDescription className="text-gray-400">
            Informações da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00FF66] to-emerald-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#0D0D0D]" />
            </div>
            <div className="flex-1">
              <p className="text-[#FFFFFF] font-semibold">Usuário Premium</p>
              <p className="text-sm text-gray-400">usuario@finyx.app</p>
            </div>
            <Button className="bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/20">
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFFFFF]">
            <div className="w-8 h-8 bg-[#00FF66]/10 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#00FF66]" />
            </div>
            Notificações
          </CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie como você recebe alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-[#FFFFFF] font-medium">
                Notificações Push
              </Label>
              <p className="text-sm text-gray-400">Receba alertas em tempo real</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => {
                setNotifications(checked);
                handleSave();
              }}
              className="data-[state=checked]:bg-[#00FF66]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-[#FFFFFF] font-medium">
                Notificações por Email
              </Label>
              <p className="text-sm text-gray-400">Resumos semanais e alertas importantes</p>
            </div>
            <Switch
              id="email-notifications"
              defaultChecked
              onCheckedChange={handleSave}
              className="data-[state=checked]:bg-[#00FF66]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="transaction-alerts" className="text-[#FFFFFF] font-medium">
                Alertas de Transação
              </Label>
              <p className="text-sm text-gray-400">Notificar sobre novas movimentações</p>
            </div>
            <Switch
              id="transaction-alerts"
              defaultChecked
              onCheckedChange={handleSave}
              className="data-[state=checked]:bg-[#00FF66]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFFFFF]">
            <div className="w-8 h-8 bg-[#00FF66]/10 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-[#00FF66]" />
            </div>
            Aparência
          </CardTitle>
          <CardDescription className="text-gray-400">
            Personalize a interface do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="dark-mode" className="text-[#FFFFFF] font-medium">
                Modo Escuro
              </Label>
              <p className="text-sm text-gray-400">Interface dark premium</p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(checked) => {
                setDarkMode(checked);
                handleSave();
              }}
              className="data-[state=checked]:bg-[#00FF66]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-[#FFFFFF] font-medium">
              Idioma
            </Label>
            <Select value={language} onValueChange={(value) => { setLanguage(value); handleSave(); }}>
              <SelectTrigger className="bg-[#0D0D0D] border-[#00FF66]/20 text-[#FFFFFF]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#00FF66]/20">
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-[#FFFFFF] font-medium">
              Moeda
            </Label>
            <Select value={currency} onValueChange={(value) => { setCurrency(value); handleSave(); }}>
              <SelectTrigger className="bg-[#0D0D0D] border-[#00FF66]/20 text-[#FFFFFF]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#00FF66]/20">
                <SelectItem value="BRL">Real (R$)</SelectItem>
                <SelectItem value="USD">Dólar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFFFFF]">
            <div className="w-8 h-8 bg-[#00FF66]/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00FF66]" />
            </div>
            Segurança
          </CardTitle>
          <CardDescription className="text-gray-400">
            Proteja sua conta e dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="two-factor" className="text-[#FFFFFF] font-medium">
                Autenticação de Dois Fatores
              </Label>
              <p className="text-sm text-gray-400">Adicione uma camada extra de segurança</p>
            </div>
            <Switch
              id="two-factor"
              checked={twoFactor}
              onCheckedChange={(checked) => {
                setTwoFactor(checked);
                handleSave();
              }}
              className="data-[state=checked]:bg-[#00FF66]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-backup" className="text-[#FFFFFF] font-medium">
                Backup Automático
              </Label>
              <p className="text-sm text-gray-400">Salve seus dados automaticamente</p>
            </div>
            <Switch
              id="auto-backup"
              checked={autoBackup}
              onCheckedChange={(checked) => {
                setAutoBackup(checked);
                handleSave();
              }}
              className="data-[state=checked]:bg-[#00FF66]"
            />
          </div>

          <div className="pt-4 space-y-3">
            <Button className="w-full bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/20 justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            <Button className="w-full bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/20 justify-start">
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="bg-[#1A1A1A] border-red-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            Zona de Perigo
          </CardTitle>
          <CardDescription className="text-gray-400">
            Ações irreversíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Todos os Dados
          </Button>
          <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Conta
          </Button>
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D] font-semibold shadow-lg shadow-[#00FF66]/20 px-8"
        >
          <Check className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
