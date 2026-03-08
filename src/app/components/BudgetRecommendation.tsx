import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, TrendingUp, Monitor } from "lucide-react";
import { formatCurrency, formatNumber } from "../utils/calculations";
import type { SimulationResults } from "../types/simulation";

interface BudgetRecommendationProps {
  results: SimulationResults;
  campaignDuration: 6 | 12 | 24 | 36;
}

export default function BudgetRecommendation({ results, campaignDuration }: BudgetRecommendationProps) {
  const durationLabel = { 6: "6 mois", 12: "1 an", 24: "2 ans", 36: "3 ans" }[campaignDuration];
  const totalBudget = results.annualBudget * (campaignDuration / 12);

  const screenMessage = () => {
    if (results.recommendedScreens === 1)
      return "Pour votre objectif ODV, un seul écran est suffisant. C'est la formule idéale pour démarrer avec un budget maîtrisé.";
    if (results.recommendedScreens === 2)
      return "Votre objectif ODV nécessite 2 écrans pour maximiser votre couverture dans l'établissement et toucher plus de patients.";
    if (results.recommendedScreens === 3)
      return "Avec 3 écrans, votre spot est présent dans les zones stratégiques de l'hôpital — salles d'attente, couloirs, zones de passage.";
    return "La présence sur 4 écrans vous garantit une saturation maximale dans l'établissement. Votre marque est visible partout.";
  };

  const netBenefit = ({
    6: results.potentialRevenue6Months,
    12: results.potentialRevenue1Year,
    24: results.potentialRevenue2Years,
    36: results.potentialRevenue3Years,
  } as Record<number, number>)[campaignDuration] - totalBudget;

  return (
    <Card className="p-8 border-2 border-[#1E6FFF] bg-gradient-to-br from-[#1E6FFF]/5 to-white">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-[#1E6FFF] text-white">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#0B1220] mb-1">
            Plan recommandé par Attard Multimédia
          </h3>
          <p className="text-sm text-[#0B1F3B]/60">
            {screenMessage()}
          </p>
        </div>
      </div>

      {/* Écrans recommandés — mis en avant */}
      <div className="flex items-center gap-3 p-4 bg-[#1E6FFF]/10 rounded-xl border border-[#1E6FFF]/20 mb-6">
        <Monitor className="w-6 h-6 text-[#1E6FFF] flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-[#0B1F3B]/60">Nombre d'écrans conseillé pour votre objectif ODV</p>
          <p className="text-2xl font-bold text-[#1E6FFF]">
            {results.recommendedScreens} écran{results.recommendedScreens > 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#0B1F3B]/50">ODV atteint</p>
          <p className="text-lg font-bold text-[#0B1220]">{formatNumber(results.annualPassages)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg border border-[#0B1F3B]/10">
          <p className="text-xs text-[#0B1F3B]/60 mb-1">Budget total</p>
          <p className="text-2xl font-bold text-[#0B1220]">{formatCurrency(totalBudget)}</p>
          <p className="text-xs text-[#0B1F3B]/50 mt-1">sur {durationLabel}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-[#0B1F3B]/10">
          <p className="text-xs text-[#0B1F3B]/60 mb-1">Par mois</p>
          <p className="text-2xl font-bold text-[#0B1220]">{formatCurrency(results.monthlyBudget)}</p>
          <p className="text-xs text-[#0B1F3B]/50 mt-1">paiement fractionné possible</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-[#0B1F3B]/10">
          <p className="text-xs text-[#0B1F3B]/60 mb-1">Par jour</p>
          <p className="text-2xl font-bold text-[#0B1220]">{formatCurrency(results.costPerDay)}</p>
          <p className="text-xs text-[#0B1F3B]/50 mt-1">visibilité continue</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-[#0B1F3B]/10">
          <p className="text-xs text-[#0B1F3B]/60 mb-1">CPM estimé</p>
          <p className="text-2xl font-bold text-[#0B1220]">
            {formatCurrency((totalBudget / results.annualPassages) * 1000)}
          </p>
          <p className="text-xs text-[#0B1F3B]/50 mt-1">coût pour 1 000 vues</p>
        </div>
      </div>

      {results.roi > 0 && (
        <div className="flex items-center gap-3 p-4 bg-[#1DBF73]/10 rounded-lg border border-[#1DBF73]/20">
          <TrendingUp className="w-5 h-5 text-[#1DBF73]" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0B1220]">
              ROI positif : +{results.roi.toFixed(1)}%
            </p>
            <p className="text-xs text-[#0B1F3B]/60">
              Votre campagne pourrait générer {formatCurrency(netBenefit)} de bénéfice net sur {durationLabel}
            </p>
          </div>
          <Badge className="bg-[#1DBF73] text-white">Rentable</Badge>
        </div>
      )}

      <div className="mt-6 p-4 bg-[#F5F7FA] rounded-lg">
        <p className="text-xs text-[#0B1F3B]/60">
          <span className="font-semibold">Inclus dans votre plan :</span> diffusion sur {results.recommendedScreens} écran{results.recommendedScreens > 1 ? "s" : ""}, création de votre spot publicitaire sur mesure, et accompagnement de nos experts pendant toute la durée de votre campagne.
        </p>
      </div>
    </Card>
  );
}
