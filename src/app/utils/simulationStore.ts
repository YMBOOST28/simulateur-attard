// Store simple basé sur sessionStorage pour partager les données entre pages
import type { SimulationData, SimulationResults } from "../types/simulation";

const KEY = "attard_simulation";

export interface StoredSimulation {
  data: SimulationData;
  results: SimulationResults;
  hospitalName: string;
  professionName: string;
}

export function saveSimulation(payload: StoredSimulation) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {}
}

export function loadSimulation(): StoredSimulation | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
