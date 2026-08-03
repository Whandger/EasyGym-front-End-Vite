import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Training, ExerciseFormData, TrainingRecord } from '../types';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface TrainingContextType {
  trainings: Training[];
  history: TrainingRecord[];
  addTraining: (data: { nome: string; exercicios: ExerciseFormData[] }) => Promise<boolean>;
  deleteTraining: (id: number) => Promise<void>;
  updateExercise: (exerciseId: number, data: ExerciseFormData) => Promise<void>;
  updateTraining: (id: number, data: { nome: string; exercicios: ExerciseFormData[] }) => Promise<void>;
  saveTrainingRecord: (training: Training, duracao: string, data: string, hora: string) => Promise<void>;
  updateTrainingRecord: (id: number, data: { nome: string; exercicios: ExerciseFormData[] }) => Promise<void>;
  deleteTrainingRecord: (id: number) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [history, setHistory] = useState<TrainingRecord[]>([]);

  // Carrega treinos e histórico do backend quando autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setTrainings([]);
      setHistory([]);
      return;
    }
    api.get('/trainings').then(setTrainings).catch(() => setTrainings([]));
    api.get('/history').then(setHistory).catch(() => setHistory([]));
  }, [isAuthenticated]);

  const addTraining = useCallback(
    async (data: { nome: string; exercicios: ExerciseFormData[] }): Promise<boolean> => {
      try {
        const created = await api.post('/trainings', data);
        setTrainings((prev) => [...prev, created]);
        return true;
      } catch {
        alert('Já existe um treino com esse nome.');
        return false;
      }
    },
    []
  );

  const deleteTraining = useCallback(async (id: number) => {
    if (!confirm('Deseja excluir este treino?')) return;
    await api.del(`/trainings/${id}`);
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Localiza a qual treino um exercício pertence e chama o endpoint específico
  const updateExercise = useCallback(
    async (exerciseId: number, data: ExerciseFormData) => {
      const training = trainings.find((t) => t.exercicios.some((ex) => ex.id === exerciseId));
      if (!training) return;

      const updated = await api.put(`/trainings/${training.id}/exercises/${exerciseId}`, data);
      setTrainings((prev) => prev.map((t) => (t.id === training.id ? updated : t)));
    },
    [trainings]
  );

  const updateTraining = useCallback(
    async (id: number, data: { nome: string; exercicios: ExerciseFormData[] }) => {
      const updated = await api.put(`/trainings/${id}`, data);
      setTrainings((prev) => prev.map((t) => (t.id === id ? updated : t)));
    },
    []
  );

  const saveTrainingRecord = useCallback(
    async (training: Training, duracao: string, data: string, hora: string) => {
      const record = await api.post('/history', {
        nome: training.nome,
        data,
        hora,
        duracao,
        exercicios: training.exercicios,
      });
      setHistory((prev) => [...prev, record]);
    },
    []
  );

  const updateTrainingRecord = useCallback(
    async (id: number, data: { nome: string; exercicios: ExerciseFormData[] }) => {
      const updated = await api.put(`/history/${id}`, data);
      setHistory((prev) => prev.map((r) => (r.id === id ? updated : r)));
    },
    []
  );

  const deleteTrainingRecord = useCallback(async (id: number) => {
    if (!confirm('Deseja excluir este registro do histórico?')) return;
    await api.del(`/history/${id}`);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <TrainingContext.Provider
      value={{
        trainings,
        history,
        addTraining,
        deleteTraining,
        updateExercise,
        updateTraining,
        saveTrainingRecord,
        updateTrainingRecord,
        deleteTrainingRecord,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
}

export function useTrainingContext() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTrainingContext deve ser usado dentro de TrainingProvider');
  }
  return context;
}