import { z } from "zod";

export const relaxationActivities = [
  { id: "breathing", name: "Respiração guiada", seconds: 120, description: "Encontre um ritmo confortável e reserve alguns minutos para desacelerar.", steps: ["Respire no seu ritmo. Não é preciso respirar fundo nem prender o ar."] },
  { id: "mind", name: "Acalmar a mente", seconds: 180, description: "Uma pausa para direcionar a atenção ao momento presente.", steps: ["Encontre uma posição confortável. Você pode manter os olhos abertos.", "Observe um som ao seu redor, sem precisar mudar nada.", "Perceba os pontos de apoio do seu corpo.", "Se pensamentos aparecerem, volte sua atenção gentilmente ao momento presente.", "Termine no seu tempo, percebendo o ambiente ao seu redor."] },
  { id: "peace", name: "Pausa de tranquilidade", seconds: 300, description: "Desacelere em uma posição confortável.", steps: ["Acomode-se de uma forma confortável para você.", "Deixe suas mãos descansarem, sem fazer força.", "Observe sua respiração natural, sem tentar controlá-la.", "Permita-se apenas ficar aqui por alguns instantes.", "Volte sua atenção ao ambiente, com calma."] },
  { id: "sleep", name: "Preparar para dormir", seconds: 480, description: "Um momento tranquilo antes de dormir.", steps: ["Encontre uma posição confortável e diminua a luz, se quiser.", "Perceba o apoio da cama ou da cadeira.", "Deixe a respiração seguir naturalmente.", "Você não precisa resolver tudo neste momento. Apenas observe o que sente.", "Encerre devagar e siga no seu ritmo."] },
  { id: "body", name: "Relaxamento corporal", seconds: 0, description: "Dedique alguns minutos para perceber seu corpo e aliviar a tensão, sem forçar os movimentos.", steps: ["Encontre uma posição confortável, sentado ou deitado.", "Relaxe os ombros, se isso for confortável.", "Solte a mandíbula e as mãos, sem fazer força.", "Observe sua respiração natural.", "Perceba os pontos de apoio do corpo.", "Termine lentamente, respeitando seus limites."] },
] as const;
export type RelaxationActivity = (typeof relaxationActivities)[number];
export const emotionalOptions = [
  { label: "Muito estressada", message: "Se quiser, experimente uma pausa tranquila ou uma respiração confortável. Sem pressa.", activity: "breathing" },
  { label: "Ansiosa", message: "Uma prática breve de atenção ao momento presente está disponível, se fizer sentido para você.", activity: "mind" },
  { label: "Cansada", message: "Você pode descansar em uma posição confortável. Não precisa completar uma atividade.", activity: "body" },
  { label: "Mais tranquila", message: "Escolha livremente o que combina com este momento.", activity: "peace" },
  { label: "Estou tendo um dia difícil", message: "Não precisa dar conta de tudo. Uma pausa simples é uma opção; descansar também.", activity: "peace" },
] as const;
export const welcomingMessages = ["Respeitar seus limites também é cuidar de você.", "Pequenas pausas também fazem parte do cuidado.", "Você pode ir no seu próprio ritmo.", "Hoje, faça o que for possível. Não precisa ser perfeito.", "Descansar não é perder tempo."];
export const safetyMessage = "Se sentir dor, tontura, falta de ar ou outro desconforto, interrompa e volte à respiração natural. Sintomas intensos, novos ou incomuns devem ser avaliados por um profissional de saúde.";
export const sessionSchema = z.object({ id: z.string(), name: z.string(), date: z.string().datetime(), seconds: z.number().int().min(1), completed: z.boolean().optional() });
export const historySchema = z.array(sessionSchema);
export type RelaxationRecord = z.infer<typeof sessionSchema>;
export const reminderSchema = z.object({ enabled: z.boolean(), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), days: z.array(z.number().int().min(0).max(6)) });
export const defaultReminder = { enabled: false, time: "19:00", days: [0, 1, 2, 3, 4, 5, 6] };
export function formatSessionTime(seconds: number) { return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`; }
export function weeklySessions(records: RelaxationRecord[], now = new Date()) {
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  return records.filter(record => new Date(record.date) >= start && new Date(record.date) <= now);
}