import { hospitals } from "../data/hospitals";
import { professions } from "../data/professions";
import type { SimulationData, SimulationResults } from "../types/simulation";

// ─── Constantes basées sur les études DOOH santé (Opinion Way / IDS Media / Broadsign) ───
// 100% des patients regardent l'écran en salle d'attente (IDS Media / Broadsign)
const TAUX_ATTENTION = 1.0;
// 80% portent plus d'attention qu'à une pub TV (Opinion Way 2017)
const TAUX_MEMORISATION = 0.80;
// Taux de conversion DOOH santé : panier moyen × 0.8 × 0.3 × 0.002 (Publicis/Broadsign santé)
const TAUX_CONVERSION_DOOH = 0.002;
// Nombre de spots diffusés par heure par écran (boucle standard de 10 min → ~6 spots/h)
const SPOTS_PAR_HEURE = 6;
// Heures de diffusion par jour en hôpital
const HEURES_DIFFUSION_PAR_JOUR = 12;
// Base prix écran/an
const BASE_SCREEN_COST_PER_YEAR = 3500;

/**
 * Calcule l'ODV max possible pour un hôpital donné, un nombre d'écrans et une durée de spot.
 * Formule : passagesPerDay × nbEcrans × (spotsParHeure × duréeSpot/3600) × joursAnnée
 */
export function calculateMaxODV(
  passagesPerDay: number,
  nbScreens: number,
  spotDuration: number
): number {
  const spotsParJourParEcran = SPOTS_PAR_HEURE * HEURES_DIFFUSION_PAR_JOUR;
  // Chaque passage = 1 opportunité de voir par spot diffusé pendant la présence du patient
  // Un patient voit en moyenne (temps d'attente ~30min / durée boucle) spots
  const spotsVusParPatient = Math.min(
    spotsParJourParEcran,
    Math.floor((30 * 60) / spotDuration) // ~30 min d'attente
  );
  return Math.floor(passagesPerDay * nbScreens * spotsVusParPatient * 365);
}

/**
 * Calcule l'ODV min pour un hôpital (1 écran, spot minimal)
 */
export function calculateMinODV(passagesPerDay: number, spotDuration: number): number {
  return calculateMaxODV(passagesPerDay, 1, spotDuration);
}

export function calculateSimulationResults(data: SimulationData): SimulationResults | null {
  const hospital = hospitals.find((h) => h.id === data.hospital);
  const profession = professions.find((p) => p.id === data.profession);

  if (!hospital || !profession) {
    return null;
  }

  // ── Calcul du nombre d'écrans recommandés pour atteindre l'ODV cible ──
  const odvParEcran = calculateMinODV(hospital.passagesPerDay, data.spotDuration);
  const recommendedScreens = Math.max(1, Math.ceil(data.odv / odvParEcran));

  // ── ODV réel recalculé avec le nombre d'écrans recommandés ──
  const realODV = calculateMaxODV(hospital.passagesPerDay, recommendedScreens, data.spotDuration);

  // ── Formule ROI DOOH Santé (Publicis / Broadsign) ──
  // Étape 1 : ODV × taux d'attention (100% en salle d'attente médicale)
  const contactsAttentifs = realODV * TAUX_ATTENTION;
  // Étape 2 : × taux mémorisation/engagement (80% vs TV - Opinion Way)
  const contactsEngages = contactsAttentifs * TAUX_MEMORISATION;
  // Étape 3 : × 0.3 (personnes qui voient le spot en entier)
  const contactsSpotEntier = contactsEngages * 0.3;
  // Étape 4 : × 0.002 (taux de conversion DOOH santé - Publicis/Broadsign)
  const estimatedLeads = Math.floor(contactsSpotEntier * TAUX_CONVERSION_DOOH);

  // ── Revenus projetés ──
  const revenuePerLead = profession.averageBasket;
  const leadsPerMonth = estimatedLeads / 12;

  const potentialRevenue6Months = Math.floor(leadsPerMonth * 6 * revenuePerLead);
  const potentialRevenue1Year = Math.floor(estimatedLeads * revenuePerLead);
  const potentialRevenue2Years = Math.floor(estimatedLeads * 2 * revenuePerLead);
  const potentialRevenue3Years = Math.floor(estimatedLeads * 3 * revenuePerLead);

  // ── Budget ──
  const annualBudget = recommendedScreens * BASE_SCREEN_COST_PER_YEAR;
  const monthlyBudget = Math.floor(annualBudget / 12);
  const costPerDay = Math.floor(annualBudget / 365);

  // ── ROI pour la durée de campagne choisie ──
  const totalInvestment = annualBudget * (data.campaignDuration / 12);
  const totalRevenue = {
    6: potentialRevenue6Months,
    12: potentialRevenue1Year,
    24: potentialRevenue2Years,
    36: potentialRevenue3Years,
  }[data.campaignDuration];

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
