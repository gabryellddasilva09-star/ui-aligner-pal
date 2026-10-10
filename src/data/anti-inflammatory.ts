// Conteúdo do "Cardápio anti-inflamatório 21 dias para fibromiálgicas" — Dra. Nadya Kazzaz.
// Transcrito do material fornecido pela usuária; não alterar orientações sem novo material.

export type Tag = "FÁCIL" | "CRISE" | "PREPARO";
export type MealKey = "cafe" | "lancheManha" | "almoco" | "lancheTarde" | "jantar";

export const mealLabels: Record<MealKey, string> = {
  cafe: "Café da manhã",
  lancheManha: "Lanche da manhã",
  almoco: "Almoço",
  lancheTarde: "Lanche da tarde",
  jantar: "Jantar",
};
export const mealOrder: MealKey[] = ["cafe", "lancheManha", "almoco", "lancheTarde", "jantar"];

export type DayPlan = { day: number; dinnerTime: string; meals: Record<MealKey, string>; tip?: string | undefined };

export const tagInfo: Record<Tag, string> = {
  "FÁCIL": "Receita rápida, menos de 15 minutos",
  CRISE: "Para dias com muita dor — simples e quase sem preparo",
  PREPARO: "Pede um pouco mais de tempo, mas pode ser feito com antecedência",
};

const muffin =
  "Uma maçã ou muffin de maçã (se sentir falta do doce): bata 1 ovo + 1 maçã + 1 colher de chá de cacau 100% + ½ colher de café de fermento e asse no forno ou air fryer";

const d = (day: number, dinnerTime: string, m: [string, string, string, string, string], tip?: string): DayPlan => ({
  day, dinnerTime, tip,
  meals: { cafe: m[0], lancheManha: m[1], almoco: m[2], lancheTarde: m[3], jantar: m[4] },
});

