export interface SimulationData {
  hospital: string | null;
  profession: string | null;
  odv: number;
  spotDuration: 15 | 20 | 25 | 30;
  campaignDuration: 6 | 12 | 24 | 36;
}

export interface SimulationResults {
  recommendedScreens: number;
  annualPassages: number;
  estimatedLeads: number;
  potentialRevenue6Months: number;
  potentialRevenue1Year: number;
  potentialRevenue2Years: number;
  potentialRevenue3Years: number;
  roi: number;
  costPerDay: number;
  annualBudget: number;
  monthlyBudget: number;
}
