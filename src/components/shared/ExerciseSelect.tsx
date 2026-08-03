import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ExercicioJSON } from "../../types";

interface ExerciseSelectProps {
  exercises: ExercicioJSON[];
  selectedName: string;
  onSelect: (exercise: ExercicioJSON) => void;
  onNameChange: (name: string) => void;
  loading?: boolean;
}

export default function ExerciseSelect({
  exercises,
  selectedName,
  onSelect,
  onNameChange,
  loading = false,
}: ExerciseSelectProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPortalStyle = (): React.CSSProperties => {
    if (!inputRef.current) return {};
    const rect = inputRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;
    const padding = 16;

    if (isMobile) {
      const width = window.innerWidth - padding * 2;
      return {
        position: "fixed",
        top: rect.bottom + 4,
        left: `${padding}px`,
        width: `${width}px`,
        maxHeight: "60vh",
        zIndex: 9999,
      };
    }

    // Desktop
    const minDesktopWidth = 320;
    let width = rect.width;
    if (width < minDesktopWidth) width = minDesktopWidth;

    let left = rect.left;
    // Ajuste para não sair da tela
    if (left + width > window.innerWidth - padding) {
      left = window.innerWidth - width - padding;
    }
    if (left < padding) left = padding;

    return {
      position: "fixed",
      top: rect.bottom,
      left: `${left}px`,
      width: `${width}px`,
      maxHeight: "60vh",
      zIndex: 9999,
    };
  };

  // Filtra exercícios pelo texto digitado
  const filtered = exercises.filter((ex) =>
    ex.nome.toLowerCase().includes(selectedName.toLowerCase())
  );

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Selecione o exercício"
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        value={selectedName}
        onChange={(e) => {
          onNameChange(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        required
      />
      {open &&
        createPortal(
          <div
            ref={portalRef}
            style={getPortalStyle()}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {loading ? (
              <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm">Carregando...</div>
            ) : filtered.length > 0 ? (
              filtered.map((ex) => (
                <div
                  key={ex.exerciseId}
                  className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    onSelect(ex);
                    setOpen(false);
                  }}
                >
                  <img
                    src={ex.gifUrl}
                    alt={ex.nome}
                    className="w-28 h-28 md:w-40 md:h-40 rounded object-cover shrink-0"
                  />
                  <span className="text-sm md:text-base whitespace-normal wrap-break-word text-gray-700 dark:text-gray-200">
                    {ex.nome}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400 dark:text-gray-500 text-sm">
                Nenhum exercício encontrado
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}