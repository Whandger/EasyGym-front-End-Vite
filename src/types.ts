export interface ExerciseFormData {
  id?: number; 
  nomeExercicio: string;
  serie: string;
  repeticoes: string;
  peso?: string;    
  jsonId?: string; // ID do exercício no JSON
}

export type Exercise = ExerciseFormData;

export interface Training {
  id: number;
  nome: string;
  exercicios: ExerciseFormData[];
}

export interface ExercicioJSON {
  nome: string;
  exerciseId: string;
  musculoAlvo: string[];
  gifUrl: string;
  instrucoes?: string | string[];
}

export interface TrainingRecord {
  id: number;
  nome: string;
  data: string;
  hora: string;
  duracao: string;
  exercicios: ExerciseFormData[];
}