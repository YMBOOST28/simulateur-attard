import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CreditCard, CheckCircle2, Shield, Phone } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { formatCurrency, formatNumber } from "../utils/calculations";
import { loadSimulation } from "../utils/simulationStore";
import { sendLeadToMake } from "../utils/sendLead";

export default function Order() {
  const stored = loadSimulation();
  const [paymentMode, setPaymentMode] = useState<"1x" | "3x" | "6x">("1x");
  const [wantCallback, setWantCallback] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Données réelles depuis la simulation, ou fallback
  const sim = stored ? {
    hospital: stored.hospitalName,
    profession: stored.professionName,
    spotDuration: `${stored.data.spotDuration}s`,
    campaignDuration: { 6: "6 mois", 12: "1 an", 24: "2 ans", 36: "3 ans" }[stored.data.campaignDuration] || "1 an",
    odv: stored.data.odv,
    recommendedScreens: stored.results.recommendedScreens,
    annualPassages: stored.results.annualPassages,
    estimatedLeads: stored.results.estimatedLeads,
    potentialRevenue: stored.results.potentialRevenue1Year,
    roi: stored.results.roi,
    annualBudget: stored.results.annualBudget,
    monthlyBudget: stored.results.monthlyBudget,
    costPerDay: stored.results.costPerDay,
    campaignDurationMonths: stored.data.campaignDuration,
  } : null;

  const totalBudget = sim ? sim.annualBudget * (sim.campaignDurationMonths / 12) : 0;

  const getPaymentSchedule = () => {
    switch (paymentMode) {
      case "3x": return Array(3).fill(Math.round(totalBudget / 3));
      case "6x": return Array(6).fill(Math.round(totalBudget / 6));
      default: return [totalBudget];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    await sendLeadToMake({
      source: wantCallback ? "rappel" : "commande",
      firstName: formData.get("firstName") as string || "",
      lastName: formData.get("lastName") as string || "",
      email: formData.get("email") as string || "",
      phone: formData.get("phone") as string || "",
      company: formData.get("companyName") as string || "",
      callbackTime: formData.get("callbackTime") as string || "",
      hospitalName: stored?.hospitalName,
      professionName: stored?.professionName,
      odv: stored?.data.odv,
      recommendedScreens: sim?.recommendedScreens,
      annualBudget: sim?.annualBudget,
      roi: sim?.roi,
      campaignDuration: sim ? `${stored?.data.campaignDuration} mois` : undefined,
      appointmentType: paymentMode,
    });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (!sim) {
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-full bg-[#1DBF73]/10 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#1DBF73]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0B1220] mb-4">
              {wantCallback ? "Demande de rappel confirmée !" : "Commande confirmée !"}
            </h1>
            <p className="text-lg text-[#0B1F3B]/60 mb-8">
              {wantCallback
                ? "Un expert Attard Multimédia vous rappellera sous 24h pour finaliser votre campagne et vous accompagner dans les prochaines étapes."
                : "Un expert Attard Multimédia vous contactera sous 24h pour lancer la création de votre spot (brief créatif, validation, planning de diffusion)."}
            </p>
            <Card className="p-6 mb-8 bg-white border-[#0B1F3B]/10 text-left">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[#0B1F3B]/10">
                  <span className="text-sm text-[#0B1F3B]/60">Référence</span>
                  <span className="font-semibold text-[#0B1220]">AM-{new Date().getFullYear()}-{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
                <div className="flex justify-between"><span className="text-sm text-[#0B1F3B]/60">Hôpital</span><span className="font-semibold">{sim.hospital}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#0B1F3B]/60">Écrans</span><span className="font-semibold">{sim.recommendedScreens}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[#0B1F3B]/60">Durée</span><span className="font-semibold">{sim.campaignDuration}</span></div>
                <div className="flex justify-between items-center pt-3 border-t border-[#0B1F3B]/10">
                  <span className="text-sm text-[#0B1F3B]/60">Montant</span>
                  <span className="font-bold text-xl text-[#1DBF73]">{formatCurrency(totalBudget)}</span>
                </div>
              </div>
            </Card>
            <Link to="/"><Button size="lg" className="bg-[#1E6FFF] text-white">Retour à l'accueil</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-[#1E6FFF] hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />Retour au simulateur
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-3">Finaliser ma campagne</h1>
          <p className="text-lg text-[#0B1F3B]/60 mb-8">Validez votre commande et démarrez votre campagne en milieu hospitalier</p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne gauche */}
            <div className="lg:col-span-2 space-y-8">

              {/* Récapitulatif */}
              <Card className="p-6 border-2 border-[#1E6FFF] bg-gradient-to-br from-[#1E6FFF]/5 to-white">
                <h3 className="text-xl font-semibold text-[#0B1220] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1E6FFF]" />
                  Plan recommandé par Attard Multimédia
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Hôpital", value: sim.hospital },
                    { label: "Profession", value: sim.profession },
                    { label: "Durée du spot", value: sim.spotDuration },
                    { label: "Durée de campagne", value: sim.campaignDuration },
                    { label: "Écrans recommandés", value: `${sim.recommendedScreens} écran${sim.recommendedScreens > 1 ? "s" : ""}` },
                    { label: "ODV ciblé", value: formatNumber(sim.odv) },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-white rounded-lg border border-[#0B1F3B]/10">
                      <p className="text-xs text-[#0B1F3B]/50 mb-1">{label}</p>
                      <p className="font-semibold text-[#0B1220] text-sm">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1DBF73]/10 rounded-full border border-[#1DBF73]/20">
                    <span className="text-xs font-semibold text-[#1DBF73]">ROI estimé : +{sim.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E6FFF]/10 rounded-full border border-[#1E6FFF]/20">
                    <span className="text-xs font-semibold text-[#1E6FFF]">{formatNumber(sim.annualPassages)} ODV/an</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0B1F3B]/5 rounded-full border border-[#0B1F3B]/10">
                    <span className="text-xs font-semibold text-[#0B1220]">~{sim.estimatedLeads} leads estimés/an</span>
                  </div>
                </div>
              </Card>

              {/* Option : être rappelé */}
              <Card className="p-6 border-[#0B1F3B]/10 bg-white">
                <h3 className="text-xl font-semibold text-[#0B1220] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#1E6FFF]" />
                  Vous préférez être rappelé ?
                </h3>
                <div
                  onClick={() => setWantCallback(!wantCallback)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${wantCallback ? "border-[#1E6FFF] bg-[#1E6FFF]/5" : "border-[#0B1F3B]/10 hover:border-[#1E6FFF]/40"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${wantCallback ? "border-[#1E6FFF] bg-[#1E6FFF]" : "border-[#0B1F3B]/30"}`}>
                      {wantCallback && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-[#0B1220]">Je souhaite être rappelé par un expert</p>
                      <p className="text-sm text-[#0B1F3B]/60 mt-1">Un conseiller Attard Multimédia vous contactera sous 24h pour vous accompagner, répondre à vos questions et finaliser votre commande ensemble.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Informations entreprise */}
              <Card className="p-6 border-[#0B1F3B]/10 bg-white">
                <h3 className="text-xl font-semibold text-[#0B1220] mb-4">Informations entreprise</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label htmlFor="firstName">Prénom *</Label><Input id="firstName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" /></div>
                    <div><Label htmlFor="lastName">Nom *</Label><Input id="lastName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" /></div>
                    <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" /></div>
                    <div><Label htmlFor="phone">Téléphone *</Label><Input id="phone" type="tel" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" /></div>
                    <div><Label htmlFor="companyName">Raison sociale *</Label><Input id="companyName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" /></div>
                    <div><Label htmlFor="siret">SIRET *</Label><Input id="siret" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" /></div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input id="address" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1 mb-2" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Input placeholder="Code postal *" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                      <Input placeholder="Ville *" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                      <Input placeholder="Pays" defaultValue="France" className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                  </div>
                  {wantCallback && (
                    <div>
                      <Label htmlFor="callbackTime">Créneau de rappel souhaité</Label>
                      <Input id="callbackTime" placeholder="ex: Mardi matin, Jeudi après-midi..." className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <Checkbox id="certify" required />
                    <Label htmlFor="certify" className="text-sm cursor-pointer leading-relaxed">
                      Je certifie l'exactitude de ces informations et accepte les <a href="https://www.attard-multimedia.com/contact" className="text-[#1E6FFF] underline" target="_blank">conditions générales</a> d'Attard Multimédia.
                    </Label>
                  </div>

                  {/* Paiement */}
                  {!wantCallback && (
                    <div className="space-y-4 pt-4 border-t border-[#0B1F3B]/10">
                      <h4 className="font-semibold text-[#0B1220]">Mode de paiement</h4>
                      <RadioGroup value={paymentMode} onValueChange={(v) => setPaymentMode(v as "1x" | "3x" | "6x")}>
                        <div className="space-y-3">
                          {[
                            { value: "1x", label: "Paiement en 1 fois", amount: formatCurrency(totalBudget) },
                            { value: "3x", label: "Paiement en 3 fois", amount: `3 × ${formatCurrency(Math.round(totalBudget / 3))}` },
                            { value: "6x", label: "Paiement en 6 fois", amount: `6 × ${formatCurrency(Math.round(totalBudget / 6))}` },
                          ].map(({ value, label, amount }) => (
                            <div key={value} className={`p-4 rounded-lg border-2 transition-all ${paymentMode === value ? "border-[#1E6FFF] bg-[#1E6FFF]/5" : "border-[#0B1F3B]/10"}`}>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value={value} id={`pay${value}`} />
                                <Label htmlFor={`pay${value}`} className="flex-1 cursor-pointer flex justify-between">
                                  <span className="font-medium">{label}</span>
                                  <span className="font-bold text-[#0B1220]">{amount}</span>
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>

                      {paymentMode !== "1x" && (
                        <div className="p-4 bg-[#F5F7FA] rounded-lg">
                          <p className="text-sm font-medium text-[#0B1220] mb-2">Échéancier prévisionnel</p>
                          <div className="space-y-1 text-sm">
                            {getPaymentSchedule().map((amount, i) => (
                              <div key={i} className="flex justify-between">
                                <span className="text-[#0B1F3B]/60">Échéance {i + 1}</span>
                                <span className="font-medium">{formatCurrency(amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 p-3 bg-[#1DBF73]/5 rounded-lg border border-[#1DBF73]/20">
                        <Shield className="w-4 h-4 text-[#1DBF73] flex-shrink-0" />
                        <p className="text-xs text-[#0B1220]">
                          Paiement sécurisé — chiffrement SSL — aucune donnée bancaire stockée par Attard Multimédia. Le règlement définitif sera effectué après validation de votre devis par notre équipe.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button type="submit" size="lg" className={`w-full text-white ${wantCallback ? "bg-[#1E6FFF] hover:bg-[#1E6FFF]/90" : "bg-[#1DBF73] hover:bg-[#1DBF73]/90"}`} disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Envoi...</span>
                    ) : wantCallback ? (
                      <><Phone className="mr-2 w-5 h-5" />Demander à être rappelé</>
                    ) : (
                      <><CreditCard className="mr-2 w-5 h-5" />Valider ma commande</>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Colonne droite — devis */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-[#0B1F3B]/10 bg-white sticky top-24">
                <h3 className="text-lg font-semibold text-[#0B1220] mb-4">Devis estimatif</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Montant HT</span>
                    <span className="font-medium">{formatCurrency(totalBudget / 1.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">TVA (20%)</span>
                    <span className="font-medium">{formatCurrency(totalBudget - totalBudget / 1.2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#0B1F3B]/10">
                    <span className="font-semibold text-[#0B1220]">Total TTC</span>
                    <span className="font-bold text-xl text-[#1E6FFF]">{formatCurrency(totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Par mois</span>
                    <span className="font-medium">{formatCurrency(sim.monthlyBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Par jour</span>
                    <span className="font-medium">{formatCurrency(sim.costPerDay)}</span>
                  </div>
                </div>
                {sim.roi > 0 && (
                  <div className="p-3 bg-[#1DBF73]/10 rounded-lg border border-[#1DBF73]/20 mb-4">
                    <p className="text-sm font-semibold text-[#0B1220]">ROI estimé : +{sim.roi.toFixed(1)}%</p>
                    <Badge className="bg-[#1DBF73] text-white mt-1">Rentable</Badge>
                  </div>
                )}
                <div className="p-3 bg-[#F5F7FA] rounded-lg">
                  <p className="text-xs text-[#0B1F3B]/60">
                    Comprend : {sim.recommendedScreens} écran{sim.recommendedScreens > 1 ? "s" : ""}, création du spot, accompagnement expert
                  </p>
                </div>
                <p className="text-xs text-[#0B1F3B]/40 mt-3">* Ce devis est indicatif. La facture définitive sera établie par notre équipe après validation.</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
