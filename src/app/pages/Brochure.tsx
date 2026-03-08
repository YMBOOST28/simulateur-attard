import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Download, CheckCircle, FileText, Lock, Loader2 } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { formatCurrency, formatNumber } from "../utils/calculations";
import { loadSimulation } from "../utils/simulationStore";

export default function Brochure() {
  const stored = loadSimulation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", company: "", consent: false });

  const sim = stored?.results;
  const data = stored?.data;

  const durationLabel = data ? ({ 6: "6 mois", 12: "1 an", 24: "2 ans", 36: "3 ans" } as Record<number,string>)[data.campaignDuration] : "1 an";
  const totalBudget = sim && data ? sim.annualBudget * (data.campaignDuration / 12) : 0;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsUnlocked(true);
    }, 1500);
  };

  const handleDownload = () => {
    if (!stored || !sim || !data) return;

    const lines = [
      "RAPPORT DE SIMULATION — ATTARD MULTIMÉDIA",
      "===========================================",
      "",
      `Client : ${form.firstName} ${form.lastName}`,
      `Email : ${form.email}`,
      `Entreprise : ${form.company}`,
      `Date : ${new Date().toLocaleDateString("fr-FR")}`,
      "",
      "PARAMÈTRES DE LA SIMULATION",
      "---------------------------",
      `Hôpital sélectionné : ${stored.hospitalName}`,
      `Profession : ${stored.professionName}`,
      `Durée du spot : ${data.spotDuration}s`,
      `Durée de campagne : ${durationLabel}`,
      `ODV ciblé : ${formatNumber(data.odv)}`,
      "",
      "PLAN RECOMMANDÉ",
      "---------------",
      `Nombre d'écrans conseillé : ${sim.recommendedScreens} écran${sim.recommendedScreens > 1 ? "s" : ""}`,
      `ODV annuel estimé : ${formatNumber(sim.annualPassages)}`,
      `Leads estimés / an : ${formatNumber(sim.estimatedLeads)}`,
      "",
      "BUDGET",
      "------",
      `Budget annuel HT : ${formatCurrency(sim.annualBudget / 1.2)}`,
      `Budget annuel TTC : ${formatCurrency(sim.annualBudget)}`,
      `Budget total sur ${durationLabel} : ${formatCurrency(totalBudget)}`,
      `Coût mensuel : ${formatCurrency(sim.monthlyBudget)}`,
      `Coût journalier : ${formatCurrency(sim.costPerDay)}`,
      "",
      "PROJECTIONS DE RETOUR SUR INVESTISSEMENT",
      "-----------------------------------------",
      `CA potentiel sur 6 mois : ${formatCurrency(sim.potentialRevenue6Months)}`,
      `CA potentiel sur 1 an : ${formatCurrency(sim.potentialRevenue1Year)}`,
      `CA potentiel sur 2 ans : ${formatCurrency(sim.potentialRevenue2Years)}`,
      `CA potentiel sur 3 ans : ${formatCurrency(sim.potentialRevenue3Years)}`,
      `ROI estimé : +${sim.roi.toFixed(1)}%`,
      "",
      "---",
      "* Ces projections sont indicatives et basées sur des études DOOH Santé (Publicis/Broadsign, Opinion Way 2017, IDS Media).",
      "* Pour obtenir un devis officiel, contactez-nous sur www.attard-multimedia.com/contact",
    ];

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-simulation-attard-${stored.hospitalName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stored) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-lg text-[#0B1F3B]/60 mb-6">Aucune simulation trouvée. Veuillez d'abord compléter votre simulation.</p>
          <Link to="/"><Button className="bg-[#1E6FFF] text-white">Retour au simulateur</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-[#1E6FFF] hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />Retour au simulateur
            </Link>
          </div>

          <div className="text-center mb-10">
            <div className="p-4 rounded-full bg-[#1E6FFF]/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-[#1E6FFF]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-3">Votre rapport personnalisé</h1>
            <p className="text-lg text-[#0B1F3B]/60 max-w-xl mx-auto">
              Téléchargez le récapitulatif complet de votre simulation avec toutes vos projections et notre recommandation sur mesure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Aperçu du rapport */}
            <Card className="p-6 border-[#0B1F3B]/10 bg-white">
              <h3 className="text-lg font-semibold text-[#0B1220] mb-4">Aperçu de votre rapport</h3>
              <div className={`space-y-3 ${!isUnlocked ? "blur-sm select-none pointer-events-none" : ""}`}>
                {sim && data && [
                  { label: "Hôpital", value: stored.hospitalName },
                  { label: "Profession", value: stored.professionName },
                  { label: "Écrans recommandés", value: `${sim.recommendedScreens} écran${sim.recommendedScreens > 1 ? "s" : ""}` },
                  { label: "ODV annuel estimé", value: formatNumber(sim.annualPassages) },
                  { label: "Leads estimés / an", value: formatNumber(sim.estimatedLeads) },
                  { label: "Budget total", value: formatCurrency(totalBudget) },
                  { label: "ROI estimé", value: `+${sim.roi.toFixed(1)}%` },
                  { label: "CA potentiel 1 an", value: formatCurrency(sim.potentialRevenue1Year) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#0B1F3B]/5 last:border-0">
                    <span className="text-sm text-[#0B1F3B]/60">{label}</span>
                    <span className="font-semibold text-[#0B1220] text-sm">{value}</span>
                  </div>
                ))}
              </div>

              {!isUnlocked && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-[#0B1F3B]/5 rounded-lg">
                  <Lock className="w-4 h-4 text-[#0B1F3B]/40" />
                  <p className="text-xs text-[#0B1F3B]/50">Renseignez vos coordonnées pour déverrouiller et télécharger</p>
                </div>
              )}

              {isUnlocked && (
                <Button onClick={handleDownload} size="lg" className="w-full mt-6 bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white">
                  <Download className="mr-2 w-5 h-5" />
                  Télécharger mon rapport
                </Button>
              )}

              <div className="mt-4 space-y-2">
                {["Récapitulatif complet de la simulation", "Plan d'écrans recommandé", "Projections ROI sur 1, 2 et 3 ans", "Budget détaillé (HT/TTC/mensuel/journalier)"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#0B1F3B]/60">
                    <CheckCircle className="w-4 h-4 text-[#1DBF73] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            {/* Formulaire de déverrouillage */}
            <Card className="p-6 border-[#0B1F3B]/10 bg-white">
              {isUnlocked ? (
                <div className="text-center py-8">
                  <div className="p-4 rounded-full bg-[#1DBF73]/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#1DBF73]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B1220] mb-2">Rapport déverrouillé !</h3>
                  <p className="text-sm text-[#0B1F3B]/60 mb-6">Un expert Attard Multimédia vous contactera prochainement pour vous accompagner dans votre projet.</p>
                  <div className="space-y-3">
                    <Link to="/commander">
                      <Button size="lg" className="w-full bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white">
                        Je passe commande
                      </Button>
                    </Link>
                    <a href="https://www.attard-multimedia.com/contact" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="w-full border-[#1E6FFF] text-[#1E6FFF]">
                        Parler à un expert
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-[#0B1220] mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#1E6FFF]" />
                    Déverrouiller mon rapport
                  </h3>
                  <p className="text-sm text-[#0B1F3B]/50 mb-5">Renseignez vos coordonnées pour accéder au téléchargement. Gratuit et sans engagement.</p>
                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email professionnel *</Label>
                      <Input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input id="phone" type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="company">Structure / Cabinet *</Label>
                      <Input id="company" required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="consent"
                        checked={form.consent}
                        onCheckedChange={(checked) => setForm(f => ({ ...f, consent: !!checked }))}
                        required
                      />
                      <Label htmlFor="consent" className="text-xs cursor-pointer leading-relaxed text-[#0B1F3B]/60">
                        J'accepte qu'Attard Multimédia me recontacte au sujet de ma simulation. Aucun démarchage abusif.
                      </Label>
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[#1E6FFF] hover:bg-[#1E6FFF]/90 text-white" disabled={isLoading || !form.consent}>
                      {isLoading ? (
                        <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Génération en cours...</>
                      ) : (
                        <><Download className="mr-2 w-5 h-5" />Obtenir mon rapport gratuit</>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
