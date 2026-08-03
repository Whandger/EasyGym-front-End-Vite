import { useState } from "react";
import Accordion from "../components/shared/Accordion";
import ConfigSection from "../components/Conta/ConfigSection";
import StatusSection from "../components/Conta/StatusSection";

export default function ContaPage() {

  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="flex h-full flex-col text-gray-500">
      <div className="flex flex-col flex-1">
        {/* Se nada está aberto, mostra os dois accordions fechados */}
        {openSection === null && (
          <>
            <Accordion
              title="Configurações"
              isOpen={false}
              onToggle={() => handleToggle("config")}
            >
              <ConfigSection />
            </Accordion>
            <Accordion
              title="Status"
              isOpen={false}
              onToggle={() => handleToggle("status")}
            >
              <StatusSection />
            </Accordion>
          </>
        )}

        {/* Se Configurações está aberto, só mostra ele */}
        {openSection === "config" && (
          <Accordion
            title="Configurações"
            isOpen={true}
            onToggle={() => handleToggle("config")}
          >
            <ConfigSection />
          </Accordion>
        )}

        {/* Se Status está aberto, só mostra ele */}
        {openSection === "status" && (
          <Accordion
            title="Status"
            isOpen={true}
            onToggle={() => handleToggle("status")}
          >
            <StatusSection />
          </Accordion>
        )}
      </div>
    </div>
  );
}