export const weeks = [
  {
    n: 1,
    title: "Desintoxicação e redução de picos inflamatórios",
    notes: [
      "O objetivo é eliminar os principais gatilhos inflamatórios e dar um reset ao intestino.",
      "Pode surgir leve dor de cabeça nos primeiros 2–3 dias — é o corpo eliminando toxinas. Nesse caso, tome 300 ml de água com 1 colher rasa de café de sal marinho integral.",
      "Beba muita água. Se tiver cansaço extra, descanse sem culpa. Seu corpo está trabalhando.",
    ],
    days: [
      d(1, "20:00", [
        "Meia xícara de água morna com vinagre de maçã e uma pitada de sal marinho + meio alho cru (engolir sem mastigar). Suco verde de aipo + omelete de 2 ovos no azeite + chá verde sem açúcar",
        muffin,
        "Frango grelhado com cúrcuma + macarronada fake ao alho e azeite (massa de konjac) + salada de folhas com azeite e limão",
        "Chá de hibisco (300 ml)",
        "Peixe assado com ervas (tilápia ou sardinha) + abobrinha refogada no azeite",
      ], "Mantenha uma garrafa de água sempre por perto."),
      d(2, "20:00", [
        "Vitamina de leite de coco com chia e canela [FÁCIL]",
        muffin,
        "Caldo de ossos de frango + frango desfiado + brócolis no vapor + abóbora cabotiá assada com especiarias",
        "Pepino com azeite e sal rosa do Himalaia ou marinho",
        "Omelete de frango desfiado com tomate e cebola [CRISE]",
      ], "Capriche nas ervas e temperos naturais!"),
      d(3, "20:00", [
        "Abacate amassado e ovo mexido (misturados e assados na frigideira)",
        "Kefir de água (150 ml) + 1 fruta vermelha",
        "Sardinhas assadas com limãozinho + salada de rúcula com tomate-cereja, uma colher de abacate e azeite",
        "Chá de erva-doce",
        "Sopa leve de legumes: abobrinha, cenoura, chuchu e frango [FÁCIL]",
      ], "Cores no prato significam mais nutrientes e fitoquímicos!"),
      d(4, "20:00", [
        "Ovos mexidos com açafrão e folhas de manjericão + chá de hibisco [FÁCIL]",
        "Mix de sementes (chia, linhaça, girassol, abóbora, gergelim e psyllium) com água de coco",
        "Abobrinha recheada com carne moída + mousse de maracujá",
        "Maçã assada com canela [CRISE]",
        "Peixe ao molho de cúrcuma + salada verde",
      ]),
      d(5, "20:00", [
        "Mousse de abacate com cacau 70% e mel (uma colher de café) [FÁCIL]",
        "2 ovos cozidos + sal do Himalaia + chá de erva-doce",
        "Frango assado com ervas + arroz de couve-flor + berinjela assada com azeite",
        "Mix de sementes",
        "Caldo de ossos caseiro com biomassa de banana verde + legumes cozidos [CRISE]",
      ]),
      d(6, "19:30", [
        "Panqueca de farinha de amêndoas com ovo e pimenta-do-reino [FÁCIL]",
        "Kefir de água + maçãs sem casca (quantas quiser)",
        "Sardinhas ao molho de tomate caseiro + salada colorida",
        "Pepino + iogurte de coco + sal",
        "Frango desfiado com legumes no vapor e rabanetes [CRISE]",
      ]),
      d(7, "19:30", [
        "Vitamina de abacate com leite de coco e cúrcuma [FÁCIL]",
        "Chá de camomila + 1 fruta",
        "Frango ao curry com leite de coco + brócolis + couve-flor grelhada",
        "Ovos cozidos com azeite e sal",
        "Peixe assado + legumes grelhados + arroz de couve-flor",
      ]),
    ],
  },
  {
    n: 2,
    title: "Consolidação e variedade anti-inflamatória",
    notes: [
      "Você já passou pelo mais difícil. A partir de agora o cardápio se consolida e a variedade aumenta.",
      "Observe mudanças: sono, dor ao acordar, energia, humor e funcionamento intestinal. Anote no seu diário.",
      "Fermentados e prebióticos entram com mais frequência para nutrir o microbioma intestinal.",
    ],
    days: [
      d(8, "19:00", [
        "Suco verde de aipo + pão de queijo fake",
        "Smoothie de gengibre + meia laranja [FÁCIL]",
        "Salmão grelhado com ervas + quiche de alho-poró com crosta de nozes + mix de folhas",
        "Thermo chai (leite de coco, chá preto, cravo, gengibre, canela, erva-doce e TCM)",
        "Frango ao molho de cúrcuma e gengibre + abobrinha no vapor + salada de rúcula",
      ]),
      d(9, "19:00", [
        "Dois ovos mexidos com ervas + chá verde com erva-doce",
        "Gelatina de ágar-ágar com suco de frutas vermelhas",
        "Peru desfiado com legumes assados (pimentão, berinjela, abobrinha) + arroz de couve-flor",
        "Porção de nozes (2 unidades) + fruta vermelha + chá de hibisco",
        "Omelete de espinafre e tomate seco + salada verde com azeite [CRISE]",
      ]),
      d(10, "19:00", [
        "Açaí puro (sem guaraná, sem leite condensado) com frutas [FÁCIL]",
        "Chá de gengibre + uma pera",
        "Bife grelhado + ovo frito na manteiga ghee + salada colorida",
        "Livre — escute seu corpo",
        "Frango ao curry com leite de coco + macarrão fake (konjac) e brócolis no vapor",
      ]),
      d(11, "19:00", [
        "Omelete de 3 ovos com espinafre, cebola e azeite + chá de hibisco [CRISE]",
        "Vitamina de abacate com leite de coco e cúrcuma",
        "Costela bovina cozida lentamente (caldo de colágeno) + chuchu",
        "Pepino e cenoura com sal e limãozinho + kefir de água",
        "Peixe assado com ervas + mix de vegetais grelhados",
      ]),
      d(12, "19:00", [
        "Panqueca de 2 ovos com farinha de amêndoas + café adoçado com stévia",
        "Chá de camomila + 2 castanhas-do-pará",
        "Coração de galinha ensopado com alho e limãozinho + 1 colher de sopa de batata-baroa + couve refogada",
        "Frutas vermelhas com chia e psyllium",
        "Sopa de abóbora com gengibre e leite de coco [FÁCIL]",
      ]),
      d(13, "19:00", [
        "Suco de aipo, abacaxi, limão, pepino japonês, maçã, psyllium e gengibre [FÁCIL] + 2 ovos mexidos com ervas",
        "Mix de sementes com água de coco",
        "Fígado de boi com ervas + salada completa com ovos cozidos e legumes assados",
        "Livre — escute seu corpo",
        "Peru desfiado ao molho de ervas e alho-poró + legumes assados",
      ]),
      d(14, "19:00", [
        "Ovos mexidos com açafrão, pimenta-do-reino e espinafre + chá verde sem açúcar",
        "Kefir de água + maçã + 2 amêndoas",
        "Frango ao caldo de ossos + legumes cozidos + arroz de couve-flor",
        "Abacate com limãozinho e sal",
        "Sardinha assada + batata-doce + salada verde com sementes",
      ]),
    ],
  },
  {
    n: 3,
    title: "Estabilização, energia e rotina sustentável",
    notes: [
      "Seu corpo já está menos inflamado e seu intestino mais saudável.",
      "Esta semana é sobre sustentabilidade — aprender a comer assim todos os dias, sem sofrimento.",
      "Observe como você se sente e anote no diário. Esta é a base da sua nova rotina.",
    ],
    days: [
      d(15, "18:30", [
        "Bowl de abacate com ovos pochê, sementes e azeite + chá verde",
        "Smoothie verde: espinafre, pepino, gengibre e água de coco",
        "Frango ao limão-siciliano com ervas + abóbora cabotiá assada + salada completa com sementes",
        "Água (300 ml)",
        "Peixe ao curry com leite de coco + brócolis + arroz de couve-flor",
      ]),
      d(16, "18:30", [
        "Farinha de amêndoas com ovo mexido, abacate e tomate seco [FÁCIL]",
        "Kefir de água + frutas vermelhas",
        "Caldo de ossos com frango desfiado + batata-doce + mix de legumes",
        "Água (300 ml)",
        "Salmão grelhado + aspargos ou vagem no vapor + meia porção de macarrão fake (konjac) + rúcula com azeite",
      ]),
      d(17, "18:30", [
        "Vitamina energizante: ½ banana, 1 colher de sopa de abacate, cúrcuma, leite de coco e gengibre + um ovo cozido [FÁCIL]",
        "Palitos de pepino e cenoura com sal e limão + chá de hibisco",
        "Peru ao molho de cúrcuma e coco + batata-doce assada + couve mineira",
        "Água (300 ml)",
        "Frango grelhado + berinjela assada com azeite + salada colorida",
      ]),
      d(18, "18:30", [
        "Panqueca de ½ banana e ovo com frutas vermelhas [FÁCIL]",
        "Chá de camomila + mousse de abacate com cacau 70% [CRISE]",
        "Sardinha ao alho e azeite + cenoura e chuchu na manteiga ghee + salada verde",
        "Água (300 ml)",
        "Frango ao caldo de ossos + legumes variados cozidos",
      ]),
      d(19, "18:30", [
        "Ovos mexidos com cúrcuma, açafrão e tomate + suco de aipo e complementos [FÁCIL]",
        "Smoothie de fruta vermelha com chia e leite de coco",
        "Costela cozida (caldo de colágeno) + cenoura + batata-doce + salada de folhas",
        "Água (300 ml)",
        "Omelete de atum com espinafre e cebola + salada verde [CRISE]",
      ]),
      d(20, "18:30", [
        "Suco verde de aipo e complementos + ovos cozidos com azeite + palitos de pepino",
        "Chá de hibisco ou thermo chai",
        "Frango ao curry com leite de coco e grão-de-bico + brócolis + arroz de couve-flor",
        "Água (300 ml)",
        "Peixe assado com ervas finas + abobrinha e berinjela grelhadas",
      ]),
      d(21, "18:30", [
        "Vitamina da celebração: abacate, frutas vermelhas, leite de coco, cúrcuma e stévia",
        "Mousse de abacate com cacau e mel + chá",
        "Salmão ou sardinha com crosta de ervas + muffin salgado de ovo e legumes + salada completa com sementes e azeite",
        "Água (300 ml)",
        "Coração de galinha com cheiro-verde + legumes coloridos + arroz de couve-flor",
      ], "Mastigue bem, beba água e escute seu corpo."),
    ],
  },
];

