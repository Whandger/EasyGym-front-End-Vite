import { useFrequenciaCalendar } from '../../hooks/useFrequenciaCalendar';

export default function FrequenciaCalendar() {
  const days = useFrequenciaCalendar();

  return (
    <section className="bg-white dark:bg-gray-800 w-[92%] rounded-lg shadow-md px-2 py-2">
      <h3 className="text-gray-700 dark:text-gray-200 font-black text-base">
        Frequência de treino
      </h3>

      <div className="w-full flex items-center justify-center mt-2">
        {days.map((day, index) => {
          const bg = day.isHoje
            ? 'bg-[#3588d4] text-white font-bold'
            : index % 2 === 0
            ? 'bg-[#e5e7eb] dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            : 'bg-[#d1d5db] dark:bg-gray-600 text-gray-700 dark:text-gray-200';

          return (
            <div
              key={index}
              className={`w-[14.28%] text-center p-1 ${bg}`}
            >
              <p className="text-sm">
                {day.diaSemana}
                <br />
                {day.dataFormatada}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}