import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface MuscleSelectProps {
  muscles: string[];
  selected: string;
  onSelect: (muscle: string) => void;
}

export default function MuscleSelect({
  muscles,
  selected,
  onSelect,
}: MuscleSelectProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora (botão + portal)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calcula a posição do portal baseado no botão
  const getPortalStyle = (): React.CSSProperties => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: "fixed",
      top: rect.bottom,
      left: rect.left,
      width: rect.width * 2,
      maxHeight: "40vh",
      zIndex: 9999,
    };
  };

  const allOptions = ["Músculo", ...muscles];

  return (
    <div className="w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 bg-white dark:bg-gray-700 text-sm text-left truncate text-gray-700 dark:text-gray-200"
      >
        {selected}
      </button>

      {open &&
        createPortal(
          <div
            ref={portalRef}
            style={getPortalStyle()}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {allOptions.map((option) => (
              <div
                key={option}
                className={`px-3 py-2 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-sm md:text-base whitespace-normal wrap-break-word text-gray-700 dark:text-gray-200 ${
                  option === "Músculo" ? "italic text-gray-500 dark:text-gray-400" : ""
                }`}
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                {option === "Músculo" ? "Músculo (digitar)" : option}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}