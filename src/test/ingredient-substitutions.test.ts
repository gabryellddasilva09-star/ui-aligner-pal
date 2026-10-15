import { describe, expect, it } from "vitest";
import { recipes } from "@/data/anti-inflammatory";
import { hasSubstitution, substitutionsFor } from "@/lib/ingredient-substitutions";

describe("ingredient substitution highlight", () => {
  it("matches the way ingredients are actually written in the recipes", () => {
    expect(substitutionsFor("1 punhado de espinafre fresco")[0]?.to).toBe("Couve, rúcula ou brócolis");
    expect(substitutionsFor("½ colher (chá) de cúrcuma")[0]?.to).toBe("Cúrcuma em pó + pimenta-do-reino");
    expect(substitutionsFor("200 ml de leite de coco")[0]?.to).toBe("Leite de amêndoa ou castanha");
    expect(substitutionsFor("2 filés de salmão (200 g cada)")[0]?.to).toBe("Sardinha fresca ou atum");
    expect(substitutionsFor("2 batatas-doces médias")[0]?.to).toBe("Inhame ou batata-baroa");
    expect(substitutionsFor("400 g de grão-de-bico cozido")[0]?.to).toBe("Lentilha ou ervilha seca");
    expect(substitutionsFor("1 colher (sopa) de azeite extra virgem")[0]?.to).toBe("Manteiga ghee");
    expect(substitutionsFor("½ cabeça de couve-flor")[0]?.to).toBe("Quinoa ou amaranto");
  });

  it("leaves plain ingredients without a swap", () => {
    expect(hasSubstitution("3 ovos caipiras")).toBe(false);
    expect(hasSubstitution("Sal do Himalaia a gosto")).toBe(false);
    expect(hasSubstitution("1 kg de ossos de boi (tutano, joelho)")).toBe(false);
    expect(hasSubstitution("Água")).toBe(false);
  });

  it("does not fire on a word that merely contains the term", () => {
    expect(hasSubstitution("1 colher (chá) de canela")).toBe(false);
    expect(hasSubstitution("200 ml de água de coco")).toBe(false);
  });

  it("every recipe shows at least one highlighted ingredient", () => {
    for (const recipe of recipes) {
      expect(recipe.ingredients.some(hasSubstitution), recipe.name).toBe(true);
    }
  });
});
