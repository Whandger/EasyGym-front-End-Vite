import { useState, useEffect } from "react";
import MuscleSelect from "../shared/MuscleSelect";
import ExerciseSelect from "../shared/ExerciseSelect";
import type { ExerciseFormData, ExercicioJSON } from "../../types";

interface Props {
  values: ExerciseFormData;
  exerciciosData: ExercicioJSON[];
  onChange: (field: keyof ExerciseFormData, value: string) => void;
  showDelete?: boolean;
  onDelete?: () => void;
  initialMuscle?: string;
  initialExerciseId?: string;
}

export default function ExerciseRow({
  values,
  exerciciosData,
  onChange,
  showDelete = false,
  onDelete,
  initialMuscle,
  initialExerciseId,
}: Props) {
  const [selectedMuscle, setSelectedMuscle] = useState<string>("Músculo");
  const [validImageIds, setValidImageIds] = useState<Set<string>>(new Set());
  const [imagesLoading, setImagesLoading] = useState(true);
  const baseUrl = import.meta.env.BASE_URL;

  const muscles = [
    ...new Set(exerciciosData.flatMap((e) => e.musculoAlvo)),
  ].sort();

  // Testa todas as imagens uma vez
  useEffect(() => {
    let cancelled = false;
    const testImages = async () => {
      setImagesLoading(true);
      const results = await Promise.all(
        exerciciosData.map(async (ex) => {
          const ok = await new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = ex.gifUrl;
          });
          return { id: ex.exerciseId, ok };
        })
      );
      if (!cancelled) {
        setValidImageIds(new Set(results.filter((r) => r.ok).map((r) => r.id)));
        setImagesLoading(false);
      }
    };
    testImages();
    return () => { cancelled = true; };
  }, [exerciciosData]);

  useEffect(() => {
    if (initialMuscle && muscles.includes(initialMuscle)) {
      setSelectedMuscle(initialMuscle);
    }
    if (initialExerciseId) {
      const ex = exerciciosData.find((e) => e.exerciseId === initialExerciseId);
      if (ex) {
        onChange("nomeExercicio", ex.nome);
        onChange("jsonId", ex.exerciseId);
      }
    }
  }, []);

  const handleMuscleSelect = (muscle: string) => {
    setSelectedMuscle(muscle);
    onChange("nomeExercicio", "");
    onChange("jsonId", "");
  };

  const handleExerciseSelect = (ex: ExercicioJSON) => {
    onChange("nomeExercicio", ex.nome);
    onChange("jsonId", ex.exerciseId);
  };

  const isMuscleSelected = selectedMuscle !== "Músculo";

  // Filtra por músculo e imagens válidas
  const filteredExercises =
    isMuscleSelected
      ? exerciciosData.filter(
          (e) =>
            e.musculoAlvo.includes(selectedMuscle) &&
            validImageIds.has(e.exerciseId)
        )
      : [];

  return (
    <div className="flex items-center gap-1.5">
      {/* Músculo */}
      <div className="w-20 sm:w-24 shrink-0">
        <MuscleSelect
          muscles={muscles}
          selected={selectedMuscle}
          onSelect={handleMuscleSelect}
        />
      </div>

      {/* Exercício */}
      <div className="w-full min-w-10">
        {isMuscleSelected ? (
          <ExerciseSelect
            exercises={filteredExercises}
            selectedName={values.nomeExercicio}
            onSelect={handleExerciseSelect}
            onNameChange={(name) => onChange("nomeExercicio", name)}
            loading={imagesLoading}
          />
        ) : (
          <input
            type="text"
            placeholder="Digite o nome do exercício"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            value={values.nomeExercicio}
            onChange={(e) => onChange("nomeExercicio", e.target.value)}
            required
          />
        )}
      </div>

      {/* Séries */}
      <div className="w-12 shrink-0">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Sér."
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-1 py-1.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          value={values.serie}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, "");
            onChange("serie", onlyNumbers);
          }}
          required
        />
      </div>

      {/* Repetições */}
      <div className="w-12 shrink-0">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Rep."
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-1 py-1.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          value={values.repeticoes}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, "");
            onChange("repeticoes", onlyNumbers);
          }}
          required
        />
      </div>

      {/* Peso */}
      <div className="w-12 shrink-0">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*\.?[0-9]*"
          placeholder="Kg"
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-1 py-1.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          value={values.peso || ""}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9.]/g, "");
            const parts = val.split(".");
            if (parts.length > 2)
              val = parts[0] + "." + parts.slice(1).join("");
            onChange("peso", val);
          }}
        />
      </div>

      {/* Lixeira */}
      <div className="w-5.5 shrink-0 flex">
        {showDelete && onDelete && (
          <div className="cursor-pointer" onClick={onDelete}>
            <img
              src={`${baseUrl}trash_icon.svg`}
              alt="Excluir exercício"
              className="h-6 w-6 opacity-60 hover:opacity-100 dark:invert"
            />
          </div>
        )}
      </div>
    </div>
  );
}