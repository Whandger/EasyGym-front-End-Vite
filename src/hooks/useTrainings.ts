import { useTrainingContext } from '../context/TrainingContext';

export function useTrainings() {
  return useTrainingContext();
}