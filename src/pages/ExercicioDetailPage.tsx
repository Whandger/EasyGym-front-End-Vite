import { useParams, useNavigate } from 'react-router-dom';
import { useExerciciosData } from '../hooks/useExerciciosData';
import ModalExercicioJson from '../components/shared/ExercicioJsonModal';

export default function ExercicioDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercicios = useExerciciosData();
  const navigate = useNavigate();

  const exercise = exercicios.find(e => e.exerciseId === exerciseId) || null;

  const handleClose = () => navigate(-1);

  return (
    <div className="flex items-center justify-center h-full">
      {exercise ? (
        <ModalExercicioJson exercise={exercise} onClose={handleClose} />
      ) : (
        <p className="text-gray-500">Exercício não encontrado.</p>
      )}
    </div>
  );
}