import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowDown, Building2, Stethoscope, Download, Calendar, ShoppingCart } from "lucide-react";
import HospitalSelector from "../components/HospitalSelector";
import ProfessionSelector from "../components/ProfessionSelector";
import ODVSlider from "../components/ODVSlider";
import SpotDurationSelector from "../components/SpotDurationSelector";
import CampaignDurationSelector from "../components/CampaignDurationSelector";
import SimulationResults from "../components/SimulationResults";
import BudgetRecommendation from "../components/BudgetRecommendation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { calculateSimulationResults, calculateMinODV, calculateMaxODV } from "../utils/calculations";
import { hospitals } from "../data/hospitals";
import { professions } from "../data/professions";
import { saveSimulation } from "../utils/simulationStore";
import type { SimulationData } from "../types/simulation";

export default function Home() {
  // Pré-sélection de ville depuis URL (?ville=marseille)
  const urlParams = new URLSearchParams(window.location.search);
  const villeParam = urlParams.get("ville");

  const [simulationData, setSimulationData] = useState<SimulationData>({
    hospital: villeParam || null,
    profession: null,
    odv: 150000,
    spotDuration: 20,
    campaignDuration: 12,
  });

  // ODV dynamique selon l'hôpital et la durée du spot
  const selectedHospital = hospitals.find((h) => h.id === simulationData.hospital);
  const minODV = selectedHospital
    ? calculateMinODV(selectedHospital.passagesPerDay, simulationData.spotDuration)
    : 10000;
  const maxODV = selectedHospital
    ? calculateMaxODV(selectedHospital.passagesPerDay, 10, simulationData.spotDuration)
    : 1000000;

  // Recaler l'ODV dans les nouvelles bornes quand l'hôpital ou la durée du spot change
  useEffect(() => {
    setSimulationData((prev) => ({
      ...prev,
      odv: Math.max(minODV, Math.min(prev.odv, maxODV)),
    }));
  }, [simulationData.hospital, simulationData.spotDuration, minODV, maxODV]);

  const results = calculateSimulationResults(simulationData);
  const canShowResults = simulationData.hospital && simulationData.profession;

  const scrollToSimulator = () => {
    document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
  };

  const updateSimulation = (updates: Partial<SimulationData>) => {
    setSimulationData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B1F3B] via-[#0B1F3B] to-[#1E6FFF] text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-[#1DBF73] text-white">
              Simulateur de campagne DOOH santé
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Estimez le potentiel de visibilité de votre cabinet en milieu hospitalier
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Découvrez en quelques secondes vos performances théoriques, votre ROI et le plan de diffusion idéal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={scrollToSimulator}
                className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white text-lg px-8 py-6"
              >
                Lancer ma simulation
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
              
              <Link to="/rendez-vous">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 w-full"
                >
                  Parler à un expert
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </section>

      {/* Context & Proof Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-4xl font-bold text-[#1E6FFF] mb-2">30</div>
                <p className="text-[#0B1220] font-medium">Hôpitaux équipés</p>
                <p className="text-sm text-[#0B1F3B]/60 mt-1">Partout en France</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl font-bold text-[#1E6FFF] mb-2">24/7</div>
                <p className="text-[#0B1220] font-medium">Diffusion continue</p>
                <p className="text-sm text-[#0B1F3B]/60 mt-1">En salle d'attente</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-4xl font-bold text-[#1DBF73] mb-2">100%</div>
                <p className="text-[#0B1220] font-medium">Secteur santé</p>
                <p className="text-sm text-[#0B1F3B]/60 mt-1">Audience qualifiée</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Simulator Section */}
      <section id="simulator" className="py-16 bg-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-4">
                Simulateur de campagne Attard Multimédia
              </h2>
              <p className="text-lg text-[#0B1F3B]/60 max-w-2xl mx-auto">
                Personnalisez votre campagne en 3 étapes et découvrez vos résultats en temps réel
              </p>
            </motion.div>

            {/* Step 1: Hospital & Profession Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 mb-8 border-[#0B1F3B]/10 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-[#1E6FFF]/10 text-[#1E6FFF]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0B1220]">
                      Étape 1 : Choisissez votre hôpital
                    </h3>
                    <p className="text-sm text-[#0B1F3B]/60">
                      Sélectionnez l'établissement où vous souhaitez être visible
                    </p>
                  </div>
                </div>

                <HospitalSelector
                  selectedHospital={simulationData.hospital}
                  onSelect={(hospitalId) => updateSimulation({ hospital: hospitalId })}
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 mb-8 border-[#0B1F3B]/10 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-[#1E6FFF]/10 text-[#1E6FFF]">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0B1220]">
                      Votre profession
                    </h3>
                    <p className="text-sm text-[#0B1F3B]/60">
                      Sélectionnez votre secteur d'activité pour des estimations personnalisées
                    </p>
                  </div>
                </div>

                <ProfessionSelector
                  selectedProfession={simulationData.profession}
                  onSelect={(professionId) => updateSimulation({ profession: professionId })}
                />
              </Card>
            </motion.div>

            {/* Step 2: ODV & Spot Configuration */}
            {canShowResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-8 mb-8 border-[#0B1F3B]/10 bg-white">
                  <h3 className="text-xl font-semibold text-[#0B1220] mb-6">
                    Étape 2 : Configurez votre campagne
                  </h3>

                  <div className="space-y-8">
                    <ODVSlider
                      value={simulationData.odv}
                      onChange={(odv) => updateSimulation({ odv })}
                      minODV={minODV}
                      maxODV={maxODV}
                    />

                    <SpotDurationSelector
                      value={simulationData.spotDuration}
                      onChange={(spotDuration) => updateSimulation({ spotDuration })}
                    />

                    <CampaignDurationSelector
                      value={simulationData.campaignDuration}
                      onChange={(campaignDuration) => updateSimulation({ campaignDuration })}
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {canShowResults && results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-8 mb-8 border-[#0B1F3B]/10 bg-white">
                  <h3 className="text-xl font-semibold text-[#0B1220] mb-6">
                    Étape 3 : Vos résultats et projections
                  </h3>

                  <SimulationResults results={results} campaignDuration={simulationData.campaignDuration} />
                </Card>

                <BudgetRecommendation results={results} campaignDuration={simulationData.campaignDuration} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky CTAs */}
      {canShowResults && results && (() => {
        const selectedHospitalData = hospitals.find(h => h.id === simulationData.hospital);
        const selectedProfessionData = professions.find(p => p.id === simulationData.profession);
        const odooBase = "https://www.attard-multimedia.com";
        const hospitalUrl = selectedHospitalData
          ? `${odooBase}/${selectedHospitalData.odooSlug}`
          : `${odooBase}/product`;
        const hasDedie = selectedHospitalData && selectedHospitalData.odooSlug !== "contact";

        const handleSaveAndGo = () => {
          if (selectedHospitalData && selectedProfessionData && results) {
            saveSimulation({
              data: simulationData,
              results,
              hospitalName: selectedHospitalData.name,
              professionName: selectedProfessionData.name,
            });
          }
        };
        return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#0B1F3B]/10 shadow-2xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/commander" onClick={handleSaveAndGo} className="w-full sm:w-auto">
                <Button size="lg" className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white w-full sm:w-auto">
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Je passe commande
                </Button>
              </Link>

              <Link to="/brochure" onClick={handleSaveAndGo} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-[#1E6FFF] text-[#1E6FFF] hover:bg-[#1E6FFF]/10 w-full sm:w-auto">
                  <Download className="mr-2 w-5 h-5" />
                  Télécharger mon rapport
                </Button>
              </Link>

              <Link to="/rendez-vous" onClick={handleSaveAndGo} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-[#1E6FFF] text-[#1E6FFF] hover:bg-[#1E6FFF]/10 w-full sm:w-auto">
                  <Calendar className="mr-2 w-5 h-5" />
                  Parler à un expert
                </Button>
              </Link>

              {selectedHospitalData && (
                <a href={hospitalUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#0B1F3B]/20 text-[#0B1220] hover:bg-[#0B1F3B]/5 w-full sm:w-auto"
                  >
                    <Building2 className="mr-2 w-5 h-5" />
                    {hasDedie
                      ? `Voir ${selectedHospitalData.name}`
                      : `En savoir plus sur ${selectedHospitalData.city}`}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {/* Bottom spacing for sticky CTAs */}
      {canShowResults && <div className="h-24" />}
    </div>
  );
}
