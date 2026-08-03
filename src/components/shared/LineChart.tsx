import { useState, useMemo, useEffect } from "react";

interface LineChartProps {
  data: { data: string; peso: number }[];
}

function parseDate(str: string): Date | null {
  const partes = str.split("/");
  if (partes.length === 3) {
    const [d, m, a] = partes.map(Number);
    return new Date(a, m - 1, d);
  }
  return null;
}

export default function LineChart({ data }: LineChartProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inicializa com os últimos 5 dias distintos
  useEffect(() => {
    if (data.length === 0) return;
    const sorted = [...data].sort((a, b) => {
      const da = parseDate(a.data);
      const db = parseDate(b.data);
      if (!da || !db) return 0;
      return da.getTime() - db.getTime();
    });
    const last5: typeof data = [];
    const seenDates = new Set<string>();
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (!seenDates.has(sorted[i].data)) {
        seenDates.add(sorted[i].data);
        last5.unshift(sorted[i]);
      }
      if (last5.length === 5) break;
    }
    if (last5.length >= 2) {
      setStartDate(last5[0].data);
      setEndDate(last5[last5.length - 1].data);
    } else if (sorted.length >= 2) {
      setStartDate(sorted[0].data);
      setEndDate(sorted[sorted.length - 1].data);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return data;
    return data.filter((item) => {
      const itemDate = parseDate(item.data);
      if (!itemDate) return false;
      let keep = true;
      if (startDate) {
        const start = parseDate(startDate);
        if (start) keep = keep && itemDate >= start;
      }
      if (endDate) {
        const end = parseDate(endDate);
        if (end) {
          end.setHours(23, 59, 59, 999);
          keep = keep && itemDate <= end;
        }
      }
      return keep;
    });
  }, [data, startDate, endDate]);

  // Renderização apenas do conteúdo gráfico/tabela
  const renderContent = () => {
    if (data.length < 2) {
      return (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <span className="material-icons text-4xl">inbox</span>
          <p className="text-sm mt-2">Sem dados suficientes para exibir evolução.</p>
        </div>
      );
    }

    if (filteredData.length < 2) {
      return (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <span className="material-icons text-4xl">inbox</span>
          <p className="text-sm mt-2">Nenhum dado no período selecionado.</p>
        </div>
      );
    }

    // largura baseada nos dados; no mobile, deixamos maior para forçar scroll
    const baseWidth = Math.max(400, filteredData.length * 50);
    const width = isMobile ? baseWidth * 1.3 : baseWidth; // 30% mais largo no celular
    const height = 240;
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };

    const maxPeso = Math.max(...filteredData.map((d) => d.peso));
    const minPeso = Math.min(...filteredData.map((d) => d.peso));
    const range = maxPeso - minPeso || 1;

    const getPoint = (index: number) => {
      const x =
        padding.left +
        (index / (filteredData.length - 1)) * (width - padding.left - padding.right);
      const y =
        height -
        padding.bottom -
        ((filteredData[index].peso - minPeso) / range) * (height - padding.top - padding.bottom);
      return { x, y };
    };

    const points = filteredData.map((_, i) => getPoint(i));
    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPoints =
      `${padding.left},${height - padding.bottom} ` +
      points.map((p) => `${p.x},${p.y}`).join(" ") +
      ` ${points[points.length - 1].x},${height - padding.bottom}`;

    const horizontalLines = 5;
    const stepValue = range / horizontalLines;

    return (
      <>
        <div
          className={`relative w-full rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-3 mx-auto max-w-3xl ${
            isMobile
              ? "overflow-x-auto touch-pan-x overscroll-x-contain"
              : "overflow-x-auto"
          }`}
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className={`h-auto ${isMobile ? "" : "w-full min-w-75"}`}
            style={isMobile ? { width: `${width}px`, height: `${height}px` } : undefined}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3588d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3588d4" stopOpacity="0.02" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
              </filter>
            </defs>

            {Array.from({ length: horizontalLines + 1 }).map((_, i) => {
              const valor = minPeso + stepValue * i;
              const y =
                height -
                padding.bottom -
                ((valor - minPeso) / range) * (height - padding.top - padding.bottom);
              return (
                <g key={`hline-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                    strokeWidth="0.5"
                    className="dark:stroke-gray-600"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6b7280"
                    className="dark:fill-gray-400"
                  >
                    {valor.toFixed(0)}
                  </text>
                </g>
              );
            })}

            <polygon points={areaPoints} fill="url(#areaGradient)" stroke="none" />
            <polyline
              fill="none"
              stroke="#3588d4"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polylinePoints}
              filter="url(#shadow)"
            />

            {filteredData.map((d, i) => {
              const { x, y } = points[i];
              const showLabel =
                i % Math.ceil(filteredData.length / 8) === 0 ||
                i === 0 ||
                i === filteredData.length - 1;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#3588d4"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1e5a9b] transition-colors"
                  >
                    <title>{`${d.data}: ${d.peso} kg`}</title>
                  </circle>
                  {showLabel && (
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#1f2937"
                      className="dark:fill-gray-200"
                    >
                      {d.peso}kg
                    </text>
                  )}
                </g>
              );
            })}

            {filteredData.map((d, i) => {
              const step = Math.ceil(filteredData.length / 6);
              if (i % step !== 0 && i !== 0 && i !== filteredData.length - 1) return null;
              const { x } = points[i];
              return (
                <text
                  key={`x-${i}`}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#6b7280"
                  className="dark:fill-gray-400"
                >
                  {d.data.substring(0, 5)}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
            Variação de peso
          </p>
          <div className="space-y-1">
            {filteredData.map((d, i) => {
              if (i === 0) return null;
              const anterior = filteredData[i - 1].peso;
              const diff = d.peso - anterior;
              const sinal = diff > 0 ? "+" : diff < 0 ? "-" : "";
              const cor =
                diff > 0
                  ? "text-green-600 dark:text-green-400"
                  : diff < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400";
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs"
                >
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{d.data}</span>
                  <span className={`font-bold ${cor}`}>
                    {sinal}
                    {Math.abs(diff).toFixed(1)} kg
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            Data início
          </label>
          <div className="relative">
            <input
              type="date"
              value={
                startDate
                  ? new Date(startDate.split("/").reverse().join("-")).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setStartDate("");
                  return;
                }
                const [year, month, day] = val.split("-");
                setStartDate(`${day}/${month}/${year}`);
              }}
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              calendar_today
            </span>
          </div>
        </div>
        <div className="flex-1 relative">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            Data fim
          </label>
          <div className="relative">
            <input
              type="date"
              value={
                endDate
                  ? new Date(endDate.split("/").reverse().join("-")).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setEndDate("");
                  return;
                }
                const [year, month, day] = val.split("-");
                setEndDate(`${day}/${month}/${year}`);
              }}
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              calendar_today
            </span>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}