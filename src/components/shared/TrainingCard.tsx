import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Training, ExerciseFormData, ExercicioJSON } from "../../types";
import ExerciseRow from "../Training/ExerciseRow";
import { useExerciciosData } from "../../hooks/useExerciciosData";
import AddEXButton from "../shared/AddEXButton";
import ModalExercicioJson from "../shared/ExercicioJsonModal";
import { generateExerciseId } from "../../utils/generateId";
import { getExpandedIds, toggleExpandedId } from "../../utils/expandedCards";

interface Props {
  training: Training;
  onDelete?: (id: number) => void;
  onUpdateTraining?: (
    id: number,
    data: { nome: string; exercicios: ExerciseFormData[] },
  ) => void;
  // Histórico
  duracao?: string;
  dataTreino?: string;
  isHistoryMode?: boolean;
  // Callbacks específicos do histórico
  onUpdateHistory?: (
    id: number,
    data: { nome: string; exercicios: ExerciseFormData[] },
  ) => void;
  onEditExercise?: (
    exerciseId: number,
    field: keyof ExerciseFormData,
    value: string,
  ) => void;
}

export default function TrainingCard({
  training,
  onDelete,
  onUpdateTraining,
  duracao,
  dataTreino,
  isHistoryMode = false,
  onUpdateHistory,
  onEditExercise,
}: Props) {
  const baseUrl = import.meta.env.BASE_URL;
  const exerciciosData = useExerciciosData();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(() => {
    const expandedIds = getExpandedIds();
    return expandedIds.includes(training.id);
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableTraining, setEditableTraining] = useState<Training>(() => ({
    ...training,
  }));

  const [modalExercise, setModalExercise] = useState<ExercicioJSON | null>(null);
  // Edição rápida de peso
  const [editingPesoId, setEditingPesoId] = useState<number | null>(null);
  const [editPesoValue, setEditPesoValue] = useState("");

  const startEditing = () => {
    setEditableTraining({
      ...training,
      exercicios: training.exercicios.map((ex) => ({ ...ex })),
    });
    setIsEditing(true);
  };

  const saveEditing = () => {
    const exerciciosComId = editableTraining.exercicios.map((ex) => ({
      ...ex,
      id: ex.id || generateExerciseId(),
    }));

    if (isHistoryMode) {
      onUpdateHistory?.(training.id, {
        nome: editableTraining.nome,
        exercicios: exerciciosComId,
      });
    } else {
      onUpdateTraining?.(training.id, {
        nome: editableTraining.nome,
        exercicios: exerciciosComId,
      });
    }
    setIsEditing(false);
  };

  const handleToggleExpand = () => {
    if (isEditing) {
      if (confirm("Descartar alterações?")) {
        setIsEditing(false);
        const newExpanded = toggleExpandedId(training.id); // usa o helper
        setExpanded(newExpanded);
      }
    } else {
      const newExpanded = toggleExpandedId(training.id);
      setExpanded(newExpanded);
    }
  };

  const updateEditableExercise = (
    index: number,
    field: keyof ExerciseFormData,
    value: string,
  ) => {
    setEditableTraining((prev) => {
      const newExs = [...prev.exercicios];
      newExs[index] = { ...newExs[index], [field]: value };
      return { ...prev, exercicios: newExs };
    });
  };

  const removeEditableExercise = (index: number) => {
    setEditableTraining((prev) => ({
      ...prev,
      exercicios: prev.exercicios.filter((_, i) => i !== index),
    }));
  };

  const addEmptyExercise = () => {
    setEditableTraining((prev) => ({
      ...prev,
      exercicios: [
        ...prev.exercicios,
        {
          id: generateExerciseId(),
          nomeExercicio: "",
          serie: "",
          repeticoes: "",
          peso: "",
        },
      ],
    }));
  };

  const getInitialMuscle = (ex: ExerciseFormData): string | undefined => {
    if (!ex.jsonId) return undefined;
    const jsonEx = exerciciosData.find((e) => e.exerciseId === ex.jsonId);
    if (jsonEx && jsonEx.musculoAlvo.length > 0) {
      return jsonEx.musculoAlvo[0];
    }
    return undefined;
  };

  const startEditingPeso = (ex: ExerciseFormData) => {
    if (!ex.id) return;
    setEditingPesoId(ex.id);
    setEditPesoValue(ex.peso || "");
  };

  const savePeso = (ex: ExerciseFormData) => {
    if (!ex.id || !onEditExercise) return;
    onEditExercise(ex.id, "peso", editPesoValue);
    setEditingPesoId(null);
    setEditPesoValue("");
  };

  return (
    <div className="w-[92%] bg-white dark:bg-gray-800 rounded-lg shadow border border-[#3498db] overflow-hidden transition-all">
      {/* Cabeçalho */}
      <div
        onClick={handleToggleExpand}
        className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
          expanded
            ? "bg-[#e9e9e9] dark:bg-gray-700 rounded-t-lg border-b border-[#3498db]"
            : "bg-[#f9f9f9] dark:bg-gray-800 rounded-lg"
        }`}
      >
        <div className="flex items-center gap-3">
          {isEditing ? (
            <input
              className="font-bold text-[#2c3e50] dark:text-gray-200 border-b-2 border-[#3498db] outline-none bg-transparent"
              value={editableTraining.nome}
              onChange={(e) =>
                setEditableTraining((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-bold text-[#2c3e50] dark:text-gray-200">{training.nome}</span>
          )}
          {dataTreino && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{dataTreino}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {duracao && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {duracao}
            </span>
          )}
          <span className="bg-[#3498db] text-white text-xs px-3 py-1 rounded-full">
            {training.exercicios.length} exercícios
          </span>
        </div>
      </div>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="border-t-2 border-[#3498db]">
          {/* Cabeçalho da tabela */}
          {isEditing ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#34495e] dark:bg-gray-700 text-white font-bold text-sm">
              <span className="w-20 sm:w-24 text-center">Músculo</span>
              <span className="flex-1">Exercício</span>
              <span className="w-12 text-center">Séries</span>
              <span className="w-12 text-center">Reps</span>
              <span className="w-12 text-center">Peso</span>
              <span className="w-6"></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#34495e] dark:bg-gray-700 text-white font-bold text-sm">
              <span className="flex-1 min-w-0">Exercício</span>
              <span className="w-12 shrink-0 text-center">Séries</span>
              <span className="w-12 shrink-0 text-center">Reps</span>
              <span className="w-14 shrink-0 text-center">Peso</span>
              {isHistoryMode && <span className="w-8 shrink-0"></span>}
              {!isHistoryMode && <span className="w-6 shrink-0"></span>}
            </div>
          )}

          {/* Lista de exercícios */}
          {isEditing ? (
            <div className="flex flex-col gap-2 px-4 py-2">
              {editableTraining.exercicios.map((ex, idx) => (
                <ExerciseRow
                  key={ex.id || idx}
                  values={ex}
                  exerciciosData={exerciciosData}
                  onChange={(field, value) =>
                    updateEditableExercise(idx, field, value)
                  }
                  showDelete={true}
                  onDelete={() => removeEditableExercise(idx)}
                  initialMuscle={getInitialMuscle(ex)}
                  initialExerciseId={ex.jsonId}
                />
              ))}
              {/* Adicionar exercício apenas no modo treino, não no histórico */}
              {!isHistoryMode && <AddEXButton onClick={addEmptyExercise} />}
            </div>
          ) : (
            <div>
              {training.exercicios.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <span
                    className={`flex-1 truncate ${
                      ex.jsonId
                        ? "text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ex.jsonId) {
                        navigate(`/exercicio/${ex.jsonId}`);
                      }
                    }}
                  >
                    {ex.nomeExercicio || "-"}
                  </span>
                  <span className="w-12 text-center text-gray-600 dark:text-gray-300">{ex.serie || "-"}</span>
                  <span className="w-12 text-center text-gray-600 dark:text-gray-300">{ex.repeticoes || "-"}</span>
                  <span className="w-14 text-center">
                    {isHistoryMode && editingPesoId === ex.id ? (
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        value={editPesoValue}
                        onChange={(e) => setEditPesoValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") savePeso(ex);
                          if (e.key === "Escape") {
                            setEditingPesoId(null);
                            setEditPesoValue("");
                          }
                        }}
                        onBlur={() => savePeso(ex)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isHistoryMode && !isEditing && onEditExercise)
                            startEditingPeso(ex);
                        }}
                        className={
                          isHistoryMode && !isEditing
                            ? "cursor-pointer hover:text-[#3588d4] dark:hover:text-blue-400 text-gray-600 dark:text-gray-300"
                            : "text-gray-600 dark:text-gray-300"
                        }
                      >
                        {ex.peso ? `${ex.peso} kg` : "-"}
                      </span>
                    )}
                  </span>

                  {/* Espaço da lixeira no modo treino original */}
                  {!isHistoryMode && <span className="w-6"></span>}
                  {/* No histórico, se não estiver editando e sem ícone de peso, espaço vazio */}
                  {isHistoryMode && !isEditing && editingPesoId !== ex.id && (
                    <span className="w-8"></span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer com ações */}
          <div className="flex gap-2 px-4 py-2 items-center justify-end border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <span className="cursor-pointer" onClick={startEditing}>
                  🖊
                </span>
              ) : (
                <>
                  <img
                    src={`${baseUrl}trash_icon.svg`}
                    alt="Excluir"
                    className="h-6 w-6 opacity-60 cursor-pointer hover:opacity-100 dark:invert"
                    onClick={() => onDelete?.(training.id)}
                  />
                  <span className="cursor-pointer" onClick={saveEditing}>
                    ✔️
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {modalExercise && (
        <ModalExercicioJson
          exercise={modalExercise}
          onClose={() => setModalExercise(null)}
        />
      )}
    </div>
  );
}