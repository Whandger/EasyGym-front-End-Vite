import { useTrainingContext } from "../../context/TrainingContext";
import TrainingCard from "../shared/TrainingCard";
import type { ExerciseFormData, TrainingRecord } from "../../types";

interface Props {
  records: TrainingRecord[];
}

export default function HistoryList({ records }: Props) {
  const { updateTrainingRecord, deleteTrainingRecord } = useTrainingContext();

  if (records.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-800 w-full justify-center flex items-center h-16 mt-2 rounded-lg shadow-md p-4">
        <p className="text-gray-500 dark:text-gray-400">
          {records.length === 0 && history.length > 0
            ? "Nenhum treino encontrado para o período selecionado"
            : "Nenhum treino realizado ainda"}
        </p>
      </section>
    );
  }

  // Ordenar do mais recente para o mais antigo (considerando data + hora)
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(`${a.data.split('/').reverse().join('-')}T${a.hora}:00`);
    const dateB = new Date(`${b.data.split('/').reverse().join('-')}T${b.hora}:00`);
    return dateB.getTime() - dateA.getTime();
  });

  const handleEditExercise = (exerciseId: number, field: keyof ExerciseFormData, value: string) => {
    const record = records.find(r => r.exercicios.some(ex => ex.id === exerciseId));
    if (record) {
      const updatedExercicios = record.exercicios.map(ex =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      );
      updateTrainingRecord(record.id, {
        nome: record.nome,
        exercicios: updatedExercicios,
      });
    }
  };

  const handleUpdateHistory = (id: number, data: { nome: string; exercicios: ExerciseFormData[] }) => {
    updateTrainingRecord(id, data);
  };

  const handleDelete = (id: number) => {
    deleteTrainingRecord(id);
  };

  return (
    <section className="flex flex-col py-4">
      <div className="flex flex-col items-center gap-3">
        {sortedRecords.map((record) => (
          <TrainingCard
            key={record.id}
            training={{
              id: record.id,
              nome: record.nome,
              exercicios: record.exercicios,
            }}
            duracao={record.duracao}
            dataTreino={record.data}
            isHistoryMode={true}
            onUpdateHistory={handleUpdateHistory}
            onEditExercise={handleEditExercise}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}