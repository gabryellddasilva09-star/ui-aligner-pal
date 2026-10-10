// Conteúdo educativo geral sobre fibromialgia. Não substitui orientação profissional.
export type KnowledgeTone = "primary" | "good" | "warn" | "alert" | "blue";
export type KnowledgeQuestion = { q: string; a: string };
export type KnowledgeTopic = {
  id: string;
  title: string;
  summary: string;
  icon: "info" | "brain" | "activity" | "stethoscope" | "pill" | "move" | "food" | "moon" | "heart" | "home" | "alert" | "app";
  tone: KnowledgeTone;
  image?: "body" | "care" | "doctor";
  questions: KnowledgeQuestion[];
};

export const quickFacts = [
  { value: "2 a 4%", label: "da população vive com fibromialgia", tone: "primary" as const },
  { value: "Real", label: "a dor existe, mesmo sem aparecer em exames", tone: "alert" as const },
  { value: "Tratável", label: "com cuidados combinados, há melhora", tone: "good" as const },
];

export const knowledgeTopics: KnowledgeTopic[] = [
  {
    id: "o-que-e", title: "O que é a fibromialgia", summary: "Entenda a condição de um jeito simples.", icon: "info", tone: "primary",
    questions: [
      { q: "O que é fibromialgia?", a: "É uma condição crônica que causa dor espalhada pelo corpo, acompanhada muitas vezes de cansaço, sono que não descansa, dificuldade de memória e alterações de humor. Ela não deforma as articulações e não destrói músculos." },
      { q: "A dor é real ou é psicológica?", a: "A dor é real. Na fibromialgia, o sistema nervoso fica mais sensível e amplifica os sinais de dor. Por isso, estímulos que antes eram leves podem doer bastante. Emoções podem influenciar, como em qualquer dor, mas não significa que seja 'coisa da cabeça'." },
      { q: "Fibromialgia é uma doença reumática?", a: "Ela é acompanhada principalmente por reumatologistas, mas hoje é entendida como uma alteração no processamento da dor pelo sistema nervoso (chamada sensibilização central)." },
      { q: "Quem pode ter fibromialgia?", a: "Qualquer pessoa, mas é mais comum em mulheres entre 30 e 60 anos. Também pode aparecer em homens, idosos e até em jovens." },
      { q: "É contagiosa?", a: "Não. A fibromialgia não passa de uma pessoa para outra." },
    ],
  },
  {
    id: "causas", title: "Por que ela acontece", summary: "O que se sabe sobre as causas.", icon: "brain", tone: "blue", image: "body",
    questions: [
      { q: "Qual é a causa da fibromialgia?", a: "Não existe uma causa única. Ela parece surgir da combinação de fatores: tendência genética, alterações na forma como o cérebro e a medula processam a dor, sono de má qualidade e situações de estresse físico ou emocional." },
      { q: "Algum acontecimento pode desencadear?", a: "Sim, em algumas pessoas os sintomas começam após uma infecção, cirurgia, acidente, luto ou período de estresse intenso. Em outras, surgem aos poucos, sem um motivo claro." },
      { q: "É hereditária?", a: "Existe uma tendência familiar: ter parentes com fibromialgia aumenta a chance, mas não significa que você vai ter ou passar para seus filhos." },
      { q: "Eu fiz algo de errado para ter isso?", a: "Não. Ninguém causa a própria fibromialgia. Você não tem culpa pelos sintomas." },
    ],
  },
  {
    id: "sintomas", title: "Sintomas", summary: "Dor, cansaço, sono e muito mais.", icon: "activity", tone: "alert",
    questions: [
      { q: "Quais são os sintomas mais comuns?", a: "Dor espalhada pelo corpo por mais de 3 meses, cansaço intenso, sono que não renova, rigidez ao acordar, dificuldade de concentração e memória (a 'névoa mental'), dor de cabeça, formigamentos, sensibilidade a frio, barulho e luz, ansiedade e tristeza." },
      { q: "O que é a 'névoa mental' (fibro fog)?", a: "É a sensação de mente lenta: esquecer palavras, perder o foco ou ter dificuldade de lembrar compromissos. Ela costuma piorar com cansaço e sono ruim, e melhora quando esses pontos são cuidados." },
      { q: "Os sintomas mudam de um dia para outro?", a: "Sim, é muito comum. Há dias melhores e dias mais difíceis. Registrar como você se sente ajuda a perceber o que influencia." },
      { q: "O que é uma crise?", a: "É um período em que os sintomas pioram por alguns dias. Pode acontecer depois de esforço excessivo, noites mal dormidas, frio, estresse ou infecções. Ela passa, e há formas de atravessá-la com mais conforto." },
      { q: "Também tenho intestino irritável, enxaqueca ou bexiga sensível. Tem relação?", a: "Pode ter. Essas condições aparecem com frequência junto da fibromialgia, porque também envolvem maior sensibilidade do sistema nervoso. Conte ao seu profissional." },
    ],
  },
  {
    id: "diagnostico", title: "Diagnóstico", summary: "Como o médico identifica.", icon: "stethoscope", tone: "primary", image: "doctor",
    questions: [
      { q: "Existe exame que mostra a fibromialgia?", a: "Não existe um exame de sangue ou imagem que confirme. O diagnóstico é clínico: o médico conversa com você, examina e avalia a dor espalhada, o cansaço, o sono e outros sintomas." },
      { q: "Então para que servem os exames?", a: "Para descartar outras condições com sintomas parecidos, como problemas de tireoide, falta de vitaminas, anemia ou doenças inflamatórias." },
      { q: "Quem faz o diagnóstico?", a: "Geralmente o reumatologista, mas clínicos gerais, neurologistas e outros médicos também podem diagnosticar." },
      { q: "Por que demorou tanto para eu ser diagnosticada?", a: "Infelizmente é comum. Como os exames costumam vir normais, muitas pessoas passam anos procurando respostas. Ter o diagnóstico é um passo importante para cuidar do jeito certo." },
    ],
  },
  {
    id: "tratamento", title: "Tratamento", summary: "O cuidado que mais funciona.", icon: "pill", tone: "good",
    questions: [
      { q: "Fibromialgia tem cura?", a: "Ainda não existe cura definitiva, mas existe tratamento. Muitas pessoas conseguem reduzir bastante os sintomas e viver bem, com rotina, trabalho e lazer." },
      { q: "Qual é o melhor tratamento?", a: "O que mais funciona é a combinação de cuidados: atividade física leve e regular, cuidado com o sono, manejo do estresse, informação sobre a condição e, quando indicado, medicamentos." },
      { q: "Preciso tomar remédio para sempre?", a: "Não necessariamente. Os medicamentos são uma parte do cuidado e são ajustados pelo médico conforme sua resposta. Nunca inicie, pare ou mude doses por conta própria." },
      { q: "Analgésicos comuns resolvem?", a: "Costumam ajudar pouco na fibromialgia, porque a dor vem da sensibilidade do sistema nervoso. Converse com seu médico antes de usar qualquer remédio com frequência." },
      { q: "Terapias complementares ajudam?", a: "Algumas pessoas se beneficiam de acupuntura, hidroterapia, massagem leve, yoga ou tai chi. Elas complementam o tratamento, sem substituí-lo." },
      { q: "Psicoterapia faz parte do tratamento?", a: "Sim. A terapia ajuda a lidar com a dor, o estresse e as emoções, e tem bons resultados para quem vive com fibromialgia. Buscar ajuda não significa que a dor seja 'emocional'." },
    ],
  },
  {
    id: "movimento", title: "Atividade física", summary: "Movimento é remédio, no seu ritmo.", icon: "move", tone: "good", image: "care",
    questions: [
      { q: "Posso fazer exercício com dor?", a: "Sim, e é um dos cuidados que mais ajudam. O segredo é começar bem leve, aumentar devagar e respeitar seu corpo. Um pouco de desconforto pode acontecer no início e tende a diminuir." },
      { q: "Qual exercício é melhor?", a: "Caminhada, hidroginástica, alongamentos suaves, bicicleta leve, yoga e pilates adaptados costumam ser boas opções. O melhor é aquele que você consegue manter com prazer." },
      { q: "Quanto devo fazer?", a: "Comece com poucos minutos por dia e vá aumentando aos poucos. Pequenos passos também são progresso. Seu profissional pode orientar o ritmo ideal para você." },
      { q: "E nos dias de crise?", a: "Reduza a intensidade, mas evite ficar totalmente parada. Respiração, alongamentos suaves e pequenas caminhadas pela casa já ajudam." },
    ],
  },
  {
    id: "alimentacao", title: "Alimentação", summary: "O que comer para se sentir melhor.", icon: "food", tone: "warn",
    questions: [
      { q: "Existe dieta para fibromialgia?", a: "Não há uma dieta que cure, mas uma alimentação anti-inflamatória — com verduras, frutas, peixes, azeite, sementes e grãos integrais — pode ajudar no bem-estar, na energia e no peso." },
      { q: "O que é bom evitar?", a: "Excesso de açúcar, ultraprocessados, frituras, embutidos e álcool. Algumas pessoas também se sentem pior com muita cafeína." },
      { q: "Beber água ajuda?", a: "Sim. Manter-se hidratada ajuda na disposição e no funcionamento do corpo. Ter um copo sempre por perto facilita." },
      { q: "Devo tomar suplementos?", a: "Só com orientação. Às vezes o médico pede exames e indica, por exemplo, vitamina D ou magnésio, se houver falta." },
    ],
  },
  {
    id: "sono", title: "Sono e cansaço", summary: "Dormir melhor para doer menos.", icon: "moon", tone: "blue",
    questions: [
      { q: "Por que acordo cansada mesmo dormindo?", a: "Na fibromialgia, o sono profundo costuma ser mais leve e interrompido, e o corpo não descansa por completo. Isso aumenta a dor e o cansaço no dia seguinte." },
      { q: "O que ajuda a dormir melhor?", a: "Horários regulares para deitar e acordar, quarto escuro e silencioso, evitar telas e café à noite, jantar leve e uma rotina calma antes de dormir, como respiração ou leitura." },
      { q: "Posso cochilar durante o dia?", a: "Cochilos curtos (até 20–30 minutos) podem ajudar. Cochilos longos podem atrapalhar o sono da noite." },
      { q: "Ronco ou paradas na respiração importam?", a: "Sim. Distúrbios como apneia pioram a fibromialgia. Se alguém notar que você ronca muito ou para de respirar, conte ao médico." },
    ],
  },
  {
    id: "emocoes", title: "Emoções e estresse", summary: "Cuidar da mente também alivia.", icon: "heart", tone: "alert",
    questions: [
      { q: "Por que fico mais ansiosa ou triste?", a: "Conviver com dor todos os dias cansa. Ansiedade e tristeza são comuns e também deixam a dor mais intensa. Cuidar das emoções faz parte do tratamento." },
      { q: "O estresse piora a dor?", a: "Sim, o estresse deixa o sistema nervoso em alerta e pode aumentar os sintomas. Pausas, respiração, meditação e atividades prazerosas ajudam a acalmar." },
      { q: "Como explicar para minha família?", a: "Diga que é uma condição real, que varia de dia para dia, e que nem sempre aparece por fora. Pedir ajuda em tarefas e combinar pausas é cuidado, não fraqueza." },
      { q: "Quando procurar ajuda urgente?", a: "Se tiver pensamentos de se machucar ou de que a vida não vale a pena, procure ajuda imediatamente. No Brasil, o CVV atende 24 horas pelo número 188, gratuitamente." },
    ],
  },
  {
    id: "dia-a-dia", title: "Vida no dia a dia", summary: "Trabalho, casa e energia.", icon: "home", tone: "warn",
    questions: [
      { q: "Como poupar energia?", a: "Divida tarefas grandes em partes, alterne atividades leves e pesadas, faça pausas antes de chegar ao limite e planeje o dia priorizando o que importa mais." },
      { q: "O frio piora?", a: "Muitas pessoas sentem mais dor no frio e com mudanças de clima. Agasalhar-se, banhos mornos e bolsas de calor podem trazer conforto." },
      { q: "Posso continuar trabalhando?", a: "A maioria das pessoas continua trabalhando, às vezes com adaptações como pausas, cadeira confortável ou ajuste de horários. Converse com seu médico e empregador quando precisar." },
      { q: "Tenho direitos trabalhistas?", a: "Em alguns casos, quando a condição limita o trabalho, pode haver direito a afastamento ou benefícios, após avaliação médica e pericial. Um assistente social ou advogado pode orientar." },
    ],
  },
  {
    id: "alerta", title: "Quando procurar o médico", summary: "Sinais que merecem atenção.", icon: "alert", tone: "alert",
    questions: [
      { q: "Quais sinais não são típicos da fibromialgia?", a: "Febre, perda de peso sem explicação, inchaço ou vermelhidão nas articulações, fraqueza súbita, dor no peito ou falta de ar. Nesses casos, procure atendimento médico." },
      { q: "Minha dor mudou muito. O que faço?", a: "Se a dor ficou diferente, muito mais forte ou não melhora como antes, converse com seu profissional. Não espere a próxima consulta se estiver preocupada." },
    ],
  },
];

export const appHelps = [
  { title: "Registro diário", text: "Conte como está seu humor, sono, dor e cansaço em poucos toques.", to: "/" as const, icon: "heart" as const },
  { title: "Movimento no seu ritmo", text: "Atividades leves pensadas para respeitar seus dias bons e difíceis.", to: "/plano" as const, icon: "move" as const },
  { title: "Alimentação anti-inflamatória", text: "Cardápio de 21 dias, receitas e lista de compras prontas.", to: "/alimentacao" as const, icon: "food" as const },
  { title: "Respiração e relaxamento", text: "Pausas guiadas com sons suaves para acalmar o corpo.", to: "/relaxamento" as const, icon: "moon" as const },
  { title: "Sua evolução", text: "Veja como você está ao longo das semanas e leve isso à consulta.", to: "/evolucao" as const, icon: "activity" as const },
  { title: "Seu acompanhamento", text: "Informações da sua profissional sempre por perto.", to: "/profissional" as const, icon: "stethoscope" as const },
];
