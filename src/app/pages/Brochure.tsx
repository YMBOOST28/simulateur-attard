import { Link } from "react-router";
import { Download, Calendar, FileText, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function Brochure() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-4 rounded-full bg-[#1E6FFF]/10 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-[#1E6FFF]" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-4">
            Télécharger votre rapport personnalisé
          </h1>
          
          <p className="text-lg text-[#0B1F3B]/60 mb-8">
            Pour recevoir votre rapport PDF détaillé avec vos projections et recommandations, prenez rendez-vous avec un expert Attard Multimédia.
          </p>

          <Card className="p-8 border-[#0B1F3B]/10 bg-white mb-8">
            <div className="text-left space-y-6">
              <h3 className="text-xl font-semibold text-[#0B1220]">
                Votre rapport comprendra :
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0B1220]">Récapitulatif complet de votre simulation</p>
                    <p className="text-sm text-[#0B1F3B]/60">Hôpital, profession, durée de campagne et paramètres ODV</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0B1220]">Projections de performance détaillées</p>
                    <p className="text-sm text-[#0B1F3B]/60">Passages théoriques annuels, leads estimés et potentiel de CA</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0B1220]">Analyse ROI et budget recommandé</p>
                    <p className="text-sm text-[#0B1F3B]/60">Retour sur investissement et plan de financement adapté</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0B1220]">Plan d'action personnalisé</p>
                    <p className="text-sm text-[#0B1F3B]/60">Recommandations d'écrans et stratégie de diffusion optimale</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1DBF73] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0B1220]">Accompagnement expert</p>
                    <p className="text-sm text-[#0B1F3B]/60">Explication détaillée de vos chiffres et réponses à vos questions</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-gradient-to-br from-[#1E6FFF]/5 to-white rounded-2xl border-2 border-[#1E6FFF]/20 mb-8">
            <h3 className="text-lg font-semibold text-[#0B1220] mb-3">
              Pourquoi prendre rendez-vous ?
            </h3>
            <p className="text-sm text-[#0B1F3B]/60 mb-6">
              Nos experts vous aident à comprendre vos projections, à optimiser votre plan de diffusion et à répondre à toutes vos questions avant de lancer votre campagne. Le rapport PDF vous sera envoyé par email après cet échange personnalisé.
            </p>
            <Link to="/rendez-vous">
              <Button size="lg" className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white">
                <Calendar className="mr-2 w-5 h-5" />
                Prendre rendez-vous pour recevoir mon rapport
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                variant="outline"
                className="border-[#1E6FFF] text-[#1E6FFF] hover:bg-[#1E6FFF]/10 w-full sm:w-auto"
              >
                Retour au simulateur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
