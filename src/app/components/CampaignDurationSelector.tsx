import { Card } from "./ui/card";

interface CampaignDurationSelectorProps {
  value: 6 | 12 | 24 | 36;
  onChange: (value: 6 | 12 | 24 | 36) => void;
}

export default function CampaignDurationSelector({ value, onChange }: CampaignDurationSelectorProps) {
  const durations = [
    { value: 6, label: "6 mois", recommended: false },
    { value: 12, label: "1 an", recommended: true },
    { value: 24, label: "2 ans", recommended: false },
    { value: 36, label: "3 ans", recommended: false },
  ] as const;

  return (
    <div className="space-y-4">
      <label className="font-semibold text-[#0B1220]">
        Durée de campagne
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => onChange(duration.value)}
            className="relative"
          >
            {duration.recommended && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-[#1DBF73] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  Recommandé
                </span>
              </div>
            )}
            <Card
              className={`
                p-6 text-center transition-all cursor-pointer
                ${
                  value === duration.value
                    ? "bg-[#1E6FFF] border-[#1E6FFF] text-white shadow-lg scale-105"
                    : "bg-white border-[#0B1F3B]/10 text-[#0B1220] hover:border-[#1E6FFF] hover:shadow-md"
                }
              `}
            >
              <p className="text-xl font-bold">{duration.label}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