export function getDay(n: number): { week: (typeof weeks)[number]; plan: DayPlan } {
  for (const w of weeks) {
    const found = w.days.find((x) => x.day === n);
    if (found) return { week: w, plan: found };
  }
  return { week: weeks[0]!, plan: weeks[0]!.days[0]! };
}

/** Separa a marcação [FÁCIL]/[CRISE] do texto da refeição. */
export function parseMeal(text: string): { text: string; tags: Tag[] } {
  const tags: Tag[] = [];
  const clean = text.replace(/\s*\[(FÁCIL|CRISE|PREPARO)\]/g, (_, t: Tag) => {
    if (!tags.includes(t)) tags.push(t);
    return "";
  });
  return { text: clean.trim(), tags };
}

export const principles = [
  { title: "Elimine o que inflama", text: "Glúten, laticínios convencionais, açúcar refinado, óleos vegetais refinados (soja, milho, girassol, margarinas, maioneses), embutidos, enlatados, ultraprocessados e FODMAPs — carboidratos que o intestino absorve mal e fermentam. Durante os 21 dias, ficam fora do cardápio." },
  { title: "Inclua gorduras boas todos os dias", text: "Azeite extra virgem, abacate, castanhas, chia, linhaça e peixes de águas frias (sardinha, atum), ricos em ômega-3." },
  { title: "Priorize vegetais de todas as cores", text: "Verde-escuros, roxos e laranjas são anti-inflamatórios naturais. Ao menos 3 porções de vegetais da estação por refeição principal, e sucos com aipo, gengibre, pepino japonês, limão, maçã, abacaxi ou kiwi pela manhã." },
  { title: "Cuide do intestino ativamente", text: "Fermentados (kefir de água, kombucha, kimchi, chucrute), fibras prebióticas (biomassa de banana verde, konjac) e caldo de ossos para nutrir e reparar a mucosa intestinal." },
  { title: "Reduza os picos de insulina", text: "Início cetogênico, depois carboidratos de baixo índice glicêmico, refeições com proteína + gordura boa + fibra, e janelas alimentares que dão descanso ao intestino." },
];

