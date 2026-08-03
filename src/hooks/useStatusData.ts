import { useState, useMemo } from "react";
import { useTrainingContext } from "../context/TrainingContext";
import { useExerciciosData } from "./useExerciciosData";

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function useStatusData() {
  const { history } = useTrainingContext();
  const exerciciosJSON = useExerciciosData();

  // Anos disponíveis no histórico
  const anosDisponiveis = useMemo(() => {
    const anos = new Set<string>();
    history.forEach((r) => {
      const partes = r.data.split("/");
      if (partes.length === 3) anos.add(partes[2]);
    });
    return Array.from(anos).sort();
  }, [history]);

  // Ano mais recente para iniciar selecionado
  const anoInicial = useMemo(() => {
    if (anosDisponiveis.length === 0) return "";
    return anosDisponiveis[anosDisponiveis.length - 1];
  }, [anosDisponiveis]);

  const [selectedYear, setSelectedYear] = useState<string>(anoInicial);
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  // Histórico filtrado por ano
  const historyFiltrado = useMemo(() => {
    if (!selectedYear) return history;
    return history.filter((r) => {
      const partes = r.data.split("/");
      return partes.length === 3 && partes[2] === selectedYear;
    });
  }, [history, selectedYear]);

  // Dias do ano selecionado (considera bissexto)
  const diasDoAno = useMemo(() => {
    if (!selectedYear) return 365;
    const ano = parseInt(selectedYear);
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0 ? 366 : 365;
  }, [selectedYear]);

  // Total de treinos
  const totalTreinos = historyFiltrado.length;

  // Frequência por dia da semana
  const freqPorDia = useMemo(() => {
    const contagem: Record<string, number> = {
      Dom: 0, Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sáb: 0,
    };
    historyFiltrado.forEach((record) => {
      const partes = record.data.split("/");
      if (partes.length === 3) {
        const [dia, mes, ano] = partes.map(Number);
        const data = new Date(ano, mes - 1, dia);
        const diaSemana = diasSemana[data.getDay()];
        contagem[diaSemana] = (contagem[diaSemana] || 0) + 1;
      }
    });
    return Object.entries(contagem).map(([dia, qtd]) => ({ dia, qtd }));
  }, [historyFiltrado]);

  // Exercícios do JSON presentes no histórico (com jsonId)
  const exerciciosJSONdoHistorico = useMemo(() => {
    const map = new Map<string, { jsonId: string; nome: string; musculos: string[] }>();
    historyFiltrado.forEach((record) => {
      record.exercicios.forEach((ex) => {
        if (ex.jsonId && !map.has(ex.jsonId)) {
          const jsonEx = exerciciosJSON.find((je) => je.exerciseId === ex.jsonId);
          if (jsonEx) {
            map.set(ex.jsonId, {
              jsonId: ex.jsonId,
              nome: jsonEx.nome,
              musculos: jsonEx.musculoAlvo,
            });
          }
        }
      });
    });
    return Array.from(map.values());
  }, [historyFiltrado, exerciciosJSON]);

  // Exercícios manuais (sem jsonId) do histórico filtrado
  const exerciciosManuais = useMemo(() => {
    const map = new Map<string, { jsonId: string; nome: string; musculos: string[] }>();
    historyFiltrado.forEach((record) => {
      record.exercicios.forEach((ex) => {
        if (!ex.jsonId && ex.nomeExercicio.trim() !== "") {
          const id = "manual_" + ex.nomeExercicio.trim().toLowerCase();
          if (!map.has(id)) {
            map.set(id, {
              jsonId: id,
              nome: ex.nomeExercicio.trim(),
              musculos: [],
            });
          }
        }
      });
    });
    return Array.from(map.values());
  }, [historyFiltrado]);

  // Músculos disponíveis (apenas dos exercícios do JSON)
  const musculos = useMemo(() => {
    const set = new Set<string>();
    exerciciosJSONdoHistorico.forEach((ex) => ex.musculos.forEach((m) => set.add(m)));
    return Array.from(set).sort();
  }, [exerciciosJSONdoHistorico]);

  // Lista de exercícios
  const exerciciosDoMusculo = useMemo(() => {
    if (selectedMuscle === "") {
      // Modo "Músculo": exibe apenas os manuais
      return exerciciosManuais;
    }
    // Modo músculo específico: filtra os do JSON pelo músculo
    return exerciciosJSONdoHistorico.filter((ex) => ex.musculos.includes(selectedMuscle));
  }, [selectedMuscle, exerciciosJSONdoHistorico, exerciciosManuais]);

  // Evolução de peso para o exercício selecionado
  const pesoAoLongoTempo = useMemo(() => {
    if (!selectedExercise) return [];
    const evo: { data: string; peso: number }[] = [];
    historyFiltrado.forEach((record) => {
      record.exercicios.forEach((ex) => {
        if (selectedExercise.startsWith("manual_")) {
          // Exercício manual: compara pelo nome normalizado
          const nomeNormalizado = ex.nomeExercicio.trim().toLowerCase();
          const selectedNome = selectedExercise.replace("manual_", "");
          if (!ex.jsonId && nomeNormalizado === selectedNome && ex.peso) {
            evo.push({ data: record.data, peso: parseFloat(ex.peso) || 0 });
          }
        } else {
          // Exercício do JSON: compara pelo jsonId
          if (ex.jsonId === selectedExercise && ex.peso) {
            evo.push({ data: record.data, peso: parseFloat(ex.peso) || 0 });
          }
        }
      });
    });
    evo.sort((a, b) => {
      const [dA, mA, aA] = a.data.split("/").map(Number);
      const [dB, mB, aB] = b.data.split("/").map(Number);
      return new Date(aA, mA - 1, dA).getTime() - new Date(aB, mB - 1, dB).getTime();
    });
    return evo;
  }, [historyFiltrado, selectedExercise]);

  const handleYearChange = (ano: string) => {
    setSelectedYear(ano);
    setSelectedMuscle("");
    setSelectedExercise("");
  };

  const percentualDiasTreinados = useMemo(() => {
    if (!selectedYear) return null;
    return parseFloat(((totalTreinos / diasDoAno) * 100).toFixed(1));
  }, [selectedYear, totalTreinos, diasDoAno]);

 const treinosPorData = useMemo(() => {
    const map: Record<string, number> = {};
    historyFiltrado.forEach((r) => {
      // r.data está no formato "dd/mm/aaaa"
      const partes = r.data.split("/");
      if (partes.length === 3) {
        const [d, m, a] = partes;
        const key = `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        map[key] = (map[key] ?? 0) + 1;
      }
    });
    return map;
  }, [historyFiltrado]);

  return {
    selectedYear,
    setSelectedYear: handleYearChange,
    selectedMuscle,
    setSelectedMuscle,
    selectedExercise,
    setSelectedExercise,
    anosDisponiveis,
    historyFiltrado,
    totalTreinos,
    diasDoAno,
    freqPorDia,
    musculos,
    exerciciosDoMusculo,
    pesoAoLongoTempo,
    treinosPorData,
    percentualDiasTreinados,
  };
}