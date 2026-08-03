export interface CalendarDay {
  diaSemana: string;
  dataFormatada: string;
  isHoje: boolean;
}

export function useFrequenciaCalendar(): CalendarDay[] {
  const hoje = new Date();

  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

  const segunda = new Date(hoje);

  const diaSemanaAtual = hoje.getDay() === 0 ? 7 : hoje.getDay();

  segunda.setDate(hoje.getDate() - diaSemanaAtual + 1);

  return Array.from({ length: 7 }, (_, i) => {
    const data = new Date(segunda);

    data.setDate(segunda.getDate() + i);

    const isHoje =
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear();

    return {
      diaSemana: diasSemana[i],

      dataFormatada:
        String(data.getDate()).padStart(2, '0') +
        '/' +
        String(data.getMonth() + 1).padStart(2, '0'),

      isHoje,
    };
  });
}