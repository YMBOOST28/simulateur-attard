// ─── URL du webhook Make.com ───
// Remplacez cette URL par votre vrai webhook Make après création
// Make → New scenario → Webhooks → Custom webhook → Copy URL
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/VOTRE_WEBHOOK_ICI";

export interface LeadPayload {
  source: "rapport" | "rendez-vous" | "commande" | "rappel";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  // Données simulation
  hospitalName?: string;
  professionName?: string;
  odv?: number;
  recommendedScreens?: number;
  annualBudget?: number;
  roi?: number;
  campaignDuration?: string;
  // Extras
  callbackTime?: string;
  message?: string;
  appointmentDate?: string;
  appointmentType?: string;
}

export async function sendLeadToMake(payload: LeadPayload): Promise<boolean> {
  // Si le webhook n'est pas configuré, on log simplement
  if (MAKE_WEBHOOK_URL.includes("VOTRE_WEBHOOK_ICI")) {
    console.log("[Lead capturé - webhook non configuré]", payload);
    return true; // Ne bloque pas l'UX
  }

  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        source_url: window.location.href,
      }),
    });
    return true;
  } catch (err) {
    console.error("Erreur envoi webhook:", err);
    return false;
  }
}
