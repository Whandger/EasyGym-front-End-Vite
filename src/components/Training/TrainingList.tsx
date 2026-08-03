import type { Training, ExerciseFormData } from '../../types';
import TrainingCard from '../shared/TrainingCard';

interface Props {
  trainings: Training[];
  onDelete: (id: number) => void;
  onUpdateTraining: (id: number, data: { nome: string; exercicios: ExerciseFormData[] }) => void;
}

export default function TrainingList({ trainings, onDelete, onUpdateTraining }: Props) {
  if (trainings.length === 0) {
    return (
      <div className="w-[92%] bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center text-gray-500 dark:text-gray-400">
        Nenhum treino encontrado
      </div>
    );
  }

  return (
    <>
      {trainings.map((training) => (
        <TrainingCard
          key={training.id}
          training={training}
          onDelete={onDelete}
          onUpdateTraining={onUpdateTraining}
        />
      ))}
    </>
  );
}