import type { ExerciseFormData } from "../../types";
import ExerciseRow from "./ExerciseRow";
import { useAddTrainingForm } from "../../hooks/useAddTrainingForm";
import { useExerciciosData } from "../../hooks/useExerciciosData";
import AddEXButton from "../shared/AddEXButton";

interface Props {
  visible: boolean;
  onAdd: (data: { nome: string; exercicios: ExerciseFormData[] }) => void;
  onCancel: () => void;
  onToggle: () => void;
}

export default function AddTrainingForm({
  visible,
  onAdd,
  onCancel,
  onToggle,
}: Props) {
  const baseUrl = import.meta.env.BASE_URL;
  const exerciciosJSON = useExerciciosData();
  const {
    nomeTreino,
    exercicios,
    setNomeTreino,
    addRow,
    updateRow,
    handleSubmit,
  } = useAddTrainingForm({ onAdd });

  return (
    <section className="w-[92%]">
      {!visible ? (
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center cursor-pointer text-[#bababa] dark:text-gray-400 text-4xl font-thin"
          onClick={onToggle}
        >
          +
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Nome do treino"
            className="border-b-2 border-[#2686cf] dark:border-blue-400 outline-none text-lg pb-1 bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
            required
          />

          {exercicios.map((ex, idx) => (
            <ExerciseRow
              key={idx}
              values={ex}
              exerciciosData={exerciciosJSON}
              onChange={(field, val) => updateRow(idx, field, val)}
            />
          ))}

          <AddEXButton onClick={addRow} />

          <div className="flex justify-end gap-4">
            <img
              src={`${baseUrl}trash_icon.svg`}
              alt="Cancelar"
              className="w-6.5 opacity-60 cursor-pointer dark:invert"
              onClick={onCancel}
            />

            <button type="submit">
              <img
                src={`${baseUrl}disk_icon.svg`}
                alt="Salvar"
                className="w-6 opacity-60 cursor-pointer dark:invert"
              />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}