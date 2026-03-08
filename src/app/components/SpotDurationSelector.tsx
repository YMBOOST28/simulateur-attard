import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SpotDurationSelectorProps {
  value: 15 | 20 | 25 | 30;
  onChange: (value: 15 | 20 | 25 | 30) => void;
}

export default function SpotDurationSelector({ value, onChange }: SpotDurationSelectorProps) {
  const durations = [
    { value: 15, impact: "Base" },
    { value: 20, impact: "+15%" },
    { value: 25, impact: "+25%" },
    { value: 30, impact: "+35%" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="font-semibold text-[#0B1220]">
          Durée du spot publicitaire
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-[#0B1F3B]/40" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Plus votre spot est long, plus l'engagement augmente. Un spot de 30s génère jusqu'à 35% d'impressions supplémentaires par rapport à un spot de 15s.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <RadioGroup
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val) as 15 | 20 | 25 | 30)}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {durations.map((duration) => (
          <div key={duration.value}>
            <RadioGroupItem
              value={duration.value.toString()}
              id={`duration-${duration.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`duration-${duration.value}`}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                ${
                  value === duration.value
                    ? "bg-[#1E6FFF] border-[#1E6FFF] text-white shadow-lg"
                    : "bg-[#F5F7FA] border-transparent text-[#0B1220] hover:border-[#1E6FFF]/30"
                }
              `}
            >
              <span className="text-2xl font-bold mb-1">{duration.value}s</span>
              <span className={`text-xs ${
                value === duration.value ? "text-white/90" : "text-[#1DBF73]"
              }`}>
                {duration.impact}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
