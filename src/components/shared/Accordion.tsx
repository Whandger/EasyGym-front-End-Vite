interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Accordion({ title, children, isOpen, onToggle }: AccordionProps) {
  return (
    <div className="">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-[18px] text-gray-800 dark:text-gray-200">
          {title}
        </span>
        <span
          className={`transform transition-transform text-gray-500 dark:text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}