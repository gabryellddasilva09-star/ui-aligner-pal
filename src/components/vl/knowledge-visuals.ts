import { Activity, AlertTriangle, Brain, Heart, Home, Info, Moon, PersonStanding, Pill, Smartphone, Stethoscope, Utensils, type LucideIcon } from "lucide-react";
import type { KnowledgeTopic } from "@/data/knowledge";
import bodyImg from "@/assets/lib-body.jpg";
import careImg from "@/assets/lib-care.jpg";
import doctorImg from "@/assets/lib-doctor.jpg";
import foodImg from "@/assets/nutrition-table.jpg";
import relaxImg from "@/assets/qa-relax.jpg";
import heroImg from "@/assets/lib-hero.jpg";

export const knowledgeIcons: Record<KnowledgeTopic["icon"], LucideIcon> = {
  info: Info, brain: Brain, activity: Activity, stethoscope: Stethoscope, pill: Pill,
  move: PersonStanding, food: Utensils, moon: Moon, heart: Heart, home: Home,
  alert: AlertTriangle, app: Smartphone,
};
export const knowledgeFilters = [
  { id: "all", label: "Tudo" },
  { id: "condition", label: "Sobre a doença" },
  { id: "care", label: "Cuidados diários" },
] as const;
export function knowledgeCategory(id: string) {
  return ["o-que-e", "causas", "sintomas", "diagnostico", "tratamento", "alerta"].includes(id) ? "condition" : "care";
}
export function knowledgeImage(topic: KnowledgeTopic) {
  if (topic.image === "body" || topic.id === "sintomas") return { src: bodyImg, alt: "Ilustração educativa do corpo humano" };
  if (topic.image === "doctor" || topic.id === "tratamento" || topic.id === "alerta") return { src: doctorImg, alt: "Profissional de saúde em uma consulta" };
  if (topic.image === "care") return { src: careImg, alt: "Movimento suave e autocuidado" };
  if (topic.id === "alimentacao") return { src: foodImg, alt: "Alimentos variados para uma refeição equilibrada" };
  if (topic.id === "sono" || topic.id === "emocoes") return { src: relaxImg, alt: "Um momento tranquilo de descanso" };
  return { src: heroImg, alt: "Mulher lendo em uma sala iluminada" };
}