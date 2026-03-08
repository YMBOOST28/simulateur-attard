import { professions } from "../data/professions";
import { formatCurrency } from "../utils/calculations";
import { Card } from "./ui/card";
import { Info } from "lucide-react";

interface ProfessionSelectorProps {
  selectedProfession: string | null;
  onSelect: (professionId: string) => void;
}

export default function ProfessionSelector({ selectedProfession, onSelect }: ProfessionSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {professions.map((profession) => (
          <button
            key={profession.id}
            onClick={() => onSelect(profession.id)}
            className={`
              p-5 rounded-xl text-left transition-all
              ${
                selectedProfession === profession.id
                  ? "bg-[#1E6FFF] text-white shadow-lg scale-105"
                  : "bg-[#F5F7FA] text-[#0B1220] hover:bg-[#1E6FFF]/10 hover:border-[#1E6FFF]"
              }
              border-2 ${
                selectedProfession === profession.id
                  ? "border-[#1E6FFF]"
                  : "border-transparent"
              }
            `}
          >
            <div className="text-3xl mb-3">{profession.icon}</div>
            <p className="font-semibold mb-3">{profession.name}</p>
            <div className="space-y-1">
              <p className={`text-sm ${
                selectedProfession === profession.id ? "text-white/90" : "text-[#0B1F3B]/60"
              }`}>
                Panier moyen: <span className="font-semibold">{formatCurrency(profession.averageBasket)}</span>
              </p>
              <p className={`text-sm ${
                selectedProfession === profession.id ? "text-white/90" : "text-[#0B1F3B]/60"
              }`}>
                Taux de conversion: <span className="font-semibold">{profession.conversionRate}%</span>
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedProfession && (
        <Card className="p-4 bg-[#1DBF73]/5 border-[#1DBF73]/20">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-[#1DBF73] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#0B1220]">
                <span className="font-semibold">Données observées chez nos clients:</span> +18% de notoriété, +12% de nouveaux patients.
              </p>
              <p className="text-xs text-[#0B1F3B]/60 mt-1">Données indicatives basées sur nos campagnes DOOH santé.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
