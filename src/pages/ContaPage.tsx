import { useState } from "react";
import Accordion from "../components/shared/Accordion";
import ConfigSection from "../components/Conta/ConfigSection";
import StatusSection from "../components/Conta/StatusSection";
import IAOptimezeSection from "../components/Conta/IAOptimezeSection";

export default function ContaPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const renderAccordion = (id: string, title: string, children: React.ReactNode) => (
    <Accordion
      title={title}
      isOpen={openSection === id}
      onToggle={() => handleToggle(id)}
    >
      {children}
    </Accordion>
  );

  return (
    <div className="flex h-full flex-col text-gray-500">
      <div className="flex flex-col flex-1">
        {/* Se nada está aberto, mostra os três accordions fechados */}
        {openSection === null && (
          <>
            {renderAccordion("config", "Configurações", <ConfigSection />)}
            {renderAccordion("status", "Status", <StatusSection />)}
            {renderAccordion("ia", "IA Otimiza", <IAOptimezeSection />)}
          </>
        )}

        {openSection === "config" &&
          renderAccordion("config", "Configurações", <ConfigSection />)}

        {openSection === "status" &&
          renderAccordion("status", "Status", <StatusSection />)}

        {openSection === "ia" &&
          renderAccordion("ia", "IA Otimiza", <IAOptimezeSection />)}
      </div>
    </div>
  );
}