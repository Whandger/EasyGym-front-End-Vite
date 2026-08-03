import Introducao from "../components/home/Introducao";
import FrequenciaCalendar from "../components/home/FrequenciaCalendar";
import Presenca from "../components/home/Presenca";
import TreinoSummary from "../components/home/TreinoSummary";
import { useTreinoSummary } from "../hooks/useTreinoSummary";

export default function HomePage() {
  const { training, trainings, selectedIndex, selectTraining } = useTreinoSummary();

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Introducao />
      <FrequenciaCalendar />
      <Presenca training={training} />
      <TreinoSummary
        trainings={trainings}
        training={training}
        selectedIndex={selectedIndex}
        onSelectTraining={selectTraining}
      />
    </div>
  );
}