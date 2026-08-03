type Props = {
  treinosPorData: Record<string, number>;
};

export default function WorkoutHeatmap({ treinosPorData }: Props) {
  const WEEKS = 26;
  const today = new Date();

  // Gera as semanas
  const weeks: Date[][] = [];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());
  startDate.setDate(startDate.getDate() - (WEEKS - 1) * 7);

  for (let w = 0; w < WEEKS; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + w * 7 + d);
      week.push(day);
    }
    weeks.push(week);
  }

  const getLevel = (date: Date): 0 | 1 | 2 | 3 | 4 => {
    const key = date.toISOString().split("T")[0];
    const count = treinosPorData[key] ?? 0;
    if (count === 0) return 0;
    if (count === 1) return 2;
    return 4;
  };

  const levelColors: Record<number, string> = {
    0: "bg-gray-100",
    1: "bg-[#E6F1FB]",
    2: "bg-[#B5D4F4]",
    3: "bg-[#378ADD]",
    4: "bg-[#185FA5]",
  };

  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  // Identifica os índices das semanas que iniciam um novo mês
  const monthLabels: { index: number; label: string }[] = [];
  weeks.forEach((week, i) => {
    const firstDay = week[0];
    if (i === 0 || firstDay.getDate() <= 7) {
      monthLabels.push({ index: i, label: months[firstDay.getMonth()] });
    }
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Frequência anual
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-gray-400">menos</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className={`w-2.5 h-2.5 rounded-xs ${levelColors[l]}`}
            />
          ))}
          <span className="text-[9px] text-gray-400">mais</span>
        </div>
      </div>

      {/* Labels de mês – alinhados com as semanas */}
      <div className="grid grid-cols-[repeat(26,1fr)] gap-0.75 mb-1">
        {weeks.map((_, i) => {
          const found = monthLabels.find((m) => m.index === i);
          return (
            <div key={i} className="text-[9px] text-gray-400 overflow-hidden whitespace-nowrap">
              {found ? found.label : ""}
            </div>
          );
        })}
      </div>

      {/* Grid do heatmap */}
      <div className="grid grid-cols-[repeat(26,1fr)] gap-0.75">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.75">
            {week.map((day, di) => {
              const level = getLevel(day);
              return (
                <div
                  key={di}
                  title={`${day.toLocaleDateString("pt-BR")}`}
                  className={`w-full aspect-square rounded-xs ${levelColors[level]}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}