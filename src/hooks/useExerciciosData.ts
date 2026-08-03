import { useEffect, useState } from 'react';
import exerciciosJson from "../data/exercicios.json"

export interface ExercicioJSON {
  nome: string;
  exerciseId: string;
  musculoAlvo: string[];
  gifUrl: string;
}

export function useExerciciosData() {
  const [data, setData] = useState<ExercicioJSON[]>([]);

  useEffect(() => {
    setData(exerciciosJson);
  }, []);

  return data;
}