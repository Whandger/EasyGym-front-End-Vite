import { useState, useEffect, useMemo } from "react";
import { api } from "../../services/api";
import { useExerciciosData } from "../../hooks/useExerciciosData";
import ModalExercicioJson from "../shared/ExercicioJsonModal";
import type { ExercicioJSON } from "../../types";

interface Treino {
  id: number;
  nome: string;
  exercicios: any[];
}

interface Recomendacao {
  prioridade: "Alta" | "Média" | "Baixa";
  problema: string;
  recomendacao: string;
  justificativa: string;
}

interface ExercicioResumo {
  nome: string;
  series: number;
  repeticoes: number;
  peso_atual: number;
  maior_carga_historica: number;
  menor_carga_historica: number;
}

interface ResumoTreino {
  treino: string;
  exercicios: ExercicioResumo[];
}

interface Evolucao {
  exercicio: string;
  peso_inicial: number;
  peso_final: number;
  variacao_percentual: number;
  historico_suficiente: boolean;
  descricao: string;
}

interface SugestaoExercicio {
  exercicio: string;
  grupo_muscular: string;
  justificativa: string;
}

interface RelatorioIA {
  resumo: ResumoTreino[];
  analise: {
    pontos_fortes: string[];
    pontos_atencao: string[];
    dados_ausentes: string[];
  };
  evolucao: Evolucao[];
  recomendacoes: Recomendacao[];
  sugestoes_exercicios: SugestaoExercicio[];
}

const removerAcentos = (str: string): string => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const CORES_PRIORIDADE: Record<Recomendacao["prioridade"], string> = {
  Alta: "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  Média: "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  Baixa: "border-gray-300 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
};

