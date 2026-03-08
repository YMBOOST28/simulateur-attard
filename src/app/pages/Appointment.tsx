import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft, CheckCircle2, Calendar as CalendarIcon,
  Phone, Video, User, Building2, Mail, MessageSquare,
  Star, Clock, Shield, ChevronRight
} from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { formatCurrency, formatNumber } from "../utils/calculations";
import { loadSimulation } from "../utils/simulationStore";
import { sendLeadToMake } from "../utils/sendLead";

// ─── À remplacer par votre vrai lien Calendly ───────────────────────────────
// Exemple : https://calendly.com/attard-multimedia/consultation-dooh
const CALENDLY_URL = "https://calendly.com/VOTRE_LIEN_CALENDLY";
// ────────────────────────────────────────────────────────────────────────────

type Step = "info" | "calendly" | "confirmed";
type MeetingType = "visio" | "phone";

export default function Appointment() {
  const stored = loadSimulation();
  const sim = stored?.results;
  const data = stored?.data;

  const durationLabel = data
    ? ({ 6: "6 mois", 12: "1 an", 24: "2 ans", 36: "3 ans" } as Record<number, string>)[data.campaignDuration]
    : "1 an";
  const totalBudget = sim && data ? sim.annualBudget * (data.campaignDuration / 12) : 0;

  const [step, setStep] = useState<Step>("info");
  const [meetingType, setMeetingType] = useState<MeetingType>("visio");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", message: "", consent: false,
  });

  const calendlyWithParams = stored
    ? `${CALENDLY_URL}?name=${encodeURIComponent(form.firstName + " " + form.lastName)}&email=${encodeURIComponent(form.email)}&a1=${encodeURIComponent(stored.hospitalName)}&a2=${encodeURIComponent(meetingType === "visio" ? "Visio" : "Téléphone")}`
    : CALENDLY_URL;

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await sendLeadToMake({
      source: "rendez-vous",
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      message: form.message,
      appointmentType: meetingType,
      hospitalName: stored?.hospitalName,
      professionName: stored?.professionName,
      odv: stored?.data.odv,
      recommendedScreens: sim?.recommendedScreens,
      annualBudget: sim?.annualBudget,
      roi: sim?.roi,
      campaignDuration: durationLabel,
    });
    setIsLoading(false);
    setStep("calendly");
  };

  // ── Étape 3 : Confirmé ──────────────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-[#1DBF73]/20 animate-ping" />
              <div className="relative p-5 rounded-full bg-[#1DBF73]/10 w-24 h-24 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-[#1DBF73]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#0B1220] mb-3">Rendez-vous confirmé !</h1>
            <p className="text-[#0B1F3B]/60 mb-8">
              Vous recevrez une invitation par email avec le lien {meetingType === "visio" ? "visioconférence" : "de rappel"}.
              Notre expert préparera votre rapport personnalisé avant l'échange.
            </p>
            <Card className="p-6 mb-8 bg-white border-[#0B1F3B]/10 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-[#0B1F3B]/8">
                  <div className="p-2 rounded-lg bg-[#1E6FFF]/10">
                    {meetingType === "visio" ? <Video className="w-4 h-4 text-[#1E6FFF]" /> : <Phone className="w-4 h-4 text-[#1E6FFF]" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1220]">{meetingType === "visio" ? "Visioconférence 30 min" : "Appel téléphonique 30 min"}</p>
                    <p className="text-xs text-[#0B1F3B]/50">Consultation gratuite avec un expert Attard Multimédia</p>
                  </div>
                </div>
                {stored && (
                  <>
                    <div className="flex justify-between text-sm"><span className="text-[#0B1F3B]/60">Hôpital analysé</span><span className="font-medium">{stored.hospitalName}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#0B1F3B]/60">Profession</span><span className="font-medium">{stored.professionName}</span></div>
                    {sim && <div className="flex justify-between text-sm"><span className="text-[#0B1F3B]/60">ROI estimé</span><Badge className="bg-[#1DBF73] text-white">+{sim.roi.toFixed(1)}%</Badge></div>}
                  </>
                )}
              </div>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/brochure"><Button size="lg" variant="outline" className="border-[#1E6FFF] text-[#1E6FFF]">Télécharger mon rapport PDF</Button></Link>
              <Link to="/"><Button size="lg" className="bg-[#1E6FFF] text-white">Retour à l'accueil</Button></Link>
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
              <ArrowLeft className="w-4 h-4 mr-1" />Retour au simulateur
            </Link>
          </div>

          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-3">
              Parler à un expert Attard Multimédia
            </h1>
            <p className="text-lg text-[#0B1F3B]/60 max-w-2xl">
              Obtenez des recommandations sur mesure, une analyse approfondie de vos projections et un plan d'action personnalisé — gratuitement et sans engagement.
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-3 mb-8">
            {[
              { id: "info", label: "Vos informations" },
              { id: "calendly", label: "Choisir un créneau" },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.id
                    ? "bg-[#1E6FFF] text-white shadow-sm"
                    : step === "confirmed" || (s.id === "info" && step === "calendly")
                      ? "bg-[#1DBF73]/10 text-[#1DBF73]"
                      : "bg-white text-[#0B1F3B]/40 border border-[#0B1F3B]/10"
                }`}>
                  <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                    step === s.id ? "bg-white/20" : "bg-current/10"
                  }`}>{i + 1}</span>
                  {s.label}
                </div>
                {i < 1 && <ChevronRight className="w-4 h-4 text-[#0B1F3B]/20" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Colonne principale ── */}
            <div className="lg:col-span-2">

              {/* ÉTAPE 1 : Infos */}
              {step === "info" && (
                <form onSubmit={handleSubmitInfo}>
                  <Card className="p-8 border-[#0B1F3B]/10 bg-white mb-6">
                    <h3 className="text-xl font-semibold text-[#0B1220] mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#1E6FFF]" />
                      Vos coordonnées
                    </h3>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" required value={form.firstName}
                          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                          className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" required value={form.lastName}
                          onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                          className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email professionnel *</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1F3B]/30" />
                          <Input id="email" type="email" required value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="bg-[#F5F7FA] border-[#0B1F3B]/10 pl-9" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1F3B]/30" />
                          <Input id="phone" type="tel" required value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            className="bg-[#F5F7FA] border-[#0B1F3B]/10 pl-9" />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="company">Structure / Cabinet / Entreprise *</Label>
                        <div className="relative mt-1">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1F3B]/30" />
                          <Input id="company" required value={form.company}
                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            className="bg-[#F5F7FA] border-[#0B1F3B]/10 pl-9" />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mt-5">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#1E6FFF]" />
                        Questions ou objectifs particuliers <span className="text-[#0B1F3B]/40 font-normal">(facultatif)</span>
                      </Label>
                      <Textarea id="message" rows={3}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Ex : Je veux comprendre comment optimiser mon budget, j'ai une ouverture en mars..."
                        className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-1" />
                    </div>
                  </Card>

                  {/* Type de RDV */}
                  <Card className="p-8 border-[#0B1F3B]/10 bg-white mb-6">
                    <h3 className="text-xl font-semibold text-[#0B1220] mb-5 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-[#1E6FFF]" />
                      Format du rendez-vous
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {([
                        {
                          id: "visio" as MeetingType,
                          icon: Video,
                          title: "Visioconférence",
                          desc: "Face à face en vidéo, partage d'écran possible. Idéal pour un accompagnement complet.",
                          badge: "Recommandé",
                        },
                        {
                          id: "phone" as MeetingType,
                          icon: Phone,
                          title: "Téléphone",
                          desc: "Simple et rapide. Parfait si vous êtes souvent en déplacement.",
                          badge: null,
                        },
                      ]).map(({ id, icon: Icon, title, desc, badge }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setMeetingType(id)}
                          className={`relative text-left p-5 rounded-xl border-2 transition-all ${
                            meetingType === id
                              ? "border-[#1E6FFF] bg-[#1E6FFF]/5 shadow-sm"
                              : "border-[#0B1F3B]/10 hover:border-[#1E6FFF]/40 bg-white"
                          }`}
                        >
                          {badge && (
                            <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-[#1DBF73] text-white font-medium">
                              {badge}
                            </span>
                          )}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                            meetingType === id ? "bg-[#1E6FFF]/10" : "bg-[#F5F7FA]"
                          }`}>
                            <Icon className={`w-5 h-5 ${meetingType === id ? "text-[#1E6FFF]" : "text-[#0B1F3B]/40"}`} />
                          </div>
                          <p className="font-semibold text-[#0B1220] mb-1">{title}</p>
                          <p className="text-xs text-[#0B1F3B]/55 leading-relaxed">{desc}</p>
                          {meetingType === id && (
                            <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#1E6FFF]" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 p-3 bg-[#1E6FFF]/5 rounded-lg border border-[#1E6FFF]/15">
                      <Clock className="w-4 h-4 text-[#1E6FFF] flex-shrink-0" />
                      <p className="text-xs text-[#0B1F3B]/70">
                        Durée estimée : <strong>30 minutes</strong> — Gratuit, sans engagement, annulable à tout moment depuis Calendly.
                      </p>
                    </div>
                  </Card>

                  {/* Consentement + CTA */}
                  <div className="flex items-start space-x-3 mb-6 p-4 bg-white rounded-xl border border-[#0B1F3B]/10">
                    <Checkbox id="consent" checked={form.consent}
                      onCheckedChange={c => setForm(f => ({ ...f, consent: !!c }))} required />
                    <Label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed text-[#0B1F3B]/60">
                      J'accepte qu'Attard Multimédia me recontacte pour cet échange et utilise mes informations dans le cadre de cette consultation. Pas de démarchage abusif.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#1E6FFF] hover:bg-[#1E6FFF]/90 text-white h-14 text-base"
                    disabled={isLoading || !form.consent || !form.firstName || !form.email || !form.phone || !form.company}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Chargement...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Continuer vers le choix du créneau
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* ÉTAPE 2 : Calendly */}
              {step === "calendly" && (
                <Card className="p-0 overflow-hidden border-[#0B1F3B]/10 bg-white">
                  <div className="p-6 border-b border-[#0B1F3B]/8 bg-gradient-to-r from-[#1E6FFF]/5 to-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#1E6FFF]/10">
                        {meetingType === "visio"
                          ? <Video className="w-5 h-5 text-[#1E6FFF]" />
                          : <Phone className="w-5 h-5 text-[#1E6FFF]" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0B1220]">
                          Choisissez votre créneau — {meetingType === "visio" ? "Visioconférence" : "Téléphone"}
                        </h3>
                        <p className="text-sm text-[#0B1F3B]/50">Calendrier en temps réel connecté à l'agenda Attard Multimédia</p>
                      </div>
                    </div>
                  </div>

                  {/* Iframe Calendly */}
                  {CALENDLY_URL.includes("VOTRE_LIEN") ? (
                    <div className="flex flex-col items-center justify-center py-16 px-8 bg-[#F5F7FA] text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#1E6FFF]/10 flex items-center justify-center mb-4">
                        <CalendarIcon className="w-8 h-8 text-[#1E6FFF]" />
                      </div>
                      <h4 className="text-lg font-semibold text-[#0B1220] mb-2">Calendly à connecter</h4>
                      <p className="text-sm text-[#0B1F3B]/55 mb-4 max-w-sm">
                        Pour activer la prise de RDV, remplacez <code className="bg-white px-1.5 py-0.5 rounded text-[#1E6FFF] font-mono text-xs">VOTRE_LIEN_CALENDLY</code> dans le fichier <code className="bg-white px-1.5 py-0.5 rounded text-[#1E6FFF] font-mono text-xs">Appointment.tsx</code> par votre URL Calendly.
                      </p>
                      <div className="p-4 bg-white rounded-xl border border-[#0B1F3B]/10 text-left text-sm text-[#0B1F3B]/70 mb-6 max-w-sm w-full">
                        <p className="font-medium text-[#0B1220] mb-2">Créer votre lien Calendly :</p>
                        <ol className="space-y-1 list-decimal list-inside text-xs">
                          <li>Allez sur <strong>calendly.com</strong> → créer un compte</li>
                          <li>Nouveau type d'événement → "Consultation DOOH" 30 min</li>
                          <li>Copiez l'URL de l'événement</li>
                          <li>Collez-la dans <code className="text-[#1E6FFF]">CALENDLY_URL</code></li>
                        </ol>
                      </div>
                      <Button
                        size="lg"
                        className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white"
                        onClick={() => setStep("confirmed")}
                      >
                        <CheckCircle2 className="mr-2 w-5 h-5" />
                        Simuler la confirmation (démo)
                      </Button>
                    </div>
                  ) : (
                    <>
                      <iframe
                        src={calendlyWithParams}
                        width="100%"
                        height="700"
                        frameBorder="0"
                        title="Prendre rendez-vous"
                        onLoad={() => {
                          // Calendly envoie un postMessage quand le RDV est confirmé
                          window.addEventListener("message", (e) => {
                            if (e.data.event === "calendly.event_scheduled") {
                              setStep("confirmed");
                            }
                          }, { once: true });
                        }}
                      />
                      <div className="p-4 border-t border-[#0B1F3B]/8 text-center">
                        <button
                          onClick={() => setStep("info")}
                          className="text-sm text-[#0B1F3B]/40 hover:text-[#1E6FFF] underline"
                        >
                          ← Modifier mes informations
                        </button>
                      </div>
                    </>
                  )}
                </Card>
              )}
            </div>

            {/* ── Colonne droite : récap simulation + réassurance ── */}
            <div className="space-y-6">

              {/* Récap simulation */}
              {stored && sim ? (
                <Card className="p-5 border-[#0B1F3B]/10 bg-white sticky top-24">
                  <h4 className="font-semibold text-[#0B1220] mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#1E6FFF]" />
                    Votre simulation
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: "Hôpital", value: stored.hospitalName },
                      { label: "Profession", value: stored.professionName },
                      { label: "Durée campagne", value: durationLabel },
                      { label: "Écrans conseillés", value: `${sim.recommendedScreens} écran${sim.recommendedScreens > 1 ? "s" : ""}` },
                      { label: "ODV annuel", value: formatNumber(sim.annualPassages) },
                      { label: "Leads estimés/an", value: formatNumber(sim.estimatedLeads) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-[#0B1F3B]/50">{label}</span>
                        <span className="font-medium text-[#0B1220] text-right max-w-[55%]">{value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#0B1F3B]/8 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#0B1F3B]/50">Budget total</span>
                        <span className="font-bold text-[#1E6FFF]">{formatCurrency(totalBudget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#0B1F3B]/50">ROI estimé</span>
                        <Badge className="bg-[#1DBF73] text-white">+{sim.roi.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-[#1E6FFF]/5 rounded-lg">
                    <p className="text-xs text-[#0B1F3B]/55">
                      L'expert analysera ces données et vous proposera des optimisations personnalisées lors du rendez-vous.
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="p-5 border-[#0B1F3B]/10 bg-white">
                  <p className="text-sm text-[#0B1F3B]/50 text-center">
                    Complétez d'abord une simulation pour voir votre récapitulatif ici.
                  </p>
                  <Link to="/"><Button size="sm" className="w-full mt-3 bg-[#1E6FFF] text-white">Faire ma simulation</Button></Link>
                </Card>
              )}

              {/* Réassurance */}
              <Card className="p-5 border-[#0B1F3B]/10 bg-white">
                <h4 className="font-semibold text-[#0B1220] mb-4">Ce que vous obtiendrez</h4>
                <div className="space-y-3">
                  {[
                    { icon: Star, text: "Analyse approfondie de votre simulation", color: "text-[#1E6FFF]" },
                    { icon: Shield, text: "Recommandations personnalisées (écrans, planning, budget)", color: "text-[#1DBF73]" },
                    { icon: CheckCircle2, text: "Rapport PDF remis après l'échange", color: "text-[#1DBF73]" },
                    { icon: Clock, text: "30 min sans engagement, annulable à tout moment", color: "text-[#0B1F3B]/40" },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-start gap-2.5 text-sm text-[#0B1F3B]/65">
                      <Icon className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
                      {text}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
