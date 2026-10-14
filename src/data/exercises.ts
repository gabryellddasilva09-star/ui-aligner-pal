import pescoco from "@/assets/ex-pescoco.jpg";
import ombros from "@/assets/ex-ombros.jpg";
import bracos from "@/assets/ex-bracos.jpg";
import quadril from "@/assets/ex-quadril.jpg";
import pernas from "@/assets/ex-pernas.jpg";
import cadeira from "@/assets/ex-cadeira.jpg";

export type Exercise = { id: string; name: string; min: number; cat: string; img: string; beginner: boolean; guided: boolean; steps: string[] };

export const exercises: Exercise[] = [
  { id: "pescoco", name: "Alongamento de pescoço", min: 5, cat: "Mobilidade", img: pescoco, beginner: true, guided: false,
    steps: ["Sente-se com a coluna reta.", "Incline a cabeça devagar para um lado, sem forçar.", "Respire fundo por alguns segundos.", "Volte ao centro e repita do outro lado."] },
  { id: "ombros", name: "Rotação de ombros", min: 5, cat: "Mobilidade", img: ombros, beginner: true, guided: false,
    steps: ["Deixe os braços soltos ao lado do corpo.", "Faça círculos lentos com os ombros para trás.", "Depois, faça círculos para frente.", "Mantenha a respiração tranquila."] },
  { id: "bracos", name: "Alongamento de braços", min: 6, cat: "Mobilidade", img: bracos, beginner: true, guided: false,
    steps: ["Entrelace os dedos à frente do corpo.", "Estique os braços para frente com suavidade.", "Segure alguns segundos respirando.", "Solte devagar."] },
  { id: "quadril", name: "Mobilidade de quadril", min: 7, cat: "Mobilidade", img: quadril, beginner: false, guided: true,
    steps: ["Sente-se no chão ou num colchonete.", "Dobre uma perna e gire o tronco suavemente.", "Fique alguns segundos e volte.", "Repita do outro lado."] },
  { id: "pernas", name: "Fortalecimento de pernas", min: 8, cat: "Fortalecimento", img: pernas, beginner: false, guided: true,
    steps: ["Fique em pé com os pés afastados.", "Dobre levemente os joelhos, como se fosse sentar.", "Suba devagar.", "Faça poucas repetições, sem dor."] },
  { id: "cadeira", name: "Exercícios na cadeira", min: 10, cat: "Fortalecimento", img: cadeira, beginner: true, guided: true,
    steps: ["Sente-se em uma cadeira firme.", "Levante os braços devagar, com ou sem peso leve.", "Estique uma perna de cada vez.", "Descanse sempre que precisar."] },
];

