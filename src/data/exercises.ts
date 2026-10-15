import guide2 from "@/assets/exercise-guide/page-2.asset.json";
import guide3 from "@/assets/exercise-guide/page-3.asset.json";
import guide4 from "@/assets/exercise-guide/page-4.asset.json";
import guide5 from "@/assets/exercise-guide/page-5.asset.json";
import guide6 from "@/assets/exercise-guide/page-6.asset.json";
import guide7 from "@/assets/exercise-guide/page-7.asset.json";
import guide8 from "@/assets/exercise-guide/page-8.asset.json";
import guide9 from "@/assets/exercise-guide/page-9.asset.json";
import guide10 from "@/assets/exercise-guide/page-10.asset.json";
import guide12 from "@/assets/exercise-guide/page-12.asset.json";
import guide13 from "@/assets/exercise-guide/page-13.asset.json";
import guide14 from "@/assets/exercise-guide/page-14.asset.json";
import guide15 from "@/assets/exercise-guide/page-15.asset.json";
import guide16 from "@/assets/exercise-guide/page-16.asset.json";
import guide17 from "@/assets/exercise-guide/page-17.asset.json";
import guide19 from "@/assets/exercise-guide/page-19.asset.json";
import guide20 from "@/assets/exercise-guide/page-20.asset.json";
import guide21 from "@/assets/exercise-guide/page-21.asset.json";
import guide22 from "@/assets/exercise-guide/page-22.asset.json";
import guide23 from "@/assets/exercise-guide/page-23.asset.json";
import guide25 from "@/assets/exercise-guide/page-25.asset.json";
import guide26 from "@/assets/exercise-guide/page-26.asset.json";
import guide27 from "@/assets/exercise-guide/page-27.asset.json";
import guide28 from "@/assets/exercise-guide/page-28.asset.json";
import guide30 from "@/assets/exercise-guide/page-30.asset.json";
import guide31 from "@/assets/exercise-guide/page-31.asset.json";
import pescoco from "@/assets/ex-pescoco.jpg";
import ombros from "@/assets/ex-ombros.jpg";
import bracos from "@/assets/ex-bracos.jpg";
import quadril from "@/assets/ex-quadril.jpg";
import pernas from "@/assets/ex-pernas.jpg";
import cadeira from "@/assets/ex-cadeira.jpg";

export type Exercise = { id: string; name: string; min: number; cat: string; img: string; beginner: boolean; guided: boolean; steps: string[]; code?: string; duration?: string; phase?: string; position?: string; breathing?: string; attention?: string; benefit?: string; sourcePage?: number };

