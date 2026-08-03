import { useState, useEffect, useRef, useCallback } from 'react';
import { useTrainingContext } from '../context/TrainingContext';
import type { Training } from '../types';

interface UsePresencaProps {
  training: Training | null;
}

export function usePresenca({ training }: UsePresencaProps) {
  const { saveTrainingRecord } = useTrainingContext();

  // Cronômetro e data/hora
  const [timeString, setTimeString] = useState('');
  const [duracaoAutomatica, setDuracaoAutomatica] = useState('0h0m');
  const startTimeRef = useRef<Date | null>(null);

  // Duração informada pelo usuário
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');

  // Feedback visual e loading
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(false);

  // Cronômetro automático
  useEffect(() => {
    const agora = new Date();
    startTimeRef.current = agora;

    function update() {
      const agora = new Date();

      const diaSemana = agora
        .toLocaleDateString('pt-BR', { weekday: 'short' })
        .replace('.', '');

      const data = agora.toLocaleDateString('pt-BR');
      const horaFormatada = String(agora.getHours()).padStart(2, '0');
      const minutoFormatado = String(agora.getMinutes()).padStart(2, '0');

      setTimeString(`${diaSemana} ${data} ${horaFormatada}:${minutoFormatado}`);

      if (startTimeRef.current) {
        const diffMs = agora.getTime() - startTimeRef.current.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const h = Math.floor(diffMin / 60);
        const m = diffMin % 60;
        setDuracaoAutomatica(`${h}h${m}m`);
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handlers para os campos de hora/minuto com validação
  const handleHoras = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 24)) {
      setHoras(val);
    }
  }, []);

  const handleMinutos = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 59)) {
      setMinutos(val);
    }
  }, []);

  // Função principal para marcar presença
  const marcarPresenca = useCallback(async () => {
    // Limpa feedback anterior
    setFeedback(null);

    if (!training) {
      setFeedback('error');
      return;
    }

    if (!horas.trim() && !minutos.trim()) {
      setFeedback('error'); // poderia ter uma mensagem específica, mas o componente trata
      return;
    }

    setLoading(true);
    try {
      const agora = new Date();
      const data = agora.toLocaleDateString('pt-BR');
      const hora = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

      const horasFinal = horas.trim() || '0';
      const minutosFinal = minutos.trim() || '0';
      const duracaoFinal = `${horasFinal}h${minutosFinal}m`;

      // Chamada assíncrona simulada
      await saveTrainingRecord(training, duracaoFinal, data, hora);

      setFeedback('success');
    } catch (error) {
      setFeedback('error');
    } finally {
      setLoading(false);
      //  esconder o feedback depois de um tempo
      setTimeout(() => setFeedback(null), 3000);
    }
  }, [training, horas, minutos, saveTrainingRecord]);

  return {
    // Dados de exibição
    timeString,
    duracaoAutomatica,

    // Campos de duração
    horas,
    minutos,
    handleHoras,
    handleMinutos,

    // Estado do processo
    feedback,
    loading,

    // Ação principal
    marcarPresenca,
  };
}