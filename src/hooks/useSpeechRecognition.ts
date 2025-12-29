'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  error: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verifica se o navegador suporta Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onresult = (event: any) => {
          const result = event.results[0][0];
          setTranscript(result.transcript);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          // Tratamento específico para cada tipo de erro
          switch (event.error) {
            case 'not-allowed':
              setError('Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.');
              setHasPermission(false);
              break;
            case 'no-speech':
              setError('Nenhuma fala detectada. Tente novamente.');
              break;
            case 'audio-capture':
              setError('Microfone não encontrado. Verifique se está conectado.');
              break;
            case 'network':
              setError('Erro de conexão. Verifique sua internet.');
              break;
            case 'aborted':
              setError('Gravação cancelada.');
              break;
            default:
              setError(`Erro no reconhecimento: ${event.error}`);
          }
          
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
        setError('Reconhecimento de voz não suportado neste navegador');
      }
    }
  }, []);

  // Função para solicitar permissão do microfone
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Verifica se está em contexto seguro (HTTPS ou localhost)
      if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError('O reconhecimento de voz requer uma conexão segura (HTTPS).');
        setHasPermission(false);
        return false;
      }

      // Verifica se getUserMedia está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Seu navegador não suporta acesso ao microfone.');
        setHasPermission(false);
        return false;
      }

      // Solicita permissão do microfone usando getUserMedia
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Se conseguiu o stream, tem permissão
      stream.getTracks().forEach(track => track.stop()); // Para o stream imediatamente
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err: any) {
      // Suprime o log de erro no console para evitar poluição
      // console.error('Permission denied:', err);
      
      // Tratamento detalhado de erros
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Você negou o acesso ao microfone. Para usar este recurso, clique no ícone de cadeado/microfone na barra de endereço do navegador e permita o acesso.');
        setHasPermission(false);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('Nenhum microfone foi encontrado. Conecte um microfone e tente novamente.');
        setHasPermission(false);
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Não foi possível acessar o microfone. Ele pode estar sendo usado por outro aplicativo.');
        setHasPermission(false);
      } else if (err.name === 'OverconstrainedError') {
        setError('As configurações de áudio solicitadas não são suportadas pelo seu microfone.');
        setHasPermission(false);
      } else if (err.name === 'SecurityError') {
        setError('Erro de segurança ao acessar o microfone. Verifique se está usando HTTPS.');
        setHasPermission(false);
      } else if (err.name === 'TypeError') {
        setError('Erro ao solicitar permissão. Seu navegador pode não suportar este recurso.');
        setHasPermission(false);
      } else {
        setError('Erro desconhecido ao solicitar permissão do microfone. Tente novamente.');
        setHasPermission(false);
      }
      
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!recognition) {
      setError('Reconhecimento de voz não inicializado');
      return;
    }

    if (isListening) {
      return;
    }

    // Verifica e solicita permissão antes de iniciar
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        return; // Não inicia se não tiver permissão
      }
    }

    setError(null);
    setTranscript('');
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      
      // Se der erro de "already started", para e tenta novamente
      if (err.message && err.message.includes('already started')) {
        try {
          recognition.stop();
          setTimeout(() => {
            recognition.start();
            setIsListening(true);
          }, 100);
        } catch (retryErr) {
          setError('Erro ao iniciar gravação. Tente novamente.');
        }
      } else {
        setError('Erro ao iniciar gravação. Verifique as permissões do microfone.');
      }
    }
  }, [recognition, isListening, hasPermission, requestPermission]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error,
    hasPermission,
    requestPermission,
  };
}
