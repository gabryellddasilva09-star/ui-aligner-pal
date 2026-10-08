// Mock data for the "Meu plano de movimento" screen.
export interface MovementActivity {
  id: string;
  name: string;
  category: string;
  duration?: string;
  description: string;
  objective: string;
  steps: string[];
  safety: string[];
}

export const movementActivities: MovementActivity[] = [
  {
    id: "mobilidade",
    name: "Mobilidade suave",
    category: "Mobilidade",
    duration: "10 min",
    description: "Movimentos suaves para explorar a mobilidade corporal.",
    objective: "Aquecer o corpo com leveza, respeitando os limites do dia.",
    steps: [
      "Encontre uma posição confortável, sentada ou em pé.",
      "Faça círculos suaves de ombros, sem pressa.",
      "Incline a cabeça lentamente para os lados, respirando fundo.",
      "Movimente punhos e tornozelos em pequenos círculos.",
      "Termine com uma respiração profunda e perceba como está.",
    ],
    safety: [
      "Faça apenas movimentos que não causem dor.",
      "Interrompa se sentir tontura ou desconforto.",
    ],
  },
  {
    id: "respiracao",
    name: "Respiração e relaxamento",
    category: "Relaxamento",
    duration: "5 min",
    description: "Uma pausa guiada para desacelerar e prestar atenção à respiração.",
    objective: "Acalmar corpo e mente por meio da respiração consciente.",
    steps: [
      "Sente-se ou deite-se em um lugar tranquilo.",
      "Inspire pelo nariz contando até quatro.",
      "Segure o ar por dois tempos, sem esforço.",
      "Solte o ar pela boca, devagar, contando até seis.",
      "Repita no seu ritmo, pelo tempo que quiser.",
    ],
    safety: [
      "Se sentir tontura, volte a respirar normalmente.",
      "Não é preciso forçar nem segurar o ar em hipótese alguma.",
    ],
  },
  {
    id: "alongamento",
    name: "Alongamento orientado",
    category: "Alongamento",
    duration: "8 min",
    description: "Consulte a demonstração e as orientações antes de iniciar.",
    objective: "Alongar com segurança, sem forçar articulações.",
    steps: [
      "Escolha um ambiente com espaço e apoio, se precisar.",
      "Alongue um grupo muscular por vez, sempre sem dor.",
      "Mantenha cada posição por alguns segundos, respirando.",
      "Volte devagar à posição inicial.",
      "Alterne os lados com calma.",
    ],
    safety: [
      "Nunca force além do limite de conforto.",
      "Pare imediatamente se sentir dor aguda.",
    ],
  },
  {
    id: "pausa",
    name: "Pausa de autocuidado",
    category: "Bem-estar",
    description: "Um momento para fazer uma pausa e perceber como você está.",
    objective: "Criar um espaço de escuta e gentileza com o próprio corpo.",
    steps: [
      "Afaste-se por um momento das telas e do movimento.",
      "Observe suas sensações sem julgamento.",
      "Beba um copo de água ou ajuste sua postura.",
      "Registre mentalmente como está se sentindo agora.",
    ],
    safety: [
      "Esta pausa não substitui orientação profissional.",
    ],
  },
];

export interface DailyStateOption {
  key: string;
  label: string;
  message: string;
}

export const dailyStates: DailyStateOption[] = [
  {
    key: "bem",
    label: "Estou bem",
    message: "Vamos respeitar seu ritmo e seguir as orientações do seu plano.",
  },
  {
    key: "cansada",
    label: "Estou cansada",
    message: "Tudo bem ir com calma. Veja as opções disponíveis para hoje.",
  },
  {
    key: "dificil",
    label: "Hoje está difícil",
    message: "Não precisa se cobrar. Você pode registrar como está se sentindo e consultar as orientações de segurança.",
  },
];

export type WeekDayState = "done" | "none" | "nodata";

export interface WeekDay {
  day: string;
  state: WeekDayState;
  isToday?: boolean;
}

export const weekHistory: WeekDay[] = [
  { day: "Dom", state: "nodata" },
  { day: "Seg", state: "done" },
  { day: "Ter", state: "done" },
  { day: "Qua", state: "nodata" },
  { day: "Qui", state: "done" },
  { day: "Sex", state: "none" },
  { day: "Sáb", state: "nodata", isToday: true },
];

export const weekSummaryBase = 5;
