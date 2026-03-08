import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Download, CheckCircle, FileText, Lock, Loader2, Calendar, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { formatCurrency, formatNumber } from "../utils/calculations";
import { loadSimulation } from "../utils/simulationStore";
import { generateSimulationPDF } from "../utils/generatePDF";
import { sendLeadToMake } from "../utils/sendLead";

export default function Brochure() {
  const stored = loadSimulation();
  const sim = stored?.results;
  const data = stored?.data;

  const durationLabel = data
    ? ({ 6: "6 mois", 12: "1 an", 24: "2 ans", 36: "3 ans" } as Record<number, string>)[data.campaignDuration]
    : "1 an";
  const totalBudget = sim && data ? sim.annualBudget * (data.campaignDuration / 12) : 0;

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "", consent: false,
  });

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent || !stored) return;
    setIsLoading(true);

    // 1. Envoyer le lead à Make → Odoo CRM
    await sendLeadToMake({
      source: "rapport",
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      hospitalName: stored.hospitalName,
      professionName: stored.professionName,
      odv: stored.data.odv,
      recommendedScreens: sim?.recommendedScreens,
      annualBudget: sim?.annualBudget,
      roi: sim?.roi,
      campaignDuration: durationLabel,
    });

    // 2. Générer et télécharger le PDF automatiquement
    try {
      generateSimulationPDF(stored, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        company: form.company,
      });
    } catch (err) {
      console.error("Erreur PDF :", err);
    }

    setIsLoading(false);
    setIsUnlocked(true);
  };

  if (!stored || !sim) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <FileText className="w-12 h-12 text-[#0B1F3B]/20 mx-auto mb-4" />
          <p className="text-lg text-[#0B1F3B]/60 mb-6">Aucune simulation trouvée.</p>
          <Link to="/"><Button className="bg-[#1E6FFF] text-white">Faire ma simulation</Button></Link>
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
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-[#1E6FFF]/10" />
              <div className="relative flex items-center justify-center w-full h-full">
                <FileText className="w-9 h-9 text-[#1E6FFF]" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-3">
              Votre rapport personnalisé
            </h1>
            <p className="text-[#0B1F3B]/60 max-w-xl mx-auto">
              Téléchargez votre rapport PDF complet avec le logo Attard Multimédia — vos projections, budgets et recommandations sur mesure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Aperçu du rapport */}
            <Card className="p-6 border-[#0B1F3B]/10 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0B1220]">Contenu de votre rapport</h3>
                {!isUnlocked && (
                  <div className="flex items-center gap-1 text-xs text-[#0B1F3B]/40 bg-[#F5F7FA] px-2 py-1 rounded-full">
                    <Lock className="w-3 h-3" /> Verrouillé
                  </div>
                )}
                {isUnlocked && (
                  <Badge className="bg-[#1DBF73] text-white text-xs">Déverrouillé</Badge>
                )}
              </div>

              {/* Données — floutées tant que non déverrouillées */}
              <div className={`space-y-0 transition-all duration-500 ${!isUnlocked ? "blur-sm select-none pointer-events-none" : ""}`}>
                {[
                  { label: "Hôpital", value: stored.hospitalName },
                  { label: "Profession", value: stored.professionName },
                  { label: "Durée campagne", value: durationLabel },
                  { label: "Écrans recommandés", value: `${sim.recommendedScreens} écran${sim.recommendedScreens > 1 ? "s" : ""}` },
                  { label: "ODV annuel estimé", value: formatNumber(sim.annualPassages) },
                  { label: "Leads estimés / an", value: formatNumber(sim.estimatedLeads) },
                  { label: "Budget total TTC", value: formatCurrency(totalBudget) },
                  { label: "ROI estimé", value: `+${sim.roi.toFixed(1)}%` },
                  { label: "CA potentiel 1 an", value: formatCurrency(sim.potentialRevenue1Year) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#0B1F3B]/5 last:border-0">
                    <span className="text-sm text-[#0B1F3B]/55">{label}</span>
                    <span className="font-semibold text-[#0B1220] text-sm text-right">{value}</span>
                  </div>
                ))}
              </div>

              {!isUnlocked && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-[#F5F7FA] rounded-lg border border-[#0B1F3B]/8">
                  <Lock className="w-4 h-4 text-[#0B1F3B]/30 flex-shrink-0" />
                  <p className="text-xs text-[#0B1F3B]/45">
                    Renseignez vos coordonnées pour déverrouiller et télécharger le PDF automatiquement.
                  </p>
                </div>
              )}

              {/* Bouton re-télécharger si déjà unlocked */}
              {isUnlocked && (
                <Button
                  onClick={() => generateSimulationPDF(stored, {
                    firstName: form.firstName, lastName: form.lastName,
                    email: form.email, phone: form.phone, company: form.company,
                  })}
                  size="lg"
                  className="w-full mt-5 bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Re-télécharger mon rapport PDF
                </Button>
              )}

              {/* Ce que contient le rapport */}
              <div className="mt-5 pt-4 border-t border-[#0B1F3B]/8 space-y-2">
                <p className="text-xs font-semibold text-[#0B1F3B]/50 uppercase tracking-wide mb-2">Le rapport comprend</p>
                {[
                  "PDF A4 aux couleurs Attard Multimédia",
                  "Récapitulatif complet de la simulation",
                  "Plan d'écrans recommandé",
                  "Budget HT / TTC / mensuel / journalier",
                  "Projections ROI sur 1, 2 et 3 ans",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#0B1F3B]/60">
                    <CheckCircle className="w-3.5 h-3.5 text-[#1DBF73] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            {/* Formulaire de déverrouillage / Confirmation */}
            <Card className="p-6 border-[#0B1F3B]/10 bg-white">
              {isUnlocked ? (
                <div className="flex flex-col items-center text-center h-full justify-center py-6">
                  <div className="relative mb-5">
                    <div className="absolute inset-0 rounded-full bg-[#1DBF73]/20 animate-ping" />
                    <div className="relative p-4 rounded-full bg-[#1DBF73]/10 w-16 h-16 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-[#1DBF73]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1220] mb-2">PDF téléchargé !</h3>
                  <p className="text-sm text-[#0B1F3B]/55 mb-2">
                    Votre rapport <strong>{stored.hospitalName}</strong> a été téléchargé automatiquement.
                  </p>
                  <p className="text-sm text-[#0B1F3B]/55 mb-7">
                    Un expert Attard Multimédia vous contactera prochainement.
                  </p>
                  <div className="space-y-3 w-full">
                    <Link to="/rendez-vous" className="block">
                      <Button size="lg" className="w-full bg-[#1E6FFF] hover:bg-[#1E6FFF]/90 text-white">
                        <Calendar className="mr-2 w-5 h-5" />
                        Prendre un RDV expert
                      </Button>
                    </Link>
                    <Link to="/commander" className="block">
                      <Button size="lg" variant="outline" className="w-full border-[#1DBF73] text-[#1DBF73] hover:bg-[#1DBF73]/5">
                        <ShoppingCart className="mr-2 w-5 h-5" />
                        Je passe commande
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-[#1E6FFF]" />
                    <h3 className="text-lg font-semibold text-[#0B1220]">Déverrouiller mon rapport PDF</h3>
                  </div>
                  <p className="text-sm text-[#0B1F3B]/45 mb-5">
                    Gratuit, sans engagement. Le PDF se télécharge automatiquement.
                  </p>

                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-[#0B1F3B]/70">Prénom *</Label>
                        <Input required value={form.firstName}
                          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                          className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1 h-9" />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-[#0B1F3B]/70">Nom *</Label>
                        <Input required value={form.lastName}
                          onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                          className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1 h-9" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-[#0B1F3B]/70">Email professionnel *</Label>
                      <Input type="email" required value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1 h-9" />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-[#0B1F3B]/70">Téléphone *</Label>
                      <Input type="tel" required value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1 h-9" />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-[#0B1F3B]/70">Structure / Cabinet *</Label>
                      <Input required value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1 h-9" />
                    </div>

                    <div className="flex items-start gap-2.5 p-3 bg-[#F5F7FA] rounded-lg">
                      <Checkbox
                        id="consent"
                        checked={form.consent}
                        onCheckedChange={c => setForm(f => ({ ...f, consent: !!c }))}
                        required
                      />
                      <Label htmlFor="consent" className="text-xs cursor-pointer leading-relaxed text-[#0B1F3B]/55">
                        J'accepte qu'Attard Multimédia utilise ces informations pour me recontacter dans le cadre de ma simulation. Pas de démarchage abusif.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#1E6FFF] hover:bg-[#1E6FFF]/90 text-white h-12"
                      disabled={isLoading || !form.consent || !form.firstName || !form.email || !form.phone || !form.company}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Génération du PDF...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger mon rapport PDF gratuit
                        </span>
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