export default function IAOptimezeSection() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<string>("hipertrofia");
  const [relatorio, setRelatorio] = useState<RelatorioIA | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalExercise, setModalExercise] = useState<ExercicioJSON | null>(null);

  const exerciciosData = useExerciciosData();

  const exercicioPorNome = useMemo(() => {
    const map = new Map<string, ExercicioJSON>();
    exerciciosData.forEach((ex) => {
      const nome = ex.nome;
      if (!nome) return;
      const nomeLower = nome.toLowerCase();
      const nomeSemAcento = removerAcentos(nomeLower);

      map.set(nome, ex);
      map.set(nomeLower, ex);
      map.set(nomeSemAcento, ex);

      const semPontuacao = nomeLower.replace(/[,.;!?)$]$/, "");
      map.set(semPontuacao, ex);
    });
    return map;
  }, [exerciciosData]);

  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        const response = await api.get("/trainings");
        if (Array.isArray(response)) {
          setTreinos(response);
        } else {
          setTreinos([]);
          setError("Resposta inesperada da API.");
        }
      } catch (err) {
        setError("Erro ao carregar treinos.");
        setTreinos([]);
      }
    };
    fetchTreinos();
  }, []);

  const handleSelectAll = () => {
    setSelectedIds(treinos.map((t) => t.id));
  };

  const handleToggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderTextoComLinks = (texto: string) => {
    if (!texto) return <span></span>;
    const palavras = texto.split(/(\s+)/);
    const elementos: React.ReactNode[] = [];
    let i = 0;

    while (i < palavras.length) {
      let encontrado = false;
      for (let j = i; j < Math.min(i + 6, palavras.length); j++) {
        const candidato = palavras.slice(i, j + 1).join("");
        let nomeLimpo = candidato.trim();
        if (!nomeLimpo) continue;
        nomeLimpo = nomeLimpo.replace(/[,.;:!?)$]$/, "");
        nomeLimpo = nomeLimpo.replace(/^["']|["']$/g, "");
        nomeLimpo = nomeLimpo.replace(/\*\*/g, "");
        nomeLimpo = nomeLimpo.replace(/^\(|\)$/g, "");

        if (nomeLimpo.length < 3) continue;

        const lower = nomeLimpo.toLowerCase();
        const semAcento = removerAcentos(lower);

        const ex =
          exercicioPorNome.get(nomeLimpo) ||
          exercicioPorNome.get(lower) ||
          exercicioPorNome.get(semAcento);

        if (ex) {
          const nomeExato = palavras.slice(i, j + 1).join("").trim();
          elementos.push(
            <span
              key={i}
              className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium"
              onClick={() => setModalExercise(ex)}
            >
              {nomeExato}
            </span>
          );
          i = j + 1;
          encontrado = true;
          break;
        }
      }

      if (!encontrado) {
        elementos.push(<span key={i}>{palavras[i]}</span>);
        i++;
      }
    }

    return elementos;
  };

  const renderNomeExercicio = (nome: string) => {
    if (!nome) return <span>—</span>;
    const lower = nome.toLowerCase();
    const semAcento = removerAcentos(lower);
    const ex = exercicioPorNome.get(nome) || exercicioPorNome.get(lower) || exercicioPorNome.get(semAcento);

    if (!ex) return <span>{nome}</span>;

    return (
      <span
        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium"
        onClick={() => setModalExercise(ex)}
      >
        {nome}
      </span>
    );
  };

  const handleAnalisar = async () => {
    if (selectedIds.length === 0) {
      alert("Selecione pelo menos um treino.");
      return;
    }

    setLoading(true);
    setError(null);
    setRelatorio(null);

    try {
      const response = await api.post("/ai/dicas", {
        treino_ids: selectedIds,
        objetivo: objetivoSelecionado || undefined,
      });
      if (response && typeof response === "object" && "dica" in response) {
        setRelatorio(response.dica as RelatorioIA);
      } else {
        setError("Resposta inesperada da IA.");
      }
    } catch (err) {
      setError("Erro ao gerar dica. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTreinos = treinos.filter((t) => selectedIds.includes(t.id));
  const selectedNomes = selectedTreinos.map((t) => t.nome).join(", ");

  return (
    <div className="p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <span className="material-icons text-blue-600 dark:text-blue-400 text-2xl">
            psychology
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Consultoria IA
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Selecione os treinos e receba uma análise inteligente
          </p>
        </div>
      </div>

      {/* Card de seleção */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {selectedIds.length === 0
                ? "Nenhum treino selecionado"
                : `${selectedIds.length} treino(s) selecionado(s)`}
            </span>
            {selectedIds.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {selectedNomes}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <span className="material-icons text-sm">select_all</span>
              Selecionar todos
            </button>
          </div>
        </div>

        {/* Seletor de objetivo */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Objetivo:
          </label>
          <select
            value={objetivoSelecionado}
            onChange={(e) => setObjetivoSelecionado(e.target.value)}
            className="text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="hipertrofia">Hipertrofia</option>
            <option value="forca_maxima">Força máxima</option>
            <option value="potencia">Potência</option>
            <option value="resistencia_muscular">Resistência muscular</option>
          </select>
        </div>

        <button
          onClick={handleAnalisar}
          disabled={loading || treinos.length === 0}
          className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Analisando...
            </>
          ) : (
            <>
              <span className="material-icons text-sm">auto_awesome</span>
              Analisar treinos
            </>
          )}
        </button>

        {treinos.length === 0 && !error && (
          <div className="flex flex-col items-center py-6 text-gray-400 dark:text-gray-500">
            <span className="material-icons text-4xl">fitness_center</span>
            <p className="text-sm mt-2">Nenhum treino cadastrado ainda.</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm border border-red-100 dark:border-red-800">
            <span className="material-icons text-sm">error_outline</span>
            {error}
          </div>
        )}

        {treinos.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {Array.isArray(treinos) &&
              treinos.map((treino) => (
                <li
                  key={treino.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedIds.includes(treino.id)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => handleToggle(treino.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(treino.id)}
                    onChange={() => handleToggle(treino.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {treino.nome}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-start gap-3 animate-fade-in">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <span className="material-icons text-sm">smart_toy</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200 p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">
                Analisando seu treino...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Relatório estruturado */}
      {relatorio && (
        <div className="space-y-5 animate-slide-up">
          {/* Resumo */}
          {relatorio.resumo?.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Resumo do treino
              </h3>
              {relatorio.resumo.map((treinoResumo) => (
                <div key={treinoResumo.treino} className="mb-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                    {treinoResumo.treino}
                  </div>
                  <div className="space-y-2">
                    {(treinoResumo.exercicios || []).map((ex, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl"
                      >
                        <div className="col-span-2 sm:col-span-3 font-medium text-gray-800 dark:text-gray-100">
                          {renderNomeExercicio(ex.nome)}
                        </div>
                        <div>Séries: {ex.series ?? "—"}</div>
                        <div>Repetições: {ex.repeticoes ?? "—"}</div>
                        <div>Peso atual: {ex.peso_atual ?? "—"}kg</div>
                        <div>Maior carga histórica: {ex.maior_carga_historica ?? "—"}kg</div>
                        <div>Menor carga histórica: {ex.menor_carga_historica ?? "—"}kg</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Análise crítica */}
          {relatorio.analise && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Análise crítica
              </h3>
              {relatorio.analise.pontos_fortes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Pontos fortes</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {(relatorio.analise.pontos_fortes || []).map((p, idx) => (
                      <li key={idx}>{renderTextoComLinks(p)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {relatorio.analise.pontos_atencao?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Pontos de atenção</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {(relatorio.analise.pontos_atencao || []).map((p, idx) => (
                      <li key={idx}>{renderTextoComLinks(p)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {relatorio.analise.dados_ausentes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Não foi possível avaliar</p>
                  <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {(relatorio.analise.dados_ausentes || []).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Evolução */}
          {relatorio.evolucao?.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Evolução observada
              </h3>
              <ul className="space-y-2">
                {(relatorio.evolucao || []).map((e, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{renderNomeExercicio(e.exercicio)}</span>
                      {!e.historico_suficiente && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          Histórico insuficiente
                        </span>
                      )}
                    </div>
                    <p className="mt-1">
                      Peso inicial: {e.peso_inicial ?? "—"}kg → Peso final: {e.peso_final ?? "—"}kg
                      {e.variacao_percentual !== 0 && (
                        <span className={e.variacao_percentual > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          {" "}({e.variacao_percentual > 0 ? "+" : ""}{e.variacao_percentual}%)
                        </span>
                      )}
                    </p>
                    <p className="text-xs opacity-80">{e.descricao}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Recomendações */}
          {relatorio.recomendacoes?.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 px-1">
                Recomendações
              </h3>
              {(relatorio.recomendacoes || [])
                .slice()
                .sort((a, b) => {
                  const ordem = { Alta: 0, Média: 1, Baixa: 2 };
                  return ordem[a.prioridade] - ordem[b.prioridade];
                })
                .map((r, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 rounded-xl p-3 text-sm ${CORES_PRIORIDADE[r.prioridade]}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{r.problema}</span>
                      <span className="text-xs uppercase tracking-wide opacity-70">{r.prioridade}</span>
                    </div>
                    <p className="mb-1">{renderTextoComLinks(r.recomendacao)}</p>
                    <p className="text-xs opacity-80">{r.justificativa}</p>
                  </div>
                ))}
            </section>
          )}

          {/* Sugestões de exercícios */}
          {relatorio.sugestoes_exercicios?.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Sugestões de exercícios
              </h3>
              <ul className="space-y-2">
                {(relatorio.sugestoes_exercicios || []).map((s, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">{renderNomeExercicio(s.exercicio)}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500"> ({s.grupo_muscular})</span>
                    <p className="text-xs opacity-80 mt-0.5">{s.justificativa}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Modal de exercício */}
      {modalExercise && (
        <ModalExercicioJson
          exercise={modalExercise}
          onClose={() => setModalExercise(null)}
        />
      )}

      {/* Estilos adicionais */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.3s ease-out forwards;
        }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
}