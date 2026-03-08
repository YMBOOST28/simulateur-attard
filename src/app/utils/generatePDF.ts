import jsPDF from "jspdf";
import { LOGO_BASE64 } from "./logoBase64";
import { formatCurrency, formatNumber } from "./calculations";
import type { StoredSimulation } from "./simulationStore";

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export function generateSimulationPDF(stored: StoredSimulation, contact: ContactInfo): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { results: sim, data, hospitalName, professionName } = stored;

  const durationLabel = (
    { 6: "6 mois", 12: "1 an", 24: "2 ans", 36: "3 ans" } as Record<number, string>
  )[data.campaignDuration] || "1 an";
  const totalBudget = sim.annualBudget * (data.campaignDuration / 12);

  // Couleurs
  const C = {
    blue:      [30, 111, 255] as [number, number, number],
    blueLight: [235, 242, 255] as [number, number, number],
    green:     [29, 191, 115] as [number, number, number],
    dark:      [11, 18, 32]   as [number, number, number],
    gray:      [100, 110, 130] as [number, number, number],
    lightGray: [245, 247, 250] as [number, number, number],
    white:     [255, 255, 255] as [number, number, number],
  };

  const W = 210;
  const M = 15; // margin

  // ──────────────────────────────────────────────
  // HEADER — bandeau bleu gradient simulé
  // ──────────────────────────────────────────────
  doc.setFillColor(...C.blue);
  doc.rect(0, 0, W, 45, "F");

  // Ligne décorative en bas du header
  doc.setFillColor(255, 255, 255, 0.1);
  doc.rect(0, 42, W, 3, "F");

  // Logo
  try {
    doc.addImage(LOGO_BASE64, "PNG", M, 7, 26, 26);
  } catch (_) { /* silently skip if image fails */ }

  // Titre principal
  doc.setTextColor(...C.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Rapport de simulation", 47, 17);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text("Campagne DOOH Santé — Attard Multimédia", 47, 25);

  doc.setFontSize(8);
  doc.setTextColor(170, 200, 255);
  doc.text(
    `Préparé le ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
    47, 32
  );

  // Coordonnées Attard (coin droit)
  doc.setFontSize(7.5);
  doc.setTextColor(200, 220, 255);
  doc.text("www.attard-multimedia.com", W - M, 13, { align: "right" });
  doc.text("contact@attard-multimedia.com", W - M, 20, { align: "right" });
  doc.text("+33 (0)4 90 93 35 13", W - M, 27, { align: "right" });

  let y = 52;

  // ──────────────────────────────────────────────
  // BANDEAU CLIENT
  // ──────────────────────────────────────────────
  doc.setFillColor(...C.blueLight);
  doc.roundedRect(M, y, W - M * 2, 18, 2, 2, "F");

  doc.setDrawColor(...C.blue);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, W - M * 2, 18, 2, 2, "S");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.blue);
  doc.text("RAPPORT PRÉPARÉ POUR", M + 4, y + 6);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.dark);
  doc.text(`${contact.firstName} ${contact.lastName}  —  ${contact.company}`, M + 4, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text(`${contact.email}  •  ${contact.phone}`, W - M - 4, y + 13, { align: "right" });

  y += 26;

  // ──────────────────────────────────────────────
  // SECTION : Paramètres simulation
  // ──────────────────────────────────────────────
  // Titre section
  doc.setFillColor(...C.blue);
  doc.rect(M, y, 3, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.blue);
  doc.text("Paramètres de votre simulation", M + 6, y + 8.5);
  y += 17;

  const params: [string, string][] = [
    ["Hôpital sélectionné", hospitalName],
    ["Profession / Secteur", professionName],
    ["Durée du spot", `${data.spotDuration} secondes`],
    ["Durée de campagne", durationLabel],
    ["ODV ciblé", formatNumber(data.odv)],
  ];

  params.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...C.lightGray);
      doc.rect(M, y, W - M * 2, 8, "F");
    }
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(label, M + 4, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.dark);
    doc.text(value, W - M - 4, y + 5.5, { align: "right" });
    y += 8;
  });

  y += 10;

  // ──────────────────────────────────────────────
  // SECTION : Plan recommandé — 4 KPI boxes
  // ──────────────────────────────────────────────
  doc.setFillColor(...C.blue);
  doc.rect(M, y, W - M * 2, 10, "F");
  doc.setTextColor(...C.white);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("  Plan recommandé par Attard Multimédia", M + 2, y + 7);
  y += 14;

  const kpis = [
    { label: "Écrans conseillés", value: `${sim.recommendedScreens}`, unit: `écran${sim.recommendedScreens > 1 ? "s" : ""}`, color: C.blue },
    { label: "ODV annuel estimé", value: formatNumber(sim.annualPassages), unit: "par an", color: C.blue },
    { label: "Leads estimés", value: formatNumber(sim.estimatedLeads), unit: "par an", color: C.green },
    { label: "ROI estimé", value: `+${sim.roi.toFixed(1)}%`, unit: "retour invest.", color: C.green },
  ] as const;

  const bw = (W - M * 2 - 9) / 4;
  kpis.forEach(({ label, value, unit, color }, i) => {
    const x = M + i * (bw + 3);
    doc.setFillColor(...C.lightGray);
    doc.roundedRect(x, y, bw, 22, 2, 2, "F");
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, y, bw, 22, 2, 2, "S");

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(label, x + bw / 2, y + 6, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...color);
    doc.text(value, x + bw / 2, y + 14, { align: "center" });

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(unit, x + bw / 2, y + 19, { align: "center" });
  });

  y += 28;

  // ──────────────────────────────────────────────
  // SECTION : Budget détaillé (2 colonnes)
  // ──────────────────────────────────────────────
  doc.setFillColor(...C.blue);
  doc.rect(M, y, 3, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.blue);
  doc.text("Budget détaillé", M + 6, y + 8.5);
  y += 16;

  const budgetRows: [string, string, boolean][] = [
    ["Budget annuel HT", formatCurrency(sim.annualBudget / 1.2), false],
    ["TVA (20%)", formatCurrency(sim.annualBudget - sim.annualBudget / 1.2), false],
    [`Budget total TTC sur ${durationLabel}`, formatCurrency(totalBudget), true],
    ["Coût mensuel moyen", formatCurrency(sim.monthlyBudget), false],
    ["Coût journalier", formatCurrency(sim.costPerDay), false],
  ];

  budgetRows.forEach(([label, value, isTotal], i) => {
    if (isTotal) {
      doc.setFillColor(...C.blue);
      doc.roundedRect(M, y, W - M * 2, 9, 1, 1, "F");
      doc.setTextColor(...C.white);
    } else {
      if (i % 2 === 0) { doc.setFillColor(...C.lightGray); doc.rect(M, y, W - M * 2, 8, "F"); }
      doc.setTextColor(...C.dark);
    }
    doc.setFontSize(8.5);
    doc.setFont("helvetica", isTotal ? "bold" : "normal");
    doc.text(label, M + 4, y + (isTotal ? 6 : 5.5));
    doc.text(value, W - M - 4, y + (isTotal ? 6 : 5.5), { align: "right" });
    y += isTotal ? 9 : 8;
  });

  y += 10;

  // ──────────────────────────────────────────────
  // SECTION : Projections CA
  // ──────────────────────────────────────────────
  doc.setFillColor(...C.blue);
  doc.rect(M, y, 3, 12, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.blue);
  doc.text("Projections de retour sur investissement", M + 6, y + 8.5);
  y += 16;

  const projRows: [string, string][] = [
    ["CA potentiel sur 6 mois",  formatCurrency(sim.potentialRevenue6Months)],
    ["CA potentiel sur 1 an",    formatCurrency(sim.potentialRevenue1Year)],
    ["CA potentiel sur 2 ans",   formatCurrency(sim.potentialRevenue2Years)],
    ["CA potentiel sur 3 ans",   formatCurrency(sim.potentialRevenue3Years)],
  ];

  projRows.forEach(([label, value], i) => {
    if (i % 2 === 0) { doc.setFillColor(...C.lightGray); doc.rect(M, y, W - M * 2, 8, "F"); }
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(label, M + 4, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.green);
    doc.text(value, W - M - 4, y + 5.5, { align: "right" });
    y += 8;
  });

  // ──────────────────────────────────────────────
  // FOOTER
  // ──────────────────────────────────────────────
  const footerY = 278;
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...C.gray);
  doc.text(
    "* Projections indicatives basées sur études DOOH Santé : Publicis/Broadsign, Opinion Way 2017, IDS Media/Broadsign.",
    W / 2, footerY, { align: "center" }
  );

  doc.setFillColor(...C.blue);
  doc.rect(0, footerY + 4, W, 18, "F");

  // Logo blanc dans footer
  try { doc.addImage(LOGO_BASE64, "PNG", M, footerY + 6, 14, 14); } catch (_) {}

  doc.setTextColor(...C.white);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Attard Multimédia", M + 17, footerY + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(190, 215, 255);
  doc.text("Communication en milieu hospitalier depuis plus de 35 ans", M + 17, footerY + 17);

  doc.setTextColor(190, 215, 255);
  doc.setFontSize(7);
  doc.text("www.attard-multimedia.com", W - M, footerY + 11, { align: "right" });
  doc.text("contact@attard-multimedia.com  •  +33 (0)4 90 93 35 13", W - M, footerY + 17, { align: "right" });

  // Sauvegarde
  const filename = `rapport-attard-${hospitalName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${new Date().getFullYear()}.pdf`;
  doc.save(filename);
}