export const legacyExercises: Exercise[] = [
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


// The supplied guide is the browsable catalog; legacy activities remain available in saved plans.
export const exercises: Exercise[] = [
{
  "id": "aq1",
  "code": "AQ1",
  "name": "Respiração diafragmática",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Aquecimento",
  "phase": "Nível base",
  "position": "Deitada ou sentada",
  "beginner": true,
  "guided": true,
  "steps": [
    "Coloque uma mão no peito e outra no abdômen.",
    "Inspire pelo nariz em 4 tempos; o abdômen sobe e o peito permanece quieto.",
    "Segure por 2 tempos.",
    "Expire pela boca em 6 tempos; o abdômen desce.",
    "Repita de 8 a 10 ciclos."
  ],
  "breathing": "Inspire 4, segure 2 e expire 6.",
  "attention": "Se sentir tontura, respire normalmente por 1 minuto antes de retomar.",
  "benefit": "Ativa o parassimpático, reduz a tensão e prepara os músculos.",
  "sourcePage": 2,
  "img": guide2.url
},
{
  "id": "aq2",
  "code": "AQ2",
  "name": "Rotação cervical suave",
  "min": 1.5,
  "duration": "1,5 min",
  "cat": "Aquecimento",
  "phase": "Nível base",
  "position": "Sentada ou em pé",
  "beginner": true,
  "guided": true,
  "steps": [
    "Mantenha os ombros relaxados e baixos.",
    "Gire a cabeça para a direita até uma resistência leve, sem forçar.",
    "Mantenha por 3 segundos.",
    "Volte ao centro devagar.",
    "Faça 8 repetições por lado."
  ],
  "breathing": "Expire ao girar e inspire ao voltar.",
  "attention": "Mantenha o queixo nivelado. Use somente uma amplitude confortável.",
  "benefit": "Mobiliza a cervical e reduz tensão na região dos trapézios.",
  "sourcePage": 3,
  "img": guide3.url
},
{
  "id": "aq3",
  "code": "AQ3",
  "name": "Mobilização de ombros",
  "min": 1.5,
  "duration": "1,5 min",
  "cat": "Aquecimento",
  "phase": "Nível base",
  "position": "Sentada ou em pé",
  "beginner": true,
  "guided": true,
  "steps": [
    "Deixe os braços ao lado do corpo.",
    "Eleve os ombros em direção às orelhas.",
    "Gire para trás em um círculo completo.",
    "Desça e relaxe.",
    "Faça 10 círculos para trás e 5 para frente."
  ],
  "breathing": "Respire continuamente, sem prender o ar.",
  "attention": "Estalos sem dor podem ocorrer. Se houver dor aguda, reduza a amplitude.",
  "benefit": "Reduz a tensão dos trapézios e melhora a mobilidade escapular.",
  "sourcePage": 4,
  "img": guide4.url
},
{
  "id": "aq4",
  "code": "AQ4",
  "name": "Mobilização de tornozelos",
  "min": 1.0,
  "duration": "1 min",
  "cat": "Aquecimento",
  "phase": "Nível base",
  "position": "Sentada em cadeira",
  "beginner": true,
  "guided": true,
  "steps": [
    "Sente-se com os pés apoiados.",
    "Eleve um pé levemente.",
    "Faça 8 círculos com o tornozelo para cada lado.",
    "Apoie o pé e repita do outro lado."
  ],
  "breathing": "Respire normalmente.",
  "attention": "Se houver formigamento ou dor, reduza o movimento e converse com seu médico.",
  "benefit": "Estimula a circulação e prepara os tornozelos.",
  "sourcePage": 5,
  "img": guide5.url
},
{
  "id": "f1-1",
  "code": "F1.1",
  "name": "Gato e vaca",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 1",
  "position": "Quatro apoios",
  "beginner": true,
  "guided": true,
  "steps": [
    "Posicione as mãos sob os ombros e os joelhos sob o quadril.",
    "Ao inspirar, deixe a barriga descer e olhe levemente à frente.",
    "Ao expirar, arredonde as costas e recolha o queixo.",
    "Mova-se lenta e continuamente.",
    "Faça 10 repetições completas."
  ],
  "breathing": "Inspire na extensão e expire ao arredondar.",
  "attention": "Use uma almofada sob os joelhos. Se os punhos doerem, apoie os antebraços.",
  "benefit": "Mobiliza a coluna e favorece o controle do centro do corpo.",
  "sourcePage": 6,
  "img": guide6.url
},
{
  "id": "f1-2",
  "code": "F1.2",
  "name": "Inclinação pélvica deitada",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 1",
  "position": "Deitada de costas",
  "beginner": true,
  "guided": true,
  "steps": [
    "Deite-se com joelhos dobrados e pés apoiados.",
    "Inspire para preparar.",
    "Ao expirar, pressione suavemente a lombar contra o tapete por 3 segundos.",
    "Ao inspirar, volte à posição neutra.",
    "Faça 12 repetições."
  ],
  "breathing": "Expire ao pressionar e inspire ao soltar.",
  "attention": "O movimento é pequeno. Se houver dor lombar aguda, reduza ainda mais.",
  "benefit": "Ativa músculos abdominais profundos e estabiliza a pelve.",
  "sourcePage": 7,
  "img": guide7.url
},
{
  "id": "f1-3",
  "code": "F1.3",
  "name": "Alongamento do piriforme",
  "min": 4.0,
  "duration": "2 min por lado",
  "cat": "Mobilidade",
  "phase": "Fase 1",
  "position": "Deitada de costas",
  "beginner": true,
  "guided": true,
  "steps": [
    "Deite-se com os joelhos dobrados.",
    "Apoie o tornozelo direito sobre a coxa esquerda.",
    "Segure atrás da coxa esquerda.",
    "Aproxime as pernas lentamente do peito.",
    "Mantenha 30 segundos, solte devagar e troque o lado."
  ],
  "breathing": "Expire ao aproximar; depois respire normalmente.",
  "attention": "Se surgir formigamento no pé ou na perna, pare e procure orientação.",
  "benefit": "Alonga a região do piriforme, quadril e parte posterior da coxa.",
  "sourcePage": 8,
  "img": guide8.url
},
{
  "id": "f1-4",
  "code": "F1.4",
  "name": "Elevação de joelho sentada",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 1",
  "position": "Sentada em cadeira",
  "beginner": true,
  "guided": true,
  "steps": [
    "Apoie as costas e mantenha os pés no chão.",
    "Inspire.",
    "Ao expirar, eleve um joelho até uma altura confortável.",
    "Mantenha por 2 segundos.",
    "Desça ao inspirar. Faça 10 por lado, alternando."
  ],
  "breathing": "Expire ao elevar e inspire ao descer.",
  "attention": "Se houver tensão no abdômen ou na lombar, diminua a altura.",
  "benefit": "Ativa flexores do quadril e abdômen de forma controlada.",
  "sourcePage": 9,
  "img": guide9.url
},
{
  "id": "f1-5",
  "code": "F1.5",
  "name": "Alongamento lateral do pescoço",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 1",
  "position": "Sentada",
  "beginner": true,
  "guided": true,
  "steps": [
    "Sente-se com a coluna ereta.",
    "Incline a cabeça suavemente para a direita.",
    "Apoie a mão direita sobre a cabeça sem puxar.",
    "Mantenha 30 segundos e troque o lado."
  ],
  "breathing": "Respire fundo e relaxe um pouco mais a cada expiração.",
  "attention": "Não puxe a cabeça e não incline o tronco. O peso do braço é suficiente.",
  "benefit": "Alonga a musculatura lateral do pescoço.",
  "sourcePage": 10,
  "img": guide10.url
},
{
  "id": "f2-1",
  "code": "F2.1",
  "name": "Ponte do quadril",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Mobilidade",
  "phase": "Fase 2",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Deite-se com joelhos dobrados e pés na largura do quadril.",
    "Inspire.",
    "Ao expirar, contraia os glúteos e eleve o quadril.",
    "Mantenha de 3 a 5 segundos.",
    "Desça lentamente. Faça de 10 a 12 repetições."
  ],
  "breathing": "Expire ao subir e inspire ao descer.",
  "attention": "Se a lombar doer, reduza a altura. Não hiperestenda o quadril.",
  "benefit": "Fortalece glúteos e estabilizadores da pelve.",
  "sourcePage": 12,
  "img": guide12.url
},
{
  "id": "f2-2",
  "code": "F2.2",
  "name": "Abdominal suave",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 2",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Mantenha os joelhos dobrados e faça primeiro a inclinação pélvica.",
    "Inspire.",
    "Ao expirar, eleve somente até as escápulas saírem do tapete.",
    "Mantenha 2 segundos.",
    "Desça devagar. Faça 10 repetições."
  ],
  "breathing": "Expire ao subir e inspire ao descer.",
  "attention": "As mãos ficam ao lado da cabeça, nunca puxando o pescoço. Se doer, pare.",
  "benefit": "Fortalece o abdômen sem exigir grande amplitude.",
  "sourcePage": 13,
  "img": guide13.url
},
{
  "id": "f2-3",
  "code": "F2.3",
  "name": "Flexão de parede",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Mobilidade",
  "phase": "Fase 2",
  "position": "Em pé diante da parede",
  "beginner": false,
  "guided": true,
  "steps": [
    "Fique a aproximadamente um braço da parede.",
    "Apoie as mãos na altura dos ombros.",
    "Inspire.",
    "Ao expirar, dobre os cotovelos e aproxime o peito da parede.",
    "Empurre de volta sem travar os cotovelos. Faça 10 a 12 repetições."
  ],
  "breathing": "Expire ao aproximar e inspire ao empurrar.",
  "attention": "Mantenha o corpo alinhado. Aproxime-se da parede para facilitar.",
  "benefit": "Fortalece braços e peito com baixo impacto.",
  "sourcePage": 14,
  "img": guide14.url
},
{
  "id": "f2-4",
  "code": "F2.4",
  "name": "Rotação de tronco sentada",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 2",
  "position": "Sentada em cadeira",
  "beginner": false,
  "guided": true,
  "steps": [
    "Sente-se ereta com os pés no chão.",
    "Cruze os braços sobre o peito ou apoie as mãos nas coxas.",
    "Inspire.",
    "Ao expirar, gire o tronco para a direita.",
    "Mantenha 3 segundos e volte. Faça 8 por lado."
  ],
  "breathing": "Expire ao girar e inspire ao voltar.",
  "attention": "O movimento parte do tronco. Mantenha os quadris voltados para frente.",
  "benefit": "Mobiliza a coluna torácica e reduz tensão entre as escápulas.",
  "sourcePage": 15,
  "img": guide15.url
},
{
  "id": "f2-5",
  "code": "F2.5",
  "name": "Equilíbrio unipodal com apoio",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Mobilidade",
  "phase": "Fase 2",
  "position": "Em pé ao lado da cadeira",
  "beginner": false,
  "guided": true,
  "steps": [
    "Apoie levemente uma mão no encosto.",
    "Inspire.",
    "Ao expirar, eleve um pé poucos centímetros.",
    "Mantenha de 5 a 10 segundos.",
    "Apoie o pé e repita. Faça 8 por lado."
  ],
  "breathing": "Respire naturalmente.",
  "attention": "Se houver tontura, mantenha os dois pés no chão e apenas transfira o peso.",
  "benefit": "Treina equilíbrio e estabilidade do tornozelo e do quadril.",
  "sourcePage": 16,
  "img": guide16.url
},
{
  "id": "f2-6",
  "code": "F2.6",
  "name": "Agachamento assistido",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Mobilidade",
  "phase": "Fase 2",
  "position": "Em pé diante de uma cadeira",
  "beginner": false,
  "guided": true,
  "steps": [
    "Fique com os pés na largura do quadril e a cadeira atrás.",
    "Estenda os braços à frente.",
    "Inspire.",
    "Ao expirar, leve o quadril para trás como se fosse sentar.",
    "Suba sem travar os joelhos. Faça de 8 a 10 repetições."
  ],
  "breathing": "Expire ao descer e inspire ao subir.",
  "attention": "Mantenha os joelhos alinhados aos pés. Se doer, reduza a descida.",
  "benefit": "Fortalece quadríceps e glúteos para tarefas diárias.",
  "sourcePage": 17,
  "img": guide17.url
},
{
  "id": "f3-1",
  "code": "F3.1",
  "name": "Remada com faixa elástica",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Força leve",
  "phase": "Fase 3",
  "position": "Sentada",
  "beginner": false,
  "guided": true,
  "steps": [
    "Sente-se ereta com a faixa presa nos pés ou em ponto fixo.",
    "Segure as pontas com os cotovelos junto ao corpo.",
    "Inspire.",
    "Ao expirar, puxe as mãos em direção aos quadris.",
    "Mantenha 2 segundos e solte devagar. Faça 10 a 12."
  ],
  "breathing": "Expire ao puxar e inspire ao soltar.",
  "attention": "Mantenha os ombros baixos. Sem faixa, simule o movimento.",
  "benefit": "Fortalece a musculatura das costas e favorece a postura.",
  "sourcePage": 19,
  "img": guide19.url
},
{
  "id": "f3-2",
  "code": "F3.2",
  "name": "Prancha frontal de joelhos",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Força leve",
  "phase": "Fase 3",
  "position": "Antebraços e joelhos no tapete",
  "beginner": false,
  "guided": true,
  "steps": [
    "Apoie os cotovelos sob os ombros.",
    "Mantenha os joelhos no chão e alinhe joelhos, quadril e ombros.",
    "Não deixe o quadril cair ou subir demais.",
    "Mantenha de 10 a 20 segundos.",
    "Descanse 20 segundos. Faça de 4 a 5 séries."
  ],
  "breathing": "Respire normalmente durante toda a prancha.",
  "attention": "Se houver tremor excessivo ou dor lombar, reduza o tempo.",
  "benefit": "Ativa o centro do corpo e ajuda a proteger a lombar.",
  "sourcePage": 20,
  "img": guide20.url
},
{
  "id": "f3-3",
  "code": "F3.3",
  "name": "Elevação lateral da perna",
  "min": 6.0,
  "duration": "3 min por lado",
  "cat": "Força leve",
  "phase": "Fase 3",
  "position": "Deitada de lado",
  "beginner": false,
  "guided": true,
  "steps": [
    "Alinhe quadris e ombros.",
    "Inspire.",
    "Ao expirar, eleve a perna de cima até a altura do quadril.",
    "Mantenha 2 segundos e desça devagar.",
    "Faça de 10 a 12 por lado."
  ],
  "breathing": "Expire ao elevar e inspire ao descer.",
  "attention": "Não eleve acima do quadril e não deixe o tronco acompanhar.",
  "benefit": "Fortalece o glúteo médio e melhora a estabilidade.",
  "sourcePage": 21,
  "img": guide21.url
},
{
  "id": "f3-4",
  "code": "F3.4",
  "name": "Mini-agachamento com pausa",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Força leve",
  "phase": "Fase 3",
  "position": "Em pé com apoio lateral",
  "beginner": false,
  "guided": true,
  "steps": [
    "Apoie levemente uma mão na cadeira.",
    "Inspire.",
    "Ao expirar, faça uma descida curta e controlada.",
    "Mantenha por até 5 segundos.",
    "Suba devagar. Faça de 8 a 10 repetições."
  ],
  "breathing": "Expire ao descer, inspire na pausa e expire ao subir.",
  "attention": "Se a pausa for intensa, retire-a e mantenha o movimento contínuo.",
  "benefit": "Treina controle dos quadríceps para tarefas como descer escadas.",
  "sourcePage": 22,
  "img": guide22.url
},
{
  "id": "f3-5",
  "code": "F3.5",
  "name": "Marcha estacionária",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Força leve",
  "phase": "Fase 3",
  "position": "Em pé com apoio lateral",
  "beginner": false,
  "guided": true,
  "steps": [
    "Apoie levemente uma mão na cadeira.",
    "Marche no lugar elevando os joelhos até uma altura confortável.",
    "Use ritmo lento: 2 segundos para subir e 2 para descer.",
    "Faça 30 elevações no total, 15 de cada lado."
  ],
  "breathing": "Expire a cada elevação e inspire ao descer.",
  "attention": "Se o joelho doer, diminua a altura e a velocidade.",
  "benefit": "Movimento aeróbico leve, com estímulo circulatório.",
  "sourcePage": 23,
  "img": guide23.url
},
{
  "id": "cr1",
  "code": "CR1",
  "name": "Respiração 4 2 6",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Movimento mínimo",
  "phase": "Crise",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Deite-se confortavelmente com os joelhos dobrados.",
    "Coloque as mãos sobre o abdômen.",
    "Inspire pelo nariz contando 4.",
    "Faça uma pausa de 2 tempos.",
    "Expire pela boca contando 6. Repita de 8 a 10 vezes."
  ],
  "breathing": "4 tempos para inspirar, 2 de pausa e 6 para expirar.",
  "attention": "Se sentir tontura, volte à respiração natural por 1 minuto.",
  "benefit": "Favorece relaxamento e reduz a tensão corporal.",
  "sourcePage": 25,
  "img": guide25.url
},
{
  "id": "cr2",
  "code": "CR2",
  "name": "Mobilização dos pés deitada",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Movimento mínimo",
  "phase": "Crise",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Mantenha as pernas estendidas ou levemente dobradas.",
    "Flexione e estenda os pés lentamente 5 vezes.",
    "Faça uma pausa.",
    "Faça 5 círculos com os tornozelos para cada lado."
  ],
  "breathing": "Respire normalmente e não prenda o ar.",
  "attention": "Se houver formigamento ou dor nas pernas, pare.",
  "benefit": "Mantém um movimento mínimo e estimula a circulação.",
  "sourcePage": 26,
  "img": guide26.url
},
{
  "id": "cr3",
  "code": "CR3",
  "name": "Abraço de joelho",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Movimento mínimo",
  "phase": "Crise",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Deite-se com os joelhos dobrados.",
    "Aproxime um joelho do peito com as duas mãos.",
    "Mantenha de 20 a 30 segundos e respire.",
    "Solte e repita do outro lado.",
    "Se for confortável, abrace os dois joelhos por 20 segundos."
  ],
  "breathing": "Expire ao aproximar e depois respire naturalmente.",
  "attention": "Se houver dor no quadril ou na lombar, diminua a amplitude.",
  "benefit": "Mobiliza suavemente a lombar e o quadril.",
  "sourcePage": 27,
  "img": guide27.url
},
{
  "id": "cr4",
  "code": "CR4",
  "name": "Postura da criança modificada",
  "min": 2.0,
  "duration": "2 min",
  "cat": "Movimento mínimo",
  "phase": "Crise",
  "position": "Quatro apoios",
  "beginner": false,
  "guided": true,
  "steps": [
    "A partir de quatro apoios, leve o quadril em direção aos calcanhares.",
    "Mantenha os braços à frente ou ao lado do corpo.",
    "Use uma almofada sob o tronco se precisar.",
    "Respire lenta e profundamente por 1 a 2 minutos."
  ],
  "breathing": "Expire lentamente e deixe o corpo relaxar.",
  "attention": "Se os joelhos incomodarem, use almofada entre coxa e panturrilha.",
  "benefit": "Alonga suavemente a coluna e favorece relaxamento.",
  "sourcePage": 28,
  "img": guide28.url
},
{
  "id": "dq1",
  "code": "DQ1",
  "name": "Alongamento de isquiotibiais",
  "min": 4.0,
  "duration": "2 min por lado",
  "cat": "Desaquecimento",
  "phase": "Desaquecimento",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Deite-se com um joelho dobrado e o pé apoiado.",
    "Eleve a outra perna segurando atrás da coxa.",
    "Mantenha o joelho levemente flexionado.",
    "Permaneça de 30 a 60 segundos e troque o lado."
  ],
  "breathing": "Expire ao aproximar a perna e depois respire normalmente.",
  "attention": "A perna não precisa ficar totalmente estendida. Vá apenas até a resistência.",
  "benefit": "Alonga a cadeia posterior e ajuda na recuperação.",
  "sourcePage": 30,
  "img": guide30.url
},
{
  "id": "dq2",
  "code": "DQ2",
  "name": "Savasana ativo",
  "min": 3.0,
  "duration": "3 min",
  "cat": "Desaquecimento",
  "phase": "Desaquecimento",
  "position": "Deitada de costas",
  "beginner": false,
  "guided": true,
  "steps": [
    "Deite-se com pernas estendidas e braços ao lado, palmas para cima.",
    "Respire naturalmente.",
    "Percorra mentalmente cabeça, tronco, pernas e pés.",
    "A cada expiração, permita que a região relaxe.",
    "Mantenha a consciência e encerre devagar."
  ],
  "breathing": "Respiração natural, suave e sem controle rígido.",
  "attention": "Abra os olhos por um momento se sentir que vai dormir.",
  "benefit": "Integra a sessão e facilita a transição para o repouso.",
  "sourcePage": 31,
  "img": guide31.url
}
];
export const allExercises = [...exercises, ...legacyExercises];
export const exerciseCategories = ["Aquecimento", "Mobilidade", "Força leve", "Movimento mínimo", "Desaquecimento"] as const;
