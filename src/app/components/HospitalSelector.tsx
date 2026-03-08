import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { hospitals } from "../data/hospitals";
import { formatNumber } from "../utils/calculations";

interface HospitalSelectorProps {
  selectedHospital: string | null;
  onSelect: (hospitalId: string) => void;
}

export default function HospitalSelector({ selectedHospital, onSelect }: HospitalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Regrouper par région
  const regions = Array.from(new Set(hospitals.map(h => h.region).filter(Boolean))) as string[];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hospital.region?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesRegion = !selectedRegion || hospital.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1F3B]/40" />
        <Input
          placeholder="Rechercher un hôpital ou une ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#F5F7FA] border-[#0B1F3B]/10"
        />
      </div>

      {/* Filtres régions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
            !selectedRegion
              ? "bg-[#1E6FFF] text-white border-[#1E6FFF]"
              : "bg-white text-[#0B1F3B]/60 border-[#0B1F3B]/15 hover:border-[#1E6FFF]/50"
          }`}
        >
          Toute la France
        </button>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              selectedRegion === region
                ? "bg-[#1E6FFF] text-white border-[#1E6FFF]"
                : "bg-white text-[#0B1F3B]/60 border-[#0B1F3B]/15 hover:border-[#1E6FFF]/50"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
        {filteredHospitals.length === 0 && (
          <p className="text-sm text-[#0B1F3B]/50 col-span-3 text-center py-4">Aucun résultat</p>
        )}
        {filteredHospitals.map((hospital) => (
          <button
            key={hospital.id}
            onClick={() => onSelect(hospital.id)}
            className={`
              p-4 rounded-xl text-left transition-all
              ${
                selectedHospital === hospital.id
                  ? "bg-[#1E6FFF] text-white shadow-lg scale-105"
                  : "bg-[#F5F7FA] text-[#0B1220] hover:bg-[#1E6FFF]/10 hover:border-[#1E6FFF]"
              }
              border-2 ${
                selectedHospital === hospital.id
                  ? "border-[#1E6FFF]"
                  : "border-transparent"
              }
            `}
          >
            <div className="flex items-start gap-2">
              <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                selectedHospital === hospital.id ? "text-white" : "text-[#1E6FFF]"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1 truncate">{hospital.city}</p>
                <p className={`text-xs mb-1 truncate ${
                  selectedHospital === hospital.id ? "text-white/90" : "text-[#0B1F3B]/60"
                }`}>
                  {hospital.name}
                </p>
                {hospital.region && (
                  <p className={`text-xs mb-1 ${
                    selectedHospital === hospital.id ? "text-white/70" : "text-[#0B1F3B]/40"
                  }`}>
                    {hospital.region}
                  </p>
                )}
                <p className={`text-xs font-semibold ${
                  selectedHospital === hospital.id ? "text-white" : "text-[#1DBF73]"
                }`}>
                  {formatNumber(hospital.passagesPerDay)} passages/jour
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-[#0B1F3B]/40">
        {filteredHospitals.length} établissement{filteredHospitals.length > 1 ? "s" : ""} disponible{filteredHospitals.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
