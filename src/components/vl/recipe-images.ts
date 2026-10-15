import type { Recipe } from "@/data/anti-inflammatory";
import arroz_couve_flor from "@/assets/recipes/arroz-couve-flor.jpg.asset.json";
import batata_doce from "@/assets/recipes/batata-doce.jpg.asset.json";
import caldo from "@/assets/recipes/caldo.jpg.asset.json";
import frango_curry from "@/assets/recipes/frango-curry.jpg.asset.json";
import frango_emergencia from "@/assets/recipes/frango-emergencia.jpg.asset.json";
import homus from "@/assets/recipes/homus.jpg.asset.json";
import mousse from "@/assets/recipes/mousse.jpg.asset.json";
import omelete from "@/assets/recipes/omelete.jpg.asset.json";
import panqueca from "@/assets/recipes/panqueca.jpg.asset.json";
import quiche from "@/assets/recipes/quiche.jpg.asset.json";
import salmao from "@/assets/recipes/salmao.jpg.asset.json";
import sardinha from "@/assets/recipes/sardinha.jpg.asset.json";
import smoothie from "@/assets/recipes/smoothie.jpg.asset.json";
import sopa_abobora from "@/assets/recipes/sopa-abobora.jpg.asset.json";
import vitamina from "@/assets/recipes/vitamina.jpg.asset.json";
export const recipeImages: Record<Recipe["id"], string> = {
  "arroz-couve-flor": arroz_couve_flor.url,
  "batata-doce": batata_doce.url,
  "caldo": caldo.url,
  "frango-curry": frango_curry.url,
  "frango-emergencia": frango_emergencia.url,
  "homus": homus.url,
  "mousse": mousse.url,
  "omelete": omelete.url,
  "panqueca": panqueca.url,
  "quiche": quiche.url,
  "salmao": salmao.url,
  "sardinha": sardinha.url,
  "smoothie": smoothie.url,
  "sopa-abobora": sopa_abobora.url,
  "vitamina": vitamina.url,
};
