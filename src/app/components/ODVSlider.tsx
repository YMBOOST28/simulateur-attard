import { formatNumber } from "../utils/calculations";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ODVSliderProps {
  value: number;
  onChange: (value: number) => void;
  minODV: number;
  maxODV: number;
}

export default function ODVSlider({ value, onChange, minODV, maxODV }: ODVSliderProps) {
  const getODVLabel = (odv: number) => {
    const pct = (odv - minODV) / (maxODV - minODV);
    if (pct < 0.2) return "Engagement léger";
    if (pct < 0.4) return "Visibilité standard";
    if (pct < 0.65) return "Impact fort";
    if (pct < 0.85) return "Domination locale";
    return "Saturation maximale";
  };

  const getLabelColor = (odv: number) => {
    const pct = (odv - minODV) / (maxODV - minODV);
    if (pct < 0.2) return "#6B7280";
    if (pct < 0.4) return "#1E6FFF";
    if (pct < 0.65) return "#1DBF73";
    if (pct < 0.85) return "#F59E0B";
    return "#EF4444";
  };

  const step = Math.max(1000, Math.floor((maxODV - minODV) / 100) * 1000);
  const pct = maxODV > minODV ? Math.max(0, Math.min(100, ((value - minODV) / (maxODV - minODV)) * 100)) : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-[#0B1220]">
          Opportunités De Voir (ODV)
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-[#0B1F3B]/40" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                L'ODV est calculé selon la fréquentation de l'hôpital, le nombre d'écrans, les passages du spot et sa durée. Min = 1 écran, Max = capacité totale de l'établissement.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        <div className="relative h-5 flex items-center">
          <div className="absolute w-full h-3 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(to right, #1E6FFF, #1DBF73)",
              }}
            />
          </div>

          <input
            type="range"
            min={minODV}
            max={maxODV}
            step={step}
            value={value}
            onChange={handleChange}
            className="absolute w-full h-5 opacity-0 cursor-pointer z-10"
            style={{ margin: 0 }}
          />

          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#1E6FFF] shadow-md transition-all duration-150 pointer-events-none z-20"
            style={{ left: `calc(${pct}% - 10px)` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[#0B1F3B]/50">{formatNumber(minODV)}</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0B1220]">{formatNumber(value)}</p>
            <p className="text-sm font-medium mt-0.5" style={{ color: getLabelColor(value) }}>
              {getODVLabel(value)}
            </p>
          </div>
          <span className="text-xs text-[#0B1F3B]/50">{formatNumber(maxODV)}</span>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => onChange(Math.max(minODV, value - step * 5))}
            className="px-3 py-1 rounded-full border border-[#0B1F3B]/20 text-sm text-[#0B1F3B] hover:bg-[#0B1F3B]/5 transition-colors"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.min(maxODV, value + step * 5))}
            className="px-3 py-1 rounded-full border border-[#0B1F3B]/20 text-sm text-[#0B1F3B] hover:bg-[#0B1F3B]/5 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-xs text-[#0B1F3B]/50 flex items-start gap-1">
        <span>*</span>
        <span>ODV = fréquentation hôpital × écrans × spots vus × 365 jours. Taux de conversion basé sur les études Publicis / Broadsign DOOH Santé (× 0.8 × 0.3 × 0.002)</span>
      </p>
    </div>
  );
}
