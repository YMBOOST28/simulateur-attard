import { useState } from "react";
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
  const [inputMode, setInputMode] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const safeMin = Math.max(0, minODV);
  const safeMax = Math.max(safeMin + 1000, maxODV);
  const safeValue = Math.max(safeMin, Math.min(safeMax, value));
  const step = Math.max(1000, Math.round((safeMax - safeMin) / 50 / 1000) * 1000);
  const pct = ((safeValue - safeMin) / (safeMax - safeMin)) * 100;

  const getODVLabel = () => {
    if (pct < 20) return { label: "Engagement léger", color: "#6B7280" };
    if (pct < 40) return { label: "Visibilité standard", color: "#1E6FFF" };
    if (pct < 65) return { label: "Impact fort", color: "#1DBF73" };
    if (pct < 85) return { label: "Domination locale", color: "#F59E0B" };
    return { label: "Saturation maximale", color: "#EF4444" };
  };

  const { label, color } = getODVLabel();

  const handleInputConfirm = () => {
    const raw = inputValue.replace(/\s/g, "").replace(/[^0-9]/g, "");
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(safeMin, Math.min(safeMax, parsed));
      onChange(clamped);
    }
    setInputMode(false);
    setInputValue("");
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
                L'ODV représente le nombre annuel d'opportunités pour un patient de voir votre spot. Il varie selon la fréquentation de l'hôpital et le nombre d'écrans (1 à 4). Plus vous choisissez d'ODV, plus le nombre d'écrans recommandés augmente.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Valeur centrale — cliquable pour saisie directe */}
      <div className="text-center py-2">
        {inputMode ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInputConfirm();
                if (e.key === "Escape") { setInputMode(false); setInputValue(""); }
              }}
              onBlur={handleInputConfirm}
              placeholder={formatNumber(safeValue)}
              className="w-40 text-center text-2xl font-bold border-b-2 border-[#1E6FFF] outline-none bg-transparent text-[#0B1220]"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setInputMode(true); setInputValue(String(safeValue)); }}
            className="group text-center"
            title="Cliquer pour saisir un nombre précis"
          >
            <p className="text-3xl font-bold text-[#0B1220] group-hover:text-[#1E6FFF] transition-colors">
              {formatNumber(safeValue)}
            </p>
            <p className="text-xs text-[#0B1F3B]/40 mt-0.5 group-hover:text-[#1E6FFF]/60 transition-colors">
              ✏️ Cliquer pour saisir un nombre précis
            </p>
          </button>
        )}
        <p className="text-sm font-medium mt-1" style={{ color }}>{label}</p>
      </div>

      {/* Slider natif */}
      <div className="px-1">
        <style>{`
          .odv-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            border-radius: 999px;
            outline: none;
            cursor: pointer;
            background: linear-gradient(
              to right,
              #1E6FFF 0%,
              #1DBF73 ${pct}%,
              #E5E7EB ${pct}%,
              #E5E7EB 100%
            );
          }
          .odv-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            border: 2px solid #1E6FFF;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          .odv-slider::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: white;
            border: 2px solid #1E6FFF;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          }
        `}</style>
        <input
          type="range"
          className="odv-slider"
          min={safeMin}
          max={safeMax}
          step={step}
          value={safeValue}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>

      {/* Labels min/max */}
      <div className="flex justify-between text-xs text-[#0B1F3B]/50 px-1">
        <span>Min : {formatNumber(safeMin)}</span>
        <span>Max : {formatNumber(safeMax)}</span>
      </div>

      {/* Boutons +/- */}
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => onChange(Math.max(safeMin, safeValue - step * 3))}
          className="px-4 py-1.5 rounded-full border border-[#0B1F3B]/20 text-sm text-[#0B1F3B] hover:bg-[#0B1F3B]/5 transition-colors"
        >
          − Moins
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(safeMax, safeValue + step * 3))}
          className="px-4 py-1.5 rounded-full border border-[#0B1F3B]/20 text-sm text-[#0B1F3B] hover:bg-[#0B1F3B]/5 transition-colors"
        >
          + Plus
        </button>
      </div>

      <p className="text-xs text-[#0B1F3B]/50 flex items-start gap-1">
        <span>*</span>
        <span>ODV = fréquentation hôpital × nombre d'écrans × 365 jours. Le nombre d'écrans recommandés s'adapte automatiquement à votre objectif ODV.</span>
      </p>
    </div>
  );
}
