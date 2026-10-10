import { Apple, Beef, ChefHat, Egg, Fish, Leaf, Soup, CupSoda, type LucideIcon } from "lucide-react";
import eggs from "@/assets/nutrition-eggs.jpg";
import soup from "@/assets/nutrition-soup.jpg";
import smoothie from "@/assets/nutrition-smoothie.jpg";
import { cn } from "@/lib/utils";

export function foodVisual(text: string): { image?: string; icon: LucideIcon; tone: string } {
  const value = text.toLocaleLowerCase("pt-BR");
  if (value.includes("sopa de abóbora")) return { image: soup, icon: Soup, tone: "bg-warn-soft text-warn" };
  if (value.includes("omelete")) return { image: eggs, icon: Egg, tone: "bg-warn-soft text-warn" };
  if (value.includes("vitamina") && value.includes("anti-inflamatória")) return { image: smoothie, icon: CupSoda, tone: "bg-good-soft text-good" };
  if (/peixe|salmão|sardinha|atum/.test(value)) return { icon: Fish, tone: "bg-nutrition-blue-soft text-nutrition-blue" };
  if (/frango|carne|caldo|costela/.test(value)) return { icon: Beef, tone: "bg-alert-soft text-alert" };
  if (/ovo|panqueca|quiche/.test(value)) return { icon: Egg, tone: "bg-warn-soft text-warn" };
  if (/chá|vitamina|smoothie|água/.test(value)) return { icon: CupSoda, tone: "bg-nutrition-blue-soft text-nutrition-blue" };
  if (/maçã|fruta|abacate|mousse|banana/.test(value)) return { icon: Apple, tone: "bg-alert-soft text-alert" };
  if (/salada|couve|legume|homus/.test(value)) return { icon: Leaf, tone: "bg-good-soft text-good" };
  return { icon: ChefHat, tone: "bg-primary-soft text-primary" };
}

export function FoodVisual({ text, large = false }: { text: string; large?: boolean }) {
  const { image, icon: Icon, tone } = foodVisual(text);
  return image ? (
    <img src={image} alt="Imagem ilustrativa da preparação" loading="lazy" width={816} height={816}
      className={cn("object-cover", large ? "aspect-[16/9] w-full" : "size-20 rounded-2xl sm:size-24")} />
  ) : (
    <span aria-hidden className={cn("grid shrink-0 place-items-center", tone, large ? "aspect-[16/9] w-full" : "size-20 rounded-2xl sm:size-24")}>
      <Icon strokeWidth={1.4} className={large ? "size-16" : "size-9"} />
    </span>
  );
}

export function NutritionDisclosure({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return <details className={cn("nutrition-disclosure border-b py-2", className)}>
    <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-lg font-semibold">
      {title}<span aria-hidden className="nutrition-disclosure-arrow shrink-0 text-primary">⌄</span>
    </summary>
    <div className="pb-5 text-base leading-relaxed">{children}</div>
  </details>;
}