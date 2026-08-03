import { useState, useRef, useEffect } from "react";
import { useTrainingContext } from "../../context/TrainingContext";
import type { Training, ExerciseFormData } from "../../types";

interface Props {
  trainings: Training[];
  training: Training | null;
  selectedIndex: number;
  onSelectTraining: (index: number) => void;
}

export default function TreinoSummary({
  trainings,
  training,
  selectedIndex,
  onSelectTraining,
}: Props) {
  const { updateExercise } = useTrainingContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [editingPesoId, setEditingPesoId] = useState<number | null>(null);
  const [editPesoValue, setEditPesoValue] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startEditingPeso = (ex: ExerciseFormData) => {
    if (!ex.id) return;
    setEditingPesoId(ex.id);
    setEditPesoValue(ex.peso || "");
  };

  const savePeso = (ex: ExerciseFormData) => {
    if (!ex.id) return;

    updateExercise(ex.id, {
      nomeExercicio: ex.nomeExercicio,
      serie: ex.serie,
      repeticoes: ex.repeticoes,
      peso: editPesoValue,
      jsonId: ex.jsonId,
    });

    setEditingPesoId(null);
    setEditPesoValue("");
  };

  const cancelPeso = () => {
    setEditingPesoId(null);
    setEditPesoValue("");
  };

  if (trainings.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-800 w-[92%] rounded-lg shadow-md p-4">
        <p className="text-gray-500 dark:text-gray-400">Nenhum treino cadastrado</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 w-[92%] rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2 relative">
        <h3 className="text-gray-700 dark:text-gray-200 font-bold text-[16px]">
          {training?.nome}
        </h3>

        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-[#3588d4] dark:text-blue-400 font-bold text-sm cursor-pointer hover:underline"
        >
          Escolher treino
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-8 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg w-48 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {trainings.map((t, index) => (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTraining(index);
                  setShowDropdown(false);
                }}
                className={`px-3 py-2 cursor-pointer text-[17px] hover:bg-blue-50 dark:hover:bg-gray-700 ${
                  index === selectedIndex
                    ? "bg-blue-100 dark:bg-blue-900/40 text-[#3588d4] dark:text-blue-300 font-bold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {t.nome}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:w-[25%] w-full gap-2">
        {training?.exercicios.map((ex) => (
          <div
            key={ex.id}
            className="flex justify-between border-b border-gray-300 dark:border-gray-600 items-baseline text-gray-600 dark:text-gray-300"
          >
            <span className="flex-1 truncate mr-2">{ex.nomeExercicio}</span>
            <span className="shrink-0 flex items-center gap-1">
              {ex.serie}x{ex.repeticoes}
              <span className="mx-1">·</span>
              {editingPesoId === ex.id ? (
                <span className="flex items-center gap-1">
                  <input
                    type="text"
                    className="w-14 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    value={editPesoValue}
                    onChange={(e) => setEditPesoValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") savePeso(ex);
                      if (e.key === "Escape") cancelPeso();
                    }}
                    autoFocus
                  />
                  <span className="text-sm dark:text-gray-300">kg</span>
                  {/* Botão de confirmar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePeso(ex);
                    }}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-500 text-lg leading-none ml-1"
                    title="Salvar"
                  >
                    ✔️
                  </button>
                  {/* Botão de cancelar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelPeso();
                    }}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 text-lg leading-none"
                    title="Cancelar"
                  >
                    ✕
                  </button>
                </span>
              ) : (
                <span
                  onClick={() => startEditingPeso(ex)}
                  className="cursor-pointer hover:text-[#3588d4] dark:hover:text-blue-400 hover:underline relative z-10"
                  title="Clique para editar o peso"
                >
                  {ex.peso ? `${ex.peso} kg` : "— kg"}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}