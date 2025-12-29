'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2, CheckCircle2, XCircle, Edit2, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { parseTransactionFromSpeech, type ParsedTransaction } from '@/lib/nlp-parser';
import { CATEGORY_LABELS, type Transaction, type TransactionType, type TransactionCategory } from '@/lib/types';

interface VoiceTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export function VoiceTransactionModal({ open, onOpenChange, onConfirm }: VoiceTransactionModalProps) {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    isSupported, 
    error,
    hasPermission,
    requestPermission 
  } = useSpeechRecognition();
  
  const [parsedTransaction, setParsedTransaction] = useState<ParsedTransaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<ParsedTransaction | null>(null);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  // Verifica permissão quando o modal abre
  useEffect(() => {
    if (open && isSupported && !hasPermission) {
      setShowPermissionRequest(true);
    }
  }, [open, isSupported, hasPermission]);

  // Processa o transcript quando ele muda
  useEffect(() => {
    if (transcript && !isListening) {
      const parsed = parseTransactionFromSpeech(transcript);
      setParsedTransaction(parsed);
      setEditedTransaction(parsed);
      
      if (!parsed) {
        // Se não conseguiu parsear, mostra erro
        setTimeout(() => {
          resetTranscript();
          setParsedTransaction(null);
        }, 3000);
      }
    }
  }, [transcript, isListening, resetTranscript]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionRequest(false);
    }
  };

  const handleStartListening = async () => {
    resetTranscript();
    setParsedTransaction(null);
    setEditedTransaction(null);
    setIsEditing(false);
    await startListening();
  };

  const handleConfirm = () => {
    if (editedTransaction) {
      onConfirm({
        type: editedTransaction.type,
        category: editedTransaction.category,
        amount: editedTransaction.amount,
        description: editedTransaction.description,
        date: editedTransaction.date,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    stopListening();
    resetTranscript();
    setParsedTransaction(null);
    setEditedTransaction(null);
    setIsEditing(false);
    setShowPermissionRequest(false);
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!isSupported) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Recurso Não Disponível
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Seu navegador não suporta reconhecimento de voz. Por favor, use Chrome, Edge ou Safari.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            Registrar Transação por Voz
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fale naturalmente sobre sua transação. Exemplo: "Gastei 50 reais no mercado hoje"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Solicitação de permissão */}
          {showPermissionRequest && !hasPermission && (
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Permissão Necessária</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Para usar o reconhecimento de voz, precisamos acessar seu microfone. 
                    Clique no botão abaixo e permita o acesso quando solicitado pelo navegador.
                  </p>
                  <Button
                    onClick={handleRequestPermission}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Permitir Acesso ao Microfone
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Área de gravação */}
          {!parsedTransaction && hasPermission && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <button
                onClick={isListening ? stopListening : handleStartListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse shadow-2xl'
                    : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:scale-110 shadow-xl'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
              
              <div className="text-center">
                {isListening ? (
                  <>
                    <p className="text-lg font-semibold text-white">Ouvindo...</p>
                    <p className="text-sm text-gray-400">Fale agora</p>
                  </>
                ) : transcript ? (
                  <>
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Processando...</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-white">Clique para falar</p>
                    <p className="text-sm text-gray-400">Descreva sua transação</p>
                  </>
                )}
              </div>

              {transcript && (
                <div className="bg-gray-800 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-gray-300 italic">"{transcript}"</p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 max-w-md">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300 mb-1">Erro de Gravação</p>
                      <p className="text-sm text-red-400">{error}</p>
                      {error.includes('Permissão') && (
                        <Button
                          onClick={handleRequestPermission}
                          size="sm"
                          className="mt-3 bg-red-600 hover:bg-red-700"
                        >
                          Solicitar Permissão Novamente
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card de confirmação */}
          {parsedTransaction && !isEditing && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Transação Identificada</h3>
                    <p className="text-sm text-gray-400 italic">"{transcript}"</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      parsedTransaction.confidence >= 70 
                        ? 'bg-emerald-900 text-emerald-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}
                  >
                    {parsedTransaction.confidence}% confiança
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tipo</p>
                    <Badge className={parsedTransaction.type === 'income' ? 'bg-emerald-600' : 'bg-red-600'}>
                      {parsedTransaction.type === 'income' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Valor</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(parsedTransaction.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Categoria</p>
                    <p className="text-sm text-white">{CATEGORY_LABELS[parsedTransaction.category]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Data</p>
                    <p className="text-sm text-white">
                      {new Date(parsedTransaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Descrição</p>
                    <p className="text-sm text-white">{parsedTransaction.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </div>
            </div>
          )}

          {/* Formulário de edição */}
          {parsedTransaction && isEditing && editedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                  <Select
                    value={editedTransaction.type}
                    onValueChange={(value) => 
                      setEditedTransaction({ ...editedTransaction, type: value as TransactionType })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="income" className="text-white">Entrada</SelectItem>
                      <SelectItem value="expense" className="text-white">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-gray-300">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={editedTransaction.amount}
                    onChange={(e) => 
                      setEditedTransaction({ ...editedTransaction, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                  <Select
                    value={editedTransaction.category}
                    onValueChange={(value) => 
                      setEditedTransaction({ ...editedTransaction, category: value as TransactionCategory })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-white">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date" className="text-gray-300">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedTransaction.date}
                    onChange={(e) => 
                      setEditedTransaction({ ...editedTransaction, date: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                  <Input
                    id="description"
                    value={editedTransaction.description}
                    onChange={(e) => 
                      setEditedTransaction({ ...editedTransaction, description: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </div>

        {!parsedTransaction && (
          <DialogFooter>
            <Button onClick={handleClose} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
              Cancelar
            </Button>
            {transcript && !isListening && (
              <Button onClick={handleStartListening} className="bg-gradient-to-r from-purple-500 to-pink-600">
                Tentar Novamente
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
