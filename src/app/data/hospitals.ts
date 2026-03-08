export interface Hospital {
  id: string;
  name: string;
  city: string;
  passagesPerDay: number;
  odooSlug: string;
  region?: string;
}

export const hospitals: Hospital[] = [
  // Nord / Hauts-de-France
  { id: "saint-omer", name: "CH Saint-Omer", city: "Saint-Omer", passagesPerDay: 6192, odooSlug: "saint-omer", region: "Hauts-de-France" },
  { id: "saint-quentin", name: "CH Saint-Quentin", city: "Saint-Quentin", passagesPerDay: 8165, odooSlug: "saint-quentin", region: "Hauts-de-France" },

  // Normandie / Centre
  { id: "dreux", name: "CH Dreux", city: "Dreux", passagesPerDay: 7225, odooSlug: "dreux", region: "Centre-Val de Loire" },
  { id: "sens", name: "CH Sens", city: "Sens", passagesPerDay: 6192, odooSlug: "sens", region: "Bourgogne-Franche-Comté" },
  { id: "le-havre", name: "CHU Le Havre", city: "Le Havre", passagesPerDay: 15512, odooSlug: "le-havre", region: "Normandie" },

  // Bretagne / Pays de la Loire
  { id: "morlaix", name: "CH Morlaix", city: "Morlaix", passagesPerDay: 6192, odooSlug: "morlaix", region: "Bretagne" },
  { id: "auray", name: "CH Auray", city: "Auray", passagesPerDay: 6500, odooSlug: "bretagne-atlantique", region: "Bretagne" },
  { id: "vannes", name: "CH Vannes", city: "Vannes", passagesPerDay: 10050, odooSlug: "bretagne-atlantique", region: "Bretagne" },
  { id: "rennes", name: "CHU Rennes", city: "Rennes", passagesPerDay: 22560, odooSlug: "rennes", region: "Bretagne" },
  { id: "la-rochelle", name: "CH La Rochelle", city: "La Rochelle", passagesPerDay: 13090, odooSlug: "la-rochelle", region: "Nouvelle-Aquitaine" },

  // Auvergne-Rhône-Alpes
  { id: "montlucon", name: "CH Montluçon", city: "Montluçon", passagesPerDay: 8600, odooSlug: "montlucon", region: "Auvergne-Rhône-Alpes" },
  { id: "roanne", name: "CH Roanne", city: "Roanne", passagesPerDay: 7240, odooSlug: "roanne", region: "Auvergne-Rhône-Alpes" },

  // Nouvelle-Aquitaine / Occitanie
  { id: "perigueux", name: "CH Périgueux", city: "Périgueux", passagesPerDay: 7500, odooSlug: "perigueux", region: "Nouvelle-Aquitaine" },
  { id: "tarbes", name: "CH Tarbes", city: "Tarbes", passagesPerDay: 9154, odooSlug: "tarbes", region: "Occitanie" },
  { id: "agde", name: "CH Agde", city: "Agde", passagesPerDay: 4200, odooSlug: "bassin-de-thau", region: "Occitanie" },
  { id: "sete", name: "CH Sète", city: "Sète", passagesPerDay: 6230, odooSlug: "bassin-de-thau", region: "Occitanie" },

  // PACA
  { id: "marseille", name: "AP-HM Marseille", city: "Marseille", passagesPerDay: 49870, odooSlug: "contact", region: "PACA" },
  { id: "aix-en-provence", name: "CH Aix-en-Provence", city: "Aix-en-Provence", passagesPerDay: 9580, odooSlug: "aix-en-provence", region: "PACA" },
  { id: "arles", name: "CH Arles", city: "Arles", passagesPerDay: 8320, odooSlug: "arles", region: "PACA" },
  { id: "carpentras", name: "CH Carpentras", city: "Carpentras", passagesPerDay: 5420, odooSlug: "carpentras", region: "PACA" },
  { id: "orange", name: "CH Orange", city: "Orange", passagesPerDay: 2990, odooSlug: "orange", region: "PACA" },
  { id: "draguignan", name: "CH Draguignan", city: "Draguignan", passagesPerDay: 3030, odooSlug: "draguignan", region: "PACA" },
  { id: "nice", name: "CHU Nice", city: "Nice", passagesPerDay: 9200, odooSlug: "contact", region: "PACA" },

  // DOM-TOM
  { id: "martinique", name: "CHU Martinique", city: "Fort-de-France", passagesPerDay: 24750, odooSlug: "martinique", region: "Martinique" },
  { id: "guadeloupe-pointe-a-pitre", name: "CHU Pointe-à-Pitre", city: "Pointe-à-Pitre", passagesPerDay: 13745, odooSlug: "contact", region: "Guadeloupe" },
  { id: "guadeloupe-basse-terre", name: "CH Basse-Terre", city: "Basse-Terre", passagesPerDay: 6900, odooSlug: "contact", region: "Guadeloupe" },
  { id: "guyane", name: "CH Cayenne", city: "Cayenne", passagesPerDay: 10343, odooSlug: "contact", region: "Guyane" },
  { id: "reunion-saint-denis", name: "CHU La Réunion - Saint-Denis", city: "Saint-Denis", passagesPerDay: 12245, odooSlug: "la-reunion", region: "La Réunion" },
  { id: "reunion-saint-pierre", name: "CHU La Réunion - Saint-Pierre", city: "Saint-Pierre", passagesPerDay: 8790, odooSlug: "la-reunion", region: "La Réunion" },
  { id: "reunion-saint-benoit", name: "CH Saint-Benoît", city: "Saint-Benoît", passagesPerDay: 3810, odooSlug: "la-reunion", region: "La Réunion" },
];
