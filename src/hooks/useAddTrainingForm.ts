import { useState } from 'react';
import type { ExerciseFormData } from '../types';
import { generateExerciseId } from '../utils/generateId';

interface AddTrainingData {
  nome: string;
  exercicios: ExerciseFormData[];
}

interface Params {
  onAdd: (data: AddTrainingData) => void;
}

export function useAddTrainingForm({ onAdd }: Params) {
  const [nomeTreino, setNomeTreino] = useState('');

  const [exercicios, setExercicios] = useState<ExerciseFormData[]>([
    {
      id: generateExerciseId(),
      nomeExercicio: '',
      serie: '',
      repeticoes: '',
      peso: '',
    },
  ]);

  function addRow() {
    setExercicios([
      ...exercicios,
      {
        id: generateExerciseId(),
        nomeExercicio: '',
        serie: '',
        repeticoes: '',
        peso: '',
      },
    ]);
  }

  function updateRow(
    index: number,
    field: keyof ExerciseFormData,
    value: string
  ) {
    setExercicios(prev => {
      const newExercicios = [...prev];
      newExercicios[index] = {
        ...newExercicios[index],
        [field]: value,
      };
      return newExercicios;
    });
  }

  function resetForm() {
    setNomeTreino('');
    setExercicios([
      {
        id: generateExerciseId(),
        nomeExercicio: '',
        serie: '',
        repeticoes: '',
        peso: '',
      },
    ]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nomeTreino.trim()) {
      return alert('Informe o nome do treino');
    }

    const validExercises = exercicios.filter((ex) =>
      ex.nomeExercicio.trim()
    );

    if (validExercises.length === 0) {
      return alert('Adicione pelo menos um exercício');
    }

    onAdd({
      nome: nomeTreino,
      exercicios: validExercises,
    });

    resetForm();
  }

  return {
    nomeTreino,
    exercicios,
    setNomeTreino,
    addRow,
    updateRow,
    handleSubmit,
  };
}