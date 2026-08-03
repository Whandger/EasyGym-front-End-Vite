import HistoryFilter from "../components/history/HistoryFilter";
import HistoryList from "../components/history/HistoryList";
import { useTrainingContext } from "../context/TrainingContext";
import { useHistoryFilter } from "../hooks/useHistoryFilter";

export default function HistoricoPage() {
  const { history } = useTrainingContext();
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredRecords,
    applyFilter,
    clearFilter,
  } = useHistoryFilter(history);

  return (
    <div className="h-full overflow-hidden flex flex-col items-center">
      <HistoryFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={applyFilter}
        onClear={clearFilter}
      />
      <div className="w-full flex-1 overflow-y-auto px-2">
        <HistoryList records={filteredRecords} />
      </div>
    </div>
  );
}