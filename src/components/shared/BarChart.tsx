interface BarChartProps {
  data: { dia: string; qtd: number }[];
}

export default function BarChart({ data }: BarChartProps) {
  const maxQtd = Math.max(...data.map((d) => d.qtd), 1);

  return (
    <div className="flex items-end justify-around gap-1">
      {data.map((item) => (
        <div key={item.dia} className="flex flex-col items-center w-8">
          <span className="text-xs mb-1 flex">{item.qtd}</span>
          <div
            className="w-6 bg-[#3588d4] rounded-t"
            style={{ height: `${(item.qtd / maxQtd) * 8}rem` }}
          />
          <span className="text-xs mt-1">{item.dia}</span>
        </div>
      ))}
    </div>
  );
}