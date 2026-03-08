import { hospitals } from "../data/hospitals";
import { professions } from "../data/professions";
import type { SimulationData, SimulationResults } from "../types/simulation";

// ─── Constantes DOOH santé ───
const TAUX_ATTENTION = 1.0;
const TAUX_MEMORISATION = 0.80;
const TAUX_CONVERSION_DOOH = 0.002;
// Facteur ODV calibré: passagesPerDay × nbEcrans × 365 × FACTEUR_ODV
// Calibré sur Morlaix (6192 passages): 1 écran → ~45 000 ODV, 4 écrans → ~180 000 ODV
// 45000 / (6192 × 365) = 0.01991
const FACTEUR_ODV = 0.01991;
const MAX_ECRANS = 4;
const BASE_SCREEN_COST_PER_YEAR = 3500;

export function calculateMaxODV(
  passagesPerDay: number,
  nbScreens: number,
  _spotDuration: number
): number {
  return Math.floor(passagesPerDay * nbScreens * 365 * FACTEUR_ODV);
}

export function calculateMinODV(passagesPerDay: number, _spotDuration: number): number {
  return Math.floor(passagesPerDay * 1 * 365 * FACTEUR_ODV);
}

export function calculateSimulationResults(data: SimulationData): SimulationResults | null {
  const hospital = hospitals.find((h) => h.id === data.hospital);
  const profession = professions.find((p) => p.id === data.profession);

  if (!hospital || !profession) return null;

  const odvParEcran = calculateMinODV(hospital.passagesPerDay, data.spotDuration);
  const recommendedScreens = Math.max(1, Math.min(MAX_ECRANS, Math.ceil(data.odv / odvParEcran)));
  const realODV = calculateMaxODV(hospital.passagesPerDay, recommendedScreens, data.spotDuration);

  const contactsAttentifs = realODV * TAUX_ATTENTION;
  const contactsEngages = contactsAttentifs * TAUX_MEMORISATION;
  const contactsSpotEntier = contactsEngages * 0.3;
  const estimatedLeads = Math.floor(contactsSpotEntier * TAUX_CONVERSION_DOOH);

  const revenuePerLead = profession.averageBasket;
  const leadsPerMonth = estimatedLeads / 12;

  const potentialRevenue6Months = Math.floor(leadsPerMonth * 6 * revenuePerLead);
  const potentialRevenue1Year = Math.floor(estimatedLeads * revenuePerLead);
  const potentialRevenue2Years = Math.floor(estimatedLeads * 2 * revenuePerLead);
  const potentialRevenue3Years = Math.floor(estimatedLeads * 3 * revenuePerLead);

  const annualBudget = recommendedScreens * BASE_SCREEN_COST_PER_YEAR;
  const monthlyBudget = Math.floor(annualBudget / 12);
  const costPerDay = Math.floor(annualBudget / 365);

  const totalInvestment = annualBudget * (data.campaignDuration / 12);
  const totalRevenue = ({
    6: potentialRevenue6Months,
    12: potentialRevenue1Year,
    24: potentialRevenue2Years,
    36: potentialRevenue3Years,
  } as Record<number, number>)[data.campaignDuration] ?? potentialRevenue1Year;

  const roi = totalInvestment > 0
    ? ((totalRevenue - totalInvestment) / totalInvestment) * 100
    : 0;

  return {
    recommendedScreens,
    annualPassages: realODV,
    estimatedLeads,
    potentialRevenue6Months,
    potentialRevenue1Year,
    potentialRevenue2Years,
    potentialRevenue3Years,
    roi,
    costPerDay,
    annualBudget,
    monthlyBudget,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num);
}
