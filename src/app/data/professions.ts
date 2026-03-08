export interface Profession {
  id: string;
  name: string;
  averageBasket: number;
  conversionRate: number;
  icon: string;
}

export const professions: Profession[] = [
  {
    id: "opticien",
    name: "Opticien",
    averageBasket: 380,
    conversionRate: 1.6,
    icon: "👓",
  },
  {
    id: "audioprothesiste",
    name: "Audioprothésiste",
    averageBasket: 1250,
    conversionRate: 0.9,
    icon: "👂",
  },
  {
    id: "kine",
    name: "Kinésithérapeute / Rééducation",
    averageBasket: 520,
    conversionRate: 1.9,
    icon: "💪",
  },
  {
    id: "dentaire",
    name: "Dentaire",
    averageBasket: 1850,
    conversionRate: 0.8,
    icon: "🦷",
  },
  {
    id: "materiel-medical",
    name: "Matériel médical / Maintien à domicile",
    averageBasket: 950,
    conversionRate: 1.1,
    icon: "🏥",
  },
  {
    id: "bien-etre",
    name: "Bien-être & Prévention",
    averageBasket: 260,
    conversionRate: 2.2,
    icon: "🧘",
  },
  {
    id: "services-sante",
    name: "Services santé / Mutuelles",
    averageBasket: 620,
    conversionRate: 1.1,
    icon: "📋",
  },
];
