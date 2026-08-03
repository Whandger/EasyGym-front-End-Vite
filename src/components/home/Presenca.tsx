import { usePresenca } from "../../hooks/usePresenca";
import type { Training } from "../../types";

interface PresencaProps {
  training: Training | null;
}

export default function Presenca({ training }: PresencaProps) {
  const {
    timeString,
    horas,
    minutos,
    handleHoras,
    handleMinutos,
    feedback,
    loading,
    marcarPresenca,
  } = usePresenca({ training });

  return (
    <section
      aria-label="Registro de presença"
      className="bg-white dark:bg-gray-800 w-[92%] rounded-lg shadow-md flex flex-col items-center justify-center py-3"
    >
      <h3 className="text-gray-700 dark:text-gray-200 font-bold text-lg">
        {timeString || "Carregando..."}
      </h3>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          Duração do treino:
        </span>
        <div className="flex items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            value={horas}
            onChange={handleHoras}
            aria-label="Horas de duração do treino"
            className="w-14 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            placeholder="0"
          />
          <span className="text-gray-600 dark:text-gray-300 text-sm">h</span>
          <input
            type="text"
            inputMode="numeric"
            value={minutos}
            onChange={handleMinutos}
            aria-label="Minutos de duração do treino"
            className="w-14 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-sm text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            placeholder="0"
          />
          <span className="text-gray-600 dark:text-gray-300 text-sm">m</span>
        </div>
      </div>

      <button
        onClick={marcarPresenca}
        disabled={loading || !training}
        title={!training ? "Escolha um treino antes de marcar presença" : "Registrar presença no treino de hoje"}
        aria-busy={loading}
        className="bg-[#3588d4] dark:bg-blue-600 text-white px-4 py-1 rounded mt-3 transition
          hover:bg-blue-600 dark:hover:bg-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer"
      >
        {loading ? "Salvando..." : "Marcar presença"}
      </button>

      {feedback === "success" && (
        <p role="status" className="text-green-500 dark:text-green-400 text-sm mt-2">
          ✓ Presença registrada com sucesso!
        </p>
      )}
      {feedback === "error" && (
        <p role="alert" className="text-red-500 dark:text-red-400 text-sm mt-2">
          {!training
            ? "Selecione um treino antes de marcar presença."
            : (!horas.trim() && !minutos.trim()
              ? "Informe a duração do treino."
              : "Erro ao registrar presença. Tente novamente.")}
        </p>
      )}
    </section>
  );
}