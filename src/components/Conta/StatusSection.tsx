import { useStatusData } from "../../hooks/useStatusData";
import BarChart from "../shared/BarChart";
import LineChart from "../shared/LineChart";
import WorkoutHeatmap from "../shared/WorkoutHeatmap";

export default function StatusSection() {
  const {
    selectedYear,
    setSelectedYear,
    selectedMuscle,
    setSelectedMuscle,
    selectedExercise,
    setSelectedExercise,
    anosDisponiveis,
    totalTreinos,
    diasDoAno,
    percentualDiasTreinados,
    freqPorDia,
    musculos,
    exerciciosDoMusculo,
    pesoAoLongoTempo,
    treinosPorData,
  } = useStatusData();

  return (
    <div className="space-y-3.5 p-4">
      {/* Filtro de ano */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-widest whitespace-nowrap">
          <span className="material-icons text-[#185FA5] text-sm">event</span>
          Filtrar por ano
        </span>
        <select
          className="w-full md:flex-1 md:max-w-45 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 transition"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Todos os anos</option>
          {anosDisponiveis.map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      {/* Total de treinos + Frequência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Total */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-3.5">
            <span className="material-icons text-[#185FA5] text-sm">
              bar_chart
            </span>
            Total de treinos
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Treinos", value: totalTreinos },
              { label: "Dias", value: selectedYear ? diasDoAno : "–" },
              {
                label: "Freq.",
                value:
                  percentualDiasTreinados !== null
                    ? `${percentualDiasTreinados}%`
                    : "–",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg py-3 px-2 text-center"
              >
                <p className="text-[26px] font-medium text-[#185FA5] leading-none">
                  {value}
                </p>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider mt-1.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 mb-3" />

          <WorkoutHeatmap treinosPorData={treinosPorData} />
        </div>

        {/* Frequência por dia da semana */}
        <div className="bg-white dark:bg-gray-800 border flex-col flex justify-between border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <h4 className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-3.5">
            <span className="material-icons text-[#185FA5] text-sm">
              calendar_month
            </span>
            Frequência semanal
          </h4>
          <BarChart data={freqPorDia} />
        </div>
      </div>

      {/* Evolução de peso por exercício */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
        <h4 className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-3.5">
          <span className="material-icons text-[#185FA5] text-sm">
            trending_up
          </span>
          Evolução de peso por exercício
        </h4>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <select
            className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 transition"
            value={selectedMuscle}
            onChange={(e) => {
              setSelectedMuscle(e.target.value);
              setSelectedExercise("");
            }}
          >
            <option value="">Músculo</option>
            {musculos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 transition"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">Exercício</option>
            {exerciciosDoMusculo.map((ex) => (
              <option key={ex.jsonId} value={ex.jsonId}>
                {ex.nome}
              </option>
            ))}
          </select>
        </div>

        {pesoAoLongoTempo.length > 1 && <LineChart data={pesoAoLongoTempo} />}

        {selectedExercise && pesoAoLongoTempo.length <= 1 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-300 dark:text-gray-600">
            <span className="material-icons text-3xl">inbox</span>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Sem dados suficientes para exibir evolução.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
