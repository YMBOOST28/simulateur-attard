import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Calendar as CalendarIcon, Phone, Video } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Appointment() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [contactMode, setContactMode] = useState<"visio" | "phone">("visio");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
              Votre rendez-vous est confirmé !
            </h1>
            <p className="text-lg text-[#0B1F3B]/60 mb-6">
              Vous recevrez un email de confirmation avec le récapitulatif de votre simulation.
            </p>
            <Card className="p-6 mb-8 bg-white border-[#0B1F3B]/10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0B1F3B]/60">Date</span>
                  <span className="font-semibold text-[#0B1220]">
                    {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0B1F3B]/60">Heure</span>
                  <span className="font-semibold text-[#0B1220]">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#0B1F3B]/60">Mode</span>
                  <span className="font-semibold text-[#0B1220]">
                    {contactMode === "visio" ? "Visioconférence" : "Téléphone"}
                  </span>
                </div>
              </div>
            </Card>
            <p className="text-sm text-[#0B1F3B]/60 mb-8">
              Votre rapport PDF sera préparé pour le rendez-vous. Un expert Attard Multimédia va vous recontacter avec votre rapport PDF personnalisé.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-[#1E6FFF] hover:bg-[#1E6FFF]/90">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-[#1E6FFF] hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour au simulateur
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-3">
            Prendre rendez-vous avec un expert Attard Multimédia
          </h1>
          <p className="text-lg text-[#0B1F3B]/60 mb-8">
            Ce rendez-vous vous permet de comprendre vos chiffres, votre ROI et d'obtenir un plan d'action personnalisé.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Calendar Selection */}
            <Card className="p-8 border-[#0B1F3B]/10 bg-white">
              <h3 className="text-xl font-semibold text-[#0B1220] mb-6">
                Choisir un créneau avec un expert
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-3 block">Sélectionnez une date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border border-[#0B1F3B]/10"
                    locale={fr}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Horaire disponible</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`
                            p-3 rounded-lg border-2 text-sm font-medium transition-all
                            ${selectedTime === time
                              ? "bg-[#1E6FFF] border-[#1E6FFF] text-white"
                              : "bg-white border-[#0B1F3B]/10 text-[#0B1220] hover:border-[#1E6FFF]/50"
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Mode d'échange</Label>
                    <RadioGroup value={contactMode} onValueChange={(value) => setContactMode(value as "visio" | "phone")}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#0B1F3B]/10 bg-white mb-2">
                        <RadioGroupItem value="visio" id="visio" />
                        <Label htmlFor="visio" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Video className="w-4 h-4 text-[#1E6FFF]" />
                          Échange en visio
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-[#0B1F3B]/10 bg-white">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#1E6FFF]" />
                          Échange par téléphone
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information Form */}
            <Card className="p-8 border-[#0B1F3B]/10 bg-white">
              <h3 className="text-xl font-semibold text-[#0B1220] mb-6">
                Vos informations
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="civility">Civilité</Label>
                  <Select required>
                    <SelectTrigger className="bg-[#F5F7FA] border-[#0B1F3B]/10">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">M.</SelectItem>
                      <SelectItem value="mme">Mme</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input id="firstName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input id="lastName" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="company">Nom de l'entreprise / cabinet *</Label>
                  <Input id="company" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="siret">SIRET (facultatif)</Label>
                  <Input id="siret" className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input id="email" type="email" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="phone">Numéro de téléphone *</Label>
                  <Input id="phone" type="tel" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="website">Site web (facultatif)</Label>
                  <Input id="website" type="url" className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>

                <div>
                  <Label htmlFor="profession">Profession *</Label>
                  <Select required>
                    <SelectTrigger className="bg-[#F5F7FA] border-[#0B1F3B]/10">
                      <SelectValue placeholder="Sélectionner votre profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opticien">Opticien</SelectItem>
                      <SelectItem value="audioprothesiste">Audioprothésiste</SelectItem>
                      <SelectItem value="kine">Kinésithérapeute / Rééducation</SelectItem>
                      <SelectItem value="dentaire">Dentaire</SelectItem>
                      <SelectItem value="materiel-medical">Matériel médical</SelectItem>
                      <SelectItem value="bien-etre">Bien-être & Prévention</SelectItem>
                      <SelectItem value="services-sante">Services santé / Mutuelles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">Ville ou zone d'implantation principale *</Label>
                  <Input id="city" required className="bg-[#F5F7FA] border-[#0B1F3B]/10" />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="objective">Quel est votre principal objectif avec cette campagne ?</Label>
                <Textarea
                  id="objective"
                  rows={4}
                  className="bg-[#F5F7FA] border-[#0B1F3B]/10 mt-2"
                  placeholder="Décrivez brièvement vos objectifs..."
                />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="pdf" required />
                  <Label htmlFor="pdf" className="text-sm cursor-pointer leading-relaxed">
                    Je souhaite recevoir mon rapport PDF personnalisé après l'échange avec l'expert.
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="contact" required />
                  <Label htmlFor="contact" className="text-sm cursor-pointer leading-relaxed">
                    J'accepte d'être recontacté par Attard Multimédia dans le cadre de cette demande.
                  </Label>
                </div>
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="submit"
                size="lg"
                className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white"
                disabled={!date || !selectedTime}
              >
                <CalendarIcon className="mr-2 w-5 h-5" />
                Confirmer mon rendez-vous
              </Button>

              <Link to="/">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="border-[#1E6FFF] text-[#1E6FFF] hover:bg-[#1E6FFF]/10 w-full"
                >
                  Revenir au simulateur
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
