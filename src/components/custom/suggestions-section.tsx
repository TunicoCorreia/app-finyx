'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  PiggyBank,
  CreditCard,
  ShoppingCart,
  Home,
  Car,
} from 'lucide-react';
import type { Transaction } from '@/lib/types';

interface SuggestionsProps {
  transactions: Transaction[];
}

interface Suggestion {
  id: string;
  type: 'warning' | 'tip' | 'goal' | 'achievement';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: any;
  feedback?: 'liked' | 'disliked' | null;
}

export function SuggestionsSection({ transactions }: SuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'warning',
      category: 'Gastos',
      title: 'Gastos com alimentação acima da média',
      description: 'Seus gastos com alimentação aumentaram 35% este mês. Considere planejar refeições em casa.',
      impact: 'high',
      icon: ShoppingCart,
      feedback: null,
    },
    {
      id: '2',
      type: 'tip',
      category: 'Economia',
      title: 'Oportunidade de economia',
      description: 'Você pode economizar R$ 450/mês reduzindo gastos com transporte. Considere caronas ou transporte público.',
      impact: 'medium',
      icon: Car,
      feedback: null,
    },
    {
      id: '3',
      type: 'goal',
      category: 'Meta',
      title: 'Você está perto da sua meta!',
      description: 'Faltam apenas R$ 800 para atingir sua meta de economia mensal. Continue assim!',
      impact: 'high',
      icon: Target,
      feedback: null,
    },
    {
      id: '4',
      type: 'achievement',
      category: 'Conquista',
      title: 'Parabéns! Meta de economia atingida',
      description: 'Você economizou 20% da sua renda este mês. Excelente trabalho!',
      impact: 'high',
      icon: CheckCircle2,
      feedback: null,
    },
    {
      id: '5',
      type: 'tip',
      category: 'Investimento',
      title: 'Hora de investir',
      description: 'Você tem R$ 2.500 parados na conta. Considere investir em renda fixa para rentabilizar.',
      impact: 'medium',
      icon: PiggyBank,
      feedback: null,
    },
    {
      id: '6',
      type: 'warning',
      category: 'Cartão',
      title: 'Limite do cartão próximo',
      description: 'Você já utilizou 85% do limite do seu cartão de crédito. Cuidado para não ultrapassar.',
      impact: 'high',
      icon: CreditCard,
      feedback: null,
    },
  ]);

  const handleFeedback = (id: string, feedback: 'liked' | 'disliked') => {
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, feedback: s.feedback === feedback ? null : feedback } : s
    ));
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          textColor: 'text-orange-400',
          badgeColor: 'bg-orange-500/20 text-orange-400',
        };
      case 'tip':
        return {
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          textColor: 'text-blue-400',
          badgeColor: 'bg-blue-500/20 text-blue-400',
        };
      case 'goal':
        return {
          bgColor: 'bg-[#00FF66]/10',
          borderColor: 'border-[#00FF66]/20',
          textColor: 'text-[#00FF66]',
          badgeColor: 'bg-[#00FF66]/20 text-[#00FF66]',
        };
      case 'achievement':
        return {
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          textColor: 'text-purple-400',
          badgeColor: 'bg-purple-500/20 text-purple-400',
        };
      default:
        return {
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          textColor: 'text-gray-400',
          badgeColor: 'bg-gray-500/20 text-gray-400',
        };
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/20">Alto Impacto</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">Médio Impacto</Badge>;
      case 'low':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Baixo Impacto</Badge>;
      default:
        return null;
    }
  };

  // Estatísticas
  const totalSuggestions = suggestions.length;
  const highImpact = suggestions.filter(s => s.impact === 'high').length;
  const likedSuggestions = suggestions.filter(s => s.feedback === 'liked').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Sugestões Personalizadas</h2>
          <p className="text-gray-400">Insights inteligentes para suas finanças</p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00FF66]" />
          <span className="text-sm text-gray-400">Atualizado agora</span>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total de Sugestões</p>
                <p className="text-2xl font-bold text-[#FFFFFF] mt-1">{totalSuggestions}</p>
              </div>
              <div className="w-12 h-12 bg-[#00FF66]/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#00FF66]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Alto Impacto</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">{highImpact}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#00FF66]/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Úteis</p>
                <p className="text-2xl font-bold text-[#00FF66] mt-1">{likedSuggestions}</p>
              </div>
              <div className="w-12 h-12 bg-[#00FF66]/10 rounded-xl flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-[#00FF66]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Sugestões */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const config = getTypeConfig(suggestion.type);
          const Icon = suggestion.icon;

          return (
            <Card
              key={suggestion.id}
              className={`bg-[#1A1A1A] ${config.borderColor} hover:border-opacity-40 transition-all duration-300 shadow-xl hover:shadow-2xl group`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${config.textColor}`} />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={config.badgeColor}>
                            {suggestion.category}
                          </Badge>
                          {getImpactBadge(suggestion.impact)}
                        </div>
                        <h3 className="text-lg font-semibold text-[#FFFFFF] mb-1">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFeedback(suggestion.id, 'liked')}
                        className={`border-[#00FF66]/20 hover:bg-[#00FF66]/10 ${
                          suggestion.feedback === 'liked'
                            ? 'bg-[#00FF66]/20 text-[#00FF66]'
                            : 'text-gray-400'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Útil
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFeedback(suggestion.id, 'disliked')}
                        className={`border-red-500/20 hover:bg-red-500/10 ${
                          suggestion.feedback === 'disliked'
                            ? 'bg-red-500/20 text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Não útil
                      </Button>
                      <Button
                        size="sm"
                        className="ml-auto bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/20"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Card de Feedback */}
      <Card className="bg-gradient-to-br from-[#00FF66]/10 to-emerald-500/10 border-[#00FF66]/20 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00FF66]/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00FF66]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#FFFFFF] mb-1">
                Ajude-nos a melhorar
              </h3>
              <p className="text-sm text-gray-400">
                Seu feedback nos ajuda a fornecer sugestões mais relevantes e personalizadas
              </p>
            </div>
            <Button className="bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0D0D0D] font-semibold">
              Enviar Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
