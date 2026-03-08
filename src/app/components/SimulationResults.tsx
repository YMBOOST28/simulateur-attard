import { Eye, Users, TrendingUp, Target, DollarSign, Calendar } from "lucide-react";
import KPICard from "./KPICard";
import { formatCurrency, formatNumber } from "../utils/calculations";
import type { SimulationResults } from "../types/simulation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "./ui/card";

interface SimulationResultsProps {
  results: SimulationResults;
  campaignDuration: 6 | 12 | 24 | 36;
}

export default function SimulationResultsComponent({ results, campaignDuration }: SimulationResultsProps) {
  const chartData = [
    {
      duration: "6 mois",
      revenue: results.potentialRevenue6Months,
      investment: results.annualBudget / 2,
    },
    {
      duration: "1 an",
      revenue: results.potentialRevenue1Year,
      investment: results.annualBudget,
    },
    {
      duration: "2 ans",
      revenue: results.potentialRevenue2Years,
      investment: results.annualBudget * 2,
    },
    {
      duration: "3 ans",
      revenue: results.potentialRevenue3Years,
      investment: results.annualBudget * 3,
    },
  ];

  const currentRevenue = {
    6: results.potentialRevenue6Months,
    12: results.potentialRevenue1Year,
    24: results.potentialRevenue2Years,
    36: results.potentialRevenue3Years,
  }[campaignDuration];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          icon={Eye}
          label="Visibilité projetée (ODV)"
          value={formatNumber(results.annualPassages)}
          subtitle="passages annuels estimés"
          delay={0}
          color="blue"
        />
        <KPICard
          icon={Users}
          label="Leads estimés"
          value={formatNumber(results.estimatedLeads)}
          subtitle="nouveaux patients par an"
          delay={0.1}
          color="blue"
        />
        <KPICard
          icon={DollarSign}
          label="Potentiel de CA"
          value={formatCurrency(currentRevenue)}
          subtitle={`sur ${campaignDuration === 6 ? "6 mois" : campaignDuration === 12 ? "1 an" : campaignDuration === 24 ? "2 ans" : "3 ans"}`}
          delay={0.2}
          color="green"
        />
        <KPICard
          icon={TrendingUp}
          label="ROI estimé"
          value={`${results.roi > 0 ? "+" : ""}${results.roi.toFixed(1)}%`}
          subtitle={results.roi > 0 ? "Retour positif" : "Investissement nécessaire"}
          delay={0.3}
          color={results.roi > 0 ? "green" : "gray"}
        />
        <KPICard
          icon={Target}
          label="Écrans recommandés"
          value={results.recommendedScreens}
          subtitle="pour votre objectif ODV"
          delay={0.4}
          color="blue"
        />
        <KPICard
          icon={Calendar}
          label="Coût journalier"
          value={formatCurrency(results.costPerDay)}
          subtitle={`${formatCurrency(results.monthlyBudget)}/mois`}
          delay={0.5}
          color="gray"
        />
      </div>

      {/* Chart */}
      <Card className="p-6 border-[#0B1F3B]/10">
        <h3 className="font-semibold text-[#0B1220] mb-4">
          Évolution du CA et investissement selon la durée
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0B1F3B20" />
            <XAxis 
              dataKey="duration" 
              stroke="#0B1F3B"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#0B1F3B"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #0B1F3B20',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#1DBF73" name="CA potentiel" radius={[8, 8, 0, 0]} />
            <Bar dataKey="investment" fill="#1E6FFF" name="Investissement" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-[#0B1F3B]/50 mt-4">
          * Les calculs sont basés sur des moyennes observées lors de campagnes DOOH santé.
        </p>
      </Card>
    </div>
  );
}
