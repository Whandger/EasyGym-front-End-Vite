// src/hooks/useTreinoSummary.ts
import { useState } from 'react';
import { useTrainingContext } from '../context/TrainingContext';
import type { Training } from '../types';

export function useTreinoSummary() {
  const { trainings } = useTrainingContext();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const training: Training | null = trainings.length > 0 ? trainings[selectedIndex] : null;

  const selectTraining = (index: number) => {
    setSelectedIndex(index);
  };

  return {
    training,
    trainings,
    selectedIndex,
    selectTraining,
  };
}