export const eatFreely = [
  "Verduras e legumes de todas as cores",
  "Proteínas não processadas: boi, frango, peru, ovo, peixe",
  "Peixes gordos: sardinha, salmão, cavala, atum",
  "Azeite de oliva extra virgem",
  "Abacate (fruta e óleo)",
  "Castanhas, nozes e amêndoas (pequena quantidade)",
  "Fibras de konjac (substituem macarrão e arroz)",
  "Frutas vermelhas: mirtilo, framboesa, morango",
  "Coco (água, óleo, leite)",
  "Temperos: açafrão, gengibre, canela, cúrcuma",
  "Alho e cebola (prebióticos), se tolerar",
  "Kefir de água e kombucha (fermentados)",
];
export const avoid = [
  "Glúten (trigo, aveia, centeio, cevada)",
  "Laticínios convencionais (leite, queijo, iogurte)",
  "Açúcar refinado e adoçantes artificiais",
  "Óleos refinados: soja, milho, girassol, canola",
  "Embutidos: presunto, mortadela, salsicha, linguiça",
  "Ultraprocessados (pacotes, latas, congelados industrializados)",
  "Refrigerantes e sucos industrializados",
  "Margarina e gordura trans",
  "Farinha branca e produtos de padaria",
  "Álcool em qualquer quantidade",
  "Frituras em óleos refinados",
  "Fast food e delivery convencional",
];

export const substitutions: [string, string, string][] = [
  ["Salmão", "Sardinha fresca ou atum", "Mesmo efeito ômega-3, mais acessível"],
  ["Leite de coco", "Leite de amêndoa ou castanha", "Prefira sem açúcar"],
  ["Batata-doce", "Inhame ou batata-baroa", "Todos são anti-inflamatórios"],
  ["Biomassa de banana verde", "Farinha de amêndoas", "Mesma função de carboidrato seguro"],
  ["Kefir de água", "Kombucha natural", "Mesmo efeito prebiótico"],
  ["Grão-de-bico", "Lentilha ou ervilha seca", "Mesma função de fibra prebiótica"],
  ["Frutas vermelhas", "Acerola, caju ou goiaba", "Tropicais ricas em vitamina C"],
  ["Espinafre", "Couve, rúcula ou brócolis", "Verdes anti-inflamatórios"],
  ["Cúrcuma fresca", "Cúrcuma em pó + pimenta-do-reino", "Use o dobro da quantidade"],
  ["Gengibre fresco", "Gengibre em pó", "Use metade da quantidade"],
  ["Castanha-do-pará", "Amêndoas ou nozes", "Manter 30 g"],
  ["Azeite de oliva", "Manteiga ghee", "Não use para frituras profundas"],
  ["Arroz de couve-flor", "Quinoa ou amaranto", "Versões sem contaminação por glúten"],
  ["Mel (1 colher de chá)", "Stévia natural em pó", "Não usar mel em grande quantidade"],
];

export type Recipe = {
  id: string; name: string; time: string; serves: string; tags: Tag[];
  ingredients: string[]; steps: string[]; tip?: string;
};

export const recipes: Recipe[] = [
  { id: "omelete", name: "Omelete anti-inflamatório da Dra. Nadya", time: "10 min", serves: "1 porção", tags: ["FÁCIL"],
    ingredients: ["3 ovos caipiras", "1 punhado de espinafre fresco", "¼ cebola roxa picada", "½ colher (chá) de cúrcuma", "Sal do Himalaia a gosto", "1 colher (sopa) de azeite extra virgem"],
    steps: ["Bata os ovos com a cúrcuma e o sal", "Refogue a cebola no azeite por 2 min", "Adicione o espinafre e mexa até murchar", "Despeje os ovos e deixe firmar em fogo baixo", "Dobre ao meio e sirva imediatamente"],
    tip: "Cúrcuma com ovo é uma combinação poderosa anti-inflamatória." },
  { id: "caldo", name: "Caldo de ossos (base do protocolo)", time: "3 horas", serves: "8 porções", tags: ["PREPARO"],
    ingredients: ["1 kg de ossos de boi (tutano, joelho)", "2 cenouras", "2 talos de aipo", "1 cebola", "4 dentes de alho", "2 colheres de vinagre de maçã", "Sal e ervas a gosto"],
    steps: ["Asse os ossos a 200 °C por 30 min", "Transfira para panela grande com água fria", "Adicione o vinagre e aguarde 30 min", "Cozinhe em fogo baixo por ao menos 3 horas (até 24 h é o ideal)", "Coe e guarde em potes de vidro por até 5 dias"],
    tip: "Rico em colágeno, glicina e minerais que reparam a mucosa intestinal — a base de todo o protocolo." },
  { id: "arroz-couve-flor", name: "Arroz de couve-flor", time: "15 min", serves: "2 porções", tags: ["FÁCIL"],
    ingredients: ["½ cabeça de couve-flor", "1 dente de alho", "1 colher (sopa) de azeite", "Sal e ervas a gosto"],
    steps: ["Corte a couve-flor em floretes", "Pulse no processador ou rale no ralador grosso", "Refogue o alho no azeite por 1 min", "Adicione a couve-flor e misture por 5 min", "Tempere e sirva no lugar do arroz branco"] },
  { id: "vitamina", name: "Vitamina energizante anti-inflamatória", time: "5 min", serves: "1 porção", tags: ["FÁCIL"],
    ingredients: ["½ abacate maduro", "200 ml de leite de coco", "1 colher (chá) de cúrcuma", "1 colher (chá) de gengibre ralado", "1 colher (chá) de mel puro", "Gelo a gosto"],
    steps: ["Bata tudo no liquidificador até ficar cremoso", "Beba em seguida para preservar os nutrientes"],
    tip: "Gengibre e cúrcuma juntos reforçam a ação anti-inflamatória." },
  { id: "salmao", name: "Salmão ao molho de cúrcuma e coco", time: "20 min", serves: "2 porções", tags: [],
    ingredients: ["2 filés de salmão (200 g cada)", "200 ml de leite de coco", "1 colher (chá) de cúrcuma", "1 colher (chá) de gengibre", "2 dentes de alho", "Sal e limãozinho a gosto", "Azeite"],
    steps: ["Tempere o salmão com sal e limãozinho", "Sele no azeite por 3 min de cada lado", "Retire e refogue o alho na mesma frigideira", "Adicione leite de coco, cúrcuma e gengibre", "Reduza por 5 min e despeje sobre o salmão"],
    tip: "Ômega-3 + cúrcuma + gengibre: tríplice ação anti-inflamatória." },
  { id: "sopa-abobora", name: "Sopa de abóbora com gengibre e coco", time: "25 min", serves: "4 porções", tags: ["FÁCIL", "CRISE"],
    ingredients: ["500 g de abóbora cabotiá", "400 ml de leite de coco", "1 pedaço de gengibre (2 cm)", "1 cebola", "2 dentes de alho", "Sal, cúrcuma e pimenta-do-reino", "Azeite"],
    steps: ["Cozinhe a abóbora até ficar macia", "Refogue cebola e alho no azeite", "Bata tudo no liquidificador com o leite de coco", "Volte ao fogo com cúrcuma e gengibre", "Ajuste o sal e sirva quente"],
    tip: "Ideal para dias de crise — quente, nutritiva e sem exigir mastigação intensa." },
  { id: "panqueca", name: "Panqueca de farinha de amêndoas e ovo", time: "10 min", serves: "1 porção", tags: ["FÁCIL"],
    ingredients: ["1 colher (sopa) cheia de farinha de amêndoas", "1 ovo", "½ colher (chá) de canela", "Óleo de coco para untar"],
    steps: ["Coloque a farinha na tigela", "Misture com o ovo e a canela", "Unte a frigideira com óleo de coco", "Despeje porções pequenas e vire quando firmar"] },
  { id: "homus", name: "Homus de grão-de-bico", time: "10 min", serves: "6 porções", tags: ["FÁCIL"],
    ingredients: ["400 g de grão-de-bico cozido", "2 colheres (sopa) de azeite", "2 dentes de alho", "Suco de 1 limãozinho", "1 colher (chá) de cúrcuma", "Sal do Himalaia", "Água até dar consistência"],
    steps: ["Bata tudo no processador até ficar cremoso", "Ajuste sal e limão", "Finalize com azeite e cúrcuma"],
    tip: "Lanche proteico e prebiótico — alimenta as bactérias boas do intestino." },
  { id: "frango-curry", name: "Frango ao curry com leite de coco", time: "25 min", serves: "3 porções", tags: [],
    ingredients: ["500 g de peito de frango em cubos", "400 ml de leite de coco", "2 colheres (chá) de curry", "1 colher (chá) de cúrcuma", "1 cebola picada", "3 dentes de alho", "1 pedaço de gengibre", "Sal e azeite"],
    steps: ["Refogue cebola, alho e gengibre no azeite", "Sele o frango por 5 min", "Adicione curry e cúrcuma", "Despeje o leite de coco e cozinhe 15 min", "Sirva com batata-doce ou arroz de couve-flor"],
    tip: "Cozinhe o frango em lote na semana: nos dias de crise fica pronto em minutos." },
  { id: "sardinha", name: "Sardinha assada com ervas e limãozinho", time: "25 min", serves: "2 porções", tags: [],
    ingredients: ["4 sardinhas frescas limpas", "Suco de 2 limãozinhos", "3 dentes de alho picados", "Salsa, manjericão e alecrim", "Sal do Himalaia e azeite"],
    steps: ["Tempere com limão, alho, ervas e sal", "Regue com azeite", "Asse a 200 °C por 15–18 min", "Sirva com salada verde e batata-doce"],
    tip: "O peixe mais rico em ômega-3 do Brasil — e um dos mais baratos." },
  { id: "mousse", name: "Mousse de abacate com cacau 70%", time: "5 min", serves: "2 porções", tags: ["CRISE"],
    ingredients: ["2 abacates maduros", "3 colheres (sopa) de cacau 100%", "3 colheres (sopa) de mel puro", "1 colher (chá) de baunilha natural", "Pitada de sal"],
    steps: ["Bata tudo até ficar cremoso", "Ajuste o mel ao seu gosto", "Leve à geladeira por 30 min"],
    tip: "Cacau é rico em flavonoides e magnésio — mineral muitas vezes baixo na fibromialgia." },
  { id: "smoothie", name: "Smoothie verde energizante", time: "5 min", serves: "1 porção", tags: ["FÁCIL", "CRISE"],
    ingredients: ["1 punhado de aipo", "Água", "1 cm de gengibre fresco", "200 ml de água de coco", "½ limão sem casca", "1 fatia fina de abacaxi", "1 kiwi", "1 maçã", "½ pepino japonês"],
    steps: ["Bata tudo no liquidificador", "Beba em jejum ou como lanche"],
    tip: "Perfeito para começar dias de crise — hidrata sem exigir energia para preparar." },
  { id: "batata-doce", name: "Batata-doce assada com canela e mel", time: "40 min", serves: "2 porções", tags: ["PREPARO"],
    ingredients: ["2 batatas-doces médias", "1 colher (chá) de canela", "1 colher (sopa) de mel", "1 colher (sopa) de óleo de coco"],
    steps: ["Corte as batatas ao meio no comprimento", "Misture óleo de coco, canela e mel e passe por cima", "Asse a 200 °C por 35–40 min", "Sirva como acompanhamento ou sobremesa"],
    tip: "Rica em fibras: ajuda a estabilizar o açúcar no sangue." },
  { id: "frango-emergencia", name: "Frango desfiado de emergência", time: "15 min", serves: "2 porções", tags: ["CRISE"],
    ingredients: ["300 g de frango cozido e desfiado", "1 colher (chá) de cúrcuma", "1 colher (sopa) de azeite", "Sal e limãozinho", "Ervas a gosto"],
    steps: ["Aqueça o azeite", "Adicione o frango e a cúrcuma", "Mexa por 3 min", "Tempere com sal, limão e ervas"],
    tip: "Use o frango cozido em lote: pronto em minutos nos dias difíceis." },
  { id: "quiche", name: "Quiche de alho-poró com crosta de nozes", time: "45 min", serves: "4 porções", tags: ["PREPARO"],
    ingredients: ["1 xícara de nozes ou castanhas trituradas", "2 colheres (sopa) de azeite", "Pitada de sal", "1 talo de alho-poró fatiado", "2 ovos", "½ xícara de creme de coco", "1 colher (sopa) de levedura nutricional (opcional)", "Sal e pimenta-do-reino"],
    steps: ["Misture nozes, azeite e sal e pressione numa forma pequena", "Asse a base a 180 °C por 5 min", "Refogue o alho-poró no azeite", "Bata ovos, creme de coco, levedura, sal e pimenta", "Espalhe o alho-poró, cubra com os ovos e asse 15–20 min a 180 °C"] },
];

export type ShopItem = { name: string; qty: string };
export const shopping: Record<1 | 2 | 3, ShopItem[]> = {
  1: [
    ["Ovos caipiras", "2 dúzias"], ["Frango (peito ou coxa sem pele)", "1,5 kg"], ["Sardinha fresca ou atum em água", "500 g"],
    ["Tilápia ou outro peixe branco", "500 g"], ["Carne moída", "500 g"], ["Brócolis", "1 cabeça grande"], ["Abobrinha", "4 unidades"],
    ["Berinjela", "2 unidades"], ["Couve", "1 maço"], ["Chuchu", "3 unidades"], ["Aipo", "1 maço grande"], ["Tomate", "1 kg"],
    ["Tomate-cereja", "1 caixinha"], ["Pepino japonês", "400 g"], ["Pepino", "3 unidades"], ["Cebola", "1 kg"], ["Alho", "2 cabeças"],
    ["Limãozinho", "1 saco"], ["Abacate médio", "2 unidades"], ["Coco seco", "3 unidades"], ["Maçã", "20 unidades"],
    ["Frutas vermelhas (morango, mirtilo)", "400 g"], ["Leite de coco em vidro", "2 unidades"], ["Polpa de maracujá", "1 xícara"],
    ["Kefir de água", "300 ml"], ["Chia", "200 g"], ["Linhaça dourada", "200 g"], ["Castanha-do-pará e amêndoas", "50 g cada"],
    ["Massa de konjac", "10 pacotes"], ["Cacau em pó 100%", "200 g"], ["Azeite extra virgem", "500 ml"], ["Canela em pó", "100 g"],
    ["Biomassa de banana verde", "500 g"], ["Psyllium", "200 g"], ["Cúrcuma em pó", "1 pote"], ["Gengibre fresco", "3 pedaços grandes"],
    ["Sal do Himalaia ou marinho", "1 embalagem"], ["Chás: verde, gengibre, camomila, hibisco", "1 caixa cada"],
  ].map(([name, qty]) => ({ name: name!, qty: qty! })),
  2: [
    ["Salmão", "400 g"], ["Atum em água", "3 latas"], ["Peru (filé ou cozido)", "500 g"], ["Frango (peito)", "1 kg"],
    ["Costela bovina para caldo", "500 g"], ["Ovos caipiras", "1 dúzia e meia"], ["Bife bovino", "500 g"], ["Fígado de boi", "3 unidades"],
    ["Coração de galinha", "300 g"], ["Berinjela", "2 unidades"], ["Abóbora", "1 pequena"], ["Chuchu e abobrinha", "3 unidades"],
    ["Cenoura", "500 g"], ["Batata-doce", "500 g"], ["Batata-baroa", "300 g"], ["Espinafre, rúcula e alface", "1 maço de cada"],
    ["Couve", "1 maço"], ["Tomate-cereja e tomate para molho", "500 g + 3 unidades"], ["Pepino", "3 unidades"], ["Kiwi e abacaxi", "1 de cada"],
    ["Frutas vermelhas", "400 g"], ["Açaí puro sem açúcar", "250 g"], ["Abacate", "2 unidades"], ["Leite de coco", "400 ml"],
    ["Água de coco", "1 litro"], ["Aveia sem glúten", "500 g"], ["Grão-de-bico cozido", "300 g"], ["Massa de konjac", "3 pacotes"],
    ["Nozes", "100 g"], ["Alho-poró", "1 talo"], ["Farinha de coco", "300 g"], ["Amêndoas", "100 g"], ["Castanha-do-pará", "100 g"],
    ["Psyllium", "500 g"], ["Azeite extra virgem", "500 ml"], ["Chia e linhaça", "200 g cada"],
    ["Cúrcuma, gengibre, canela, curry", "repor se necessário"], ["Chás variados", "repor se necessário"],
  ].map(([name, qty]) => ({ name: name!, qty: qty! })),
  3: [
    ["Salmão", "500 g"], ["Sardinha fresca", "400 g"], ["Frango (peito e coxa)", "1,5 kg"], ["Carne moída", "400 g"],
    ["Costela bovina para caldo", "500 g"], ["Atum em água", "2 latas"], ["Ovos caipiras", "2 dúzias"], ["Coração de galinha", "300 g"],
    ["Espinafre, rúcula, alface, vagem", "1 maço de cada"], ["Berinjela e abobrinha", "2 de cada"], ["Abobrinha", "3 unidades"],
    ["Brócolis", "1 cabeça"], ["Couve", "1 maço"], ["Cenoura, pepino, chuchu", "500 g cada"], ["Batata-doce", "500 g"],
    ["Batata-baroa", "500 g"], ["Grão-de-bico cozido", "400 g"], ["Kiwi", "3 unidades"], ["Abacate", "5 unidades"], ["Banana", "6 unidades"],
    ["Frutas vermelhas", "500 g"], ["Manga ou fruta tropical", "1 unidade"], ["Leite de coco", "3 unidades"], ["Kefir de água", "300 ml"],
    ["Água de coco", "1 litro"], ["Nozes, amêndoas, castanha-do-pará", "150 g cada"], ["Chia, linhaça, girassol", "200 g cada"],
    ["Cacau em pó 100%", "100 g"], ["Mel puro", "200 ml"], ["Azeite extra virgem", "500 ml"],
    ["Cúrcuma, gengibre, açafrão, canela", "repor se necessário"], ["Tomate seco em azeite", "1 pote"], ["Chás variados", "repor se necessário"],
  ].map(([name, qty]) => ({ name: name!, qty: qty! })),
};
