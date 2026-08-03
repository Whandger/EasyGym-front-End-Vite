interface Props {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

function toInputFormat(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return '';
}

function toDisplayFormat(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function HistoryFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
}: Props) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-3 mb-2">
      {/* Linha única, ocupando o máximo sem sair */}
      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">

        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="shrink-0">De</span>
          <input
            type="date"
            value={toInputFormat(startDate)}
            onChange={(e) => onStartDateChange(toDisplayFormat(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full min-w-0 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="shrink-0">até</span>
          <input
            type="date"
            value={toInputFormat(endDate)}
            onChange={(e) => onEndDateChange(toDisplayFormat(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full min-w-0 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-start gap-2 mt-2">
        <button
          onClick={onSearch}
          className="bg-[#3588d4] text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Procurar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition"
        >
          Todos
        </button>
      </div>
    </div>
  );
}