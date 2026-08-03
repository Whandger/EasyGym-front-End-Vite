let counter = 0;

/*
 * Combina timestamp + contador para evitar colisões mesmo em chamadas rápidas.
 */
export function generateExerciseId(): number {
  counter++;
  return Date.now() + counter;
}

/*
 * Gera um ID para treinos baseado no maior ID existente + 1.
 */
export function generateTrainingId(trainings: { id: number }[]): number {
  if (trainings.length === 0) return 1;
  return Math.max(...trainings.map(t => t.id)) + 1;
}