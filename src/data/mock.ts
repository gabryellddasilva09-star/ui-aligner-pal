// Mock data layer. Replace these exports with API/database calls later.
export type Status = "good" | "attention" | "priority";
export type IndicatorKey = "pain" | "sleep" | "energy" | "food" | "move" | "mood";

export interface Indicator {
  key: IndicatorKey;
  label: string;
  value: string;
  unit?: string;
  progress: number; // 0..1
  change: number; // percent vs previous period
  improving: boolean; // whether the change is good for the patient
  caption: string;
  status: Status;
}

export const patient = {
  name: "Ana",
  program: "Acompanhamento da Fibromialgia",
};

export const professional = {
  name: "Dr(a). Nadya",
  role: "Reumatologista",
  lastSeen: "Revisou seus registros há 2 dias",
};

export const weeklyIndicators: Indicator[] = [
  { key: "pain", label: "Dor", value: "7,1", unit: "/10", progress: 0.71, change: 18, improving: false, caption: "vs. semana anterior", status: "priority" },
  { key: "sleep", label: "Sono", value: "5,8", unit: "h", progress: 0.58, change: -22, improving: false, caption: "vs. semana anterior", status: "attention" },
  { key: "energy", label: "Energia", value: "4", unit: "/10", progress: 0.4, change: 12, improving: true, caption: "vs. semana anterior", status: "attention" },
  { key: "food", label: "Alimentação", value: "87", unit: "%", progress: 0.87, change: 5, improving: true, caption: "de adesão", status: "good" },
  { key: "move", label: "Movimento", value: "3", unit: "/10", progress: 0.3, change: 8, improving: true, caption: "esta semana", status: "attention" },
  { key: "mood", label: "Humor", value: "6", unit: "/10", progress: 0.6, change: 10, improving: true, caption: "esta semana", status: "good" },
];

export const insight = {
  title: "O que percebemos",
  text: "Sua dor aumentou nos últimos 7 dias e isso coincidiu com a piora do sono. Esse padrão já apareceu antes em momentos semelhantes.",
  detail: "Em março, uma sequência de noites com menos de 6h de sono veio antes de uma semana de dor mais intensa. Cuidar do sono agora pode ajudar a quebrar esse ciclo.",
};

export const focus = {
  title: "Seu foco agora",
  text: "Vamos priorizar seu sono pelos próximos 7 dias.",
  day: 2,
  total: 7,
};

// deterministic pseudo-random series
function series(n: number, base: number, amp: number, trend: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const s = Math.sin(i * 1.7 + seed) * 0.5 + Math.sin(i * 0.6 + seed * 2) * 0.5;
    return Math.max(0, +(base + s * amp + (trend * i) / n).toFixed(1));
  });
}

export const painMonth = { data: series(30, 5.6, 0.6, 1.6, 1), average: "7,1", change: 22 };

export const evolutionSeries: Record<IndicatorKey, Record<7 | 30 | 90, number[]>> = {
  pain: { 7: series(7, 6.4, 0.5, 1, 1), 30: series(30, 5.6, 0.6, 1.6, 1), 90: series(90, 6, 0.8, 1, 1) },
  sleep: { 7: series(7, 6.6, 0.5, -1, 2), 30: series(30, 7, 0.6, -1.2, 2), 90: series(90, 6.8, 0.7, -0.8, 2) },
  energy: { 7: series(7, 3.6, 0.6, 0.6, 3), 30: series(30, 3.4, 0.7, 0.8, 3), 90: series(90, 3.5, 0.8, 0.6, 3) },
  mood: { 7: series(7, 5.5, 0.6, 0.6, 4), 30: series(30, 5.2, 0.7, 0.9, 4), 90: series(90, 5, 0.8, 1, 4) },
  move: { 7: series(7, 2.7, 0.5, 0.4, 5), 30: series(30, 2.5, 0.6, 0.6, 5), 90: series(90, 2.4, 0.7, 0.7, 5) },
  food: { 7: series(7, 82, 4, 5, 6), 30: series(30, 80, 5, 7, 6), 90: series(90, 76, 6, 10, 6) },
};

export interface DiaryEntry {
  day: string;
  date: string;
  note?: string;
  items: { key: IndicatorKey; label: string; value: string; status: Status }[];
}

export const diary: DiaryEntry[] = [
  {
    day: "Hoje", date: "7 out",
    note: "Acordei com rigidez nas mãos, melhorou depois do banho quente.",
    items: [
      { key: "pain", label: "Dor", value: "7/10", status: "priority" },
      { key: "sleep", label: "Sono", value: "5,5h", status: "attention" },
      { key: "energy", label: "Energia", value: "4/10", status: "attention" },
    ],
  },
  {
    day: "Ontem", date: "6 out",
    items: [
      { key: "pain", label: "Dor", value: "6/10", status: "attention" },
      { key: "sleep", label: "Sono", value: "7h", status: "good" },
      { key: "energy", label: "Energia", value: "6/10", status: "good" },
    ],
  },
  {
    day: "Segunda", date: "5 out",
    note: "Caminhada leve de 15 minutos.",
    items: [
      { key: "pain", label: "Dor", value: "6/10", status: "attention" },
      { key: "sleep", label: "Sono", value: "6h", status: "attention" },
      { key: "energy", label: "Energia", value: "5/10", status: "attention" },
    ],
  },
];

export const messages = [
  { from: "Dr(a). Nadya", text: "Vi que o sono piorou essa semana. Vamos conversar sobre isso na próxima consulta.", when: "2 dias atrás" },
];
