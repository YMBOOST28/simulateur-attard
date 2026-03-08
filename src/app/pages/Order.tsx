import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CreditCard, CheckCircle2, Shield } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { formatCurrency, formatNumber } from "../utils/calculations";

export default function Order() {
  const [paymentMode, setPaymentMode] = useState<"1x" | "3x" | "6x">("1x");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock data - would come from simulation context/state in real app
  const simulationData = {
    hospital: "CHU de Bordeaux",
    profession: "Opticien",
    spotDuration: "20s",
    campaignDuration: "1 an",
    odv: 150000,
    recommendedScreens: 3,
    annualPassages: 125000,
    estimatedLeads: 300,
    potentialRevenue: 114000,
    roi: 220,
    annualBudget: 10500,
    monthlyBudget: 875,
    costPerDay: 29,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const getPaymentSchedule = () => {
    const total = simulationData.annualBudget;
    switch (paymentMode) {
      case "3x":
        return Array(3).fill(Math.round(total / 3));
      case "6x":
        return Array(6).fill(Math.round(total / 6));
      default:
        return [total];
    }
  };

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
              Merci, votre commande est confirmée !
            </h1>
            <Card className="p-6 mb-8 bg-white border-[#0B1F3B]/10 text-left">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[#0B1F3B]/10">
                  <span className="text-sm text-[#0B1F3B]/60">Numéro de commande</span>
                  <span className="font-semibold text-[#0B1220]">AM-2026-{Math.random().toString().slice(2, 8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0B1F3B]/60">Montant payé</span>
                  <span className="font-semibold text-[#1DBF73]">{formatCurrency(simulationData.annualBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0B1F3B]/60">Écrans</span>
                  <span className="font-semibold text-[#0B1220]">{simulationData.recommendedScreens}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0B1F3B]/60">Durée</span>
                  <span className="font-semibold text-[#0B1220]">{simulationData.campaignDuration}</span>
                </div>
              </div>
            </Card>
            <p className="text-lg text-[#0B1F3B]/60 mb-8">
              Un expert Attard Multimédia va vous contacter sous 24h pour lancer la création de votre spot (brief créatif, validation, planning de diffusion).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="bg-[#1E6FFF] hover:bg-[#1E6FFF]/90 w-full sm:w-auto">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
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
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-[#1E6FFF] hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour au simulateur
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-3">
            Finaliser ma campagne
          </h1>
          <p className="text-lg text-[#0B1F3B]/60 mb-8">
            Validez votre commande et démarrez votre campagne de diffusion en milieu hospitalier
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Summary */}
              <Card className="p-6 border-[#0B1F3B]/10 bg-white">
                <h3 className="text-xl font-semibold text-[#0B1220] mb-4">
                  Récapitulatif de votre campagne
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Hôpital</span>
                    <span className="font-medium text-[#0B1220]">{simulationData.hospital}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Profession</span>
                    <span className="font-medium text-[#0B1220]">{simulationData.profession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Durée du spot</span>
                    <span className="font-medium text-[#0B1220]">{simulationData.spotDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Durée de campagne</span>
                    <span className="font-medium text-[#0B1220]">{simulationData.campaignDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Écrans recommandés</span>
                    <span className="font-medium text-[#0B1220]">{simulationData.recommendedScreens}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#0B1F3B]/10">
                    <span className="text-[#0B1F3B]/60">CA potentiel estimé</span>
                    <span className="font-semibold text-[#1DBF73]">{formatCurrency(simulationData.potentialRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">ROI estimé</span>
                    <Badge className="bg-[#1DBF73] text-white">+{simulationData.roi}%</Badge>
                  </div>
                </div>
                <p className="text-xs text-[#0B1F3B]/50 mt-4">
                  Ces chiffres sont basés sur nos données DOOH santé et restent des projections théoriques.
                </p>
              </Card>

              {/* Company Information */}
              <Card className="p-6 border-[#0B1F3B]/10 bg-white">
                <h3 className="text-xl font-semibold text-[#0B1220] mb-4">
                  Informations entreprise
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Raison sociale *</Label>
                      <Input id="companyName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                    <div>
                      <Label htmlFor="legalForm">Forme juridique *</Label>
                      <Select required>
                        <SelectTrigger className="bg-[#F5F7FA] border-[#0B1F3B]/10">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sarl">SARL</SelectItem>
                          <SelectItem value="sas">SAS</SelectItem>
                          <SelectItem value="eurl">EURL</SelectItem>
                          <SelectItem value="ei">EI</SelectItem>
                          <SelectItem value="auto">Auto-entrepreneur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="siret">SIRET *</Label>
                      <Input id="siret" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                    <div>
                      <Label htmlFor="vat">TVA intracommunautaire</Label>
                      <Input id="vat" className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse complète *</Label>
                    <Input id="address" required className="bg-[#F5F7FA] border-[#0B1F3B]/10 mb-3" />
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input placeholder="Code postal *" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                      <Input placeholder="Ville *" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                      <Input placeholder="Pays *" defaultValue="France" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signatoryName">Nom du signataire *</Label>
                      <Input id="signatoryName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                    <div>
                      <Label htmlFor="function">Fonction *</Label>
                      <Input id="function" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                    <div>
                      <Label htmlFor="billingEmail">Email de facturation *</Label>
                      <Input id="billingEmail" type="email" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                    <div>
                      <Label htmlFor="billingPhone">Téléphone de facturation *</Label>
                      <Input id="billingPhone" type="tel" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="certify" required />
                    <Label htmlFor="certify" className="text-sm cursor-pointer leading-relaxed">
                      Je certifie l'exactitude de ces informations pour l'établissement du devis et de la facture.
                    </Label>
                  </div>
                </form>
              </Card>

              {/* Payment Method */}
              <Card className="p-6 border-[#0B1F3B]/10 bg-white">
                <h3 className="text-xl font-semibold text-[#0B1220] mb-4">
                  Mode de paiement
                </h3>
                
                <RadioGroup value={paymentMode} onValueChange={(value) => setPaymentMode(value as "1x" | "3x" | "6x")}>
                  <div className="space-y-3 mb-6">
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMode === "1x" ? "border-[#1E6FFF] bg-[#1E6FFF]/5" : "border-[#0B1F3B]/10"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="1x" id="pay1x" />
                        <Label htmlFor="pay1x" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Paiement en 1 fois</span>
                            <span className="font-bold text-[#0B1220]">{formatCurrency(simulationData.annualBudget)}</span>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMode === "3x" ? "border-[#1E6FFF] bg-[#1E6FFF]/5" : "border-[#0B1F3B]/10"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="3x" id="pay3x" />
                        <Label htmlFor="pay3x" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Paiement en 3 fois</span>
                            <span className="font-bold text-[#0B1220]">
                              3 × {formatCurrency(Math.round(simulationData.annualBudget / 3))}
                            </span>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMode === "6x" ? "border-[#1E6FFF] bg-[#1E6FFF]/5" : "border-[#0B1F3B]/10"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="6x" id="pay6x" />
                        <Label htmlFor="pay6x" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Paiement en 6 fois</span>
                            <span className="font-bold text-[#0B1220]">
                              6 × {formatCurrency(Math.round(simulationData.annualBudget / 6))}
                            </span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMode !== "1x" && (
                  <div className="p-4 bg-[#F5F7FA] rounded-lg mb-6">
                    <p className="text-sm font-medium text-[#0B1220] mb-2">Échéancier</p>
                    <div className="space-y-1 text-sm">
                      {getPaymentSchedule().map((amount, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-[#0B1F3B]/60">Échéance {index + 1}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Payment */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#0B1220] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1E6FFF]" />
                    Paiement sécurisé par carte
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        className="bg-[#F5F7FA] border-[#0B1F3B]/10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName">Nom sur la carte *</Label>
                      <Input
                        id="cardName"
                        required
                        className="bg-[#F5F7FA] border-[#0B1F3B]/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Date d'expiration *</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          required
                          className="bg-[#F5F7FA] border-[#0B1F3B]/10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          required
                          maxLength={3}
                          className="bg-[#F5F7FA] border-[#0B1F3B]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-[#1DBF73]/5 rounded-lg border border-[#1DBF73]/20">
                    <Shield className="w-4 h-4 text-[#1DBF73]" />
                    <p className="text-xs text-[#0B1220]">
                      Paiement sécurisé – chiffrement SSL – aucune donnée bancaire stockée par Attard Multimédia
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white flex-1"
                  >
                    <CreditCard className="mr-2 w-5 h-5" />
                    Valider et payer ma campagne
                  </Button>
                  <Link to="/rendez-vous" className="flex-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#1E6FFF] text-[#1E6FFF] hover:bg-[#1E6FFF]/10 w-full"
                    >
                      Parler d'abord à un expert
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Right Column - Quote Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-[#0B1F3B]/10 bg-white sticky top-24">
                <h3 className="text-lg font-semibold text-[#0B1220] mb-4">
                  Devis en direct
                </h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Montant annuel HT</span>
                    <span className="font-medium">{formatCurrency(simulationData.annualBudget / 1.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">TVA (20%)</span>
                    <span className="font-medium">{formatCurrency(simulationData.annualBudget - simulationData.annualBudget / 1.2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#0B1F3B]/10">
                    <span className="font-semibold text-[#0B1220]">Total TTC annuel</span>
                    <span className="font-bold text-xl text-[#1E6FFF]">{formatCurrency(simulationData.annualBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Coût mensuel moyen</span>
                    <span className="font-medium">{formatCurrency(simulationData.monthlyBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B1F3B]/60">Coût journalier</span>
                    <span className="font-medium">{formatCurrency(simulationData.costPerDay)}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#1DBF73]/10 rounded-lg border border-[#1DBF73]/20 mb-4">
                  <p className="text-sm font-semibold text-[#0B1220] mb-1">
                    ROI estimé : +{simulationData.roi}%
                  </p>
                  <Badge className="bg-[#1DBF73] text-white">Rentable</Badge>
                </div>

                <div className="p-3 bg-[#F5F7FA] rounded-lg">
                  <p className="text-xs text-[#0B1F3B]/60">
                    Comprend : {simulationData.recommendedScreens} écran{simulationData.recommendedScreens > 1 ? "s" : ""}, création du spot, accompagnement expert
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
