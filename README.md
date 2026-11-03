# VivaLeve — Acompanhamento da Fibromialgia

Aplicativo acolhedor para quem vive com fibromialgia, idealizado pela **Dra. Nadya Kazzaz** (cardiologista que também convive com o diagnóstico). Foco: transmitir a sensação de "eu estou sendo acompanhada", com visual leve, tons lilás, cards arredondados e prioridade para o celular (sem parecer um app de tarefas, diário ou formulário médico).

> Todos os registros pertencem somente à paciente. Nada é enviado à doutora — ela aparece apenas como idealizadora do app.

---

## Telas

| Tela | Rota | O que tem |
|---|---|---|
| Login | `/login` | Entrada com e-mail e senha; sem cadastro público |
| Início (Home) | `/` | Check-in diário, Progresso Diário, atalhos, modo crise, sino de notificações, botão de perfil |
| Meu plano de movimento | `/plano` | Semana Domingo–Sábado com datas, hoje selecionado, progresso zerado a cada dia |
| Exercícios | `/exercicios` | Catálogo dos 26 exercícios do guia em PDF, com filtros por categoria e modal com passo a passo |
| Alimentação (Receitas) | `/alimentacao` | Cardápio por dia e refeição, receitas com preparo e imagens, lista de compras, substituições |
| Relaxamento | `/relaxamento` | Respiração guiada, meditações em carrossel, sessões salvas na conta |
| Programa guiado | `/programa` | Programa de 30 dias em quatro semanas, atividade nova por dia, lembrete diário |
| Evolução | `/evolucao` | Cartões de dor/sono/energia/bem-estar, gráficos, períodos, PDF e botão Histórico |
| Diário (Histórico) | `/diario` | Todos os registros salvos, com Progresso do dia quando houver |
| Comunidade | `/comunidade` | Mural com publicação automática, curtidas, respostas e filtros |
| Biblioteca | `/biblioteca` | 11 assuntos, 46 perguntas/respostas, busca instantânea e filtros |
| Leitura de assunto | `/conhecimento/$assunto` | Texto e imagens de cada assunto da Biblioteca |
| Quem criou o VivaLeve | `/profissional` | Apresentação da Dra. Nadya Kazzaz |
| Meu perfil | `/perfil` | Dados da conta, foto, troca de senha, lembretes de treino e do registro diário |
| Administração | `/admin` | Cadastro de usuárias (só admin), nome, e-mail e senha |
| Modo crise | componente na Home | Respiração, posição de alívio, compressa morna, quando procurar ajuda, 192 e 188 |

Layout compartilhado: `AppShell` com menu lateral no desktop e barras superiores por viewport no celular; controles de conta e notificação ficam sempre nas barras do AppShell.

---

## Funcionalidades

### Acesso e conta
- **Login** com e-mail e senha. Não existe cadastro público.
- **Cadastro de usuários só pela administradora** (nome, e-mail e senha); a pessoa já pode entrar com esses dados.
- **Meu perfil**: e-mail, data de criação, foto de perfil, troca de senha (exige a senha atual), lembrete de treino e lembrete do registro diário (todos os dias, 2x/semana, 1x/semana ou 1x/mês, com horário).
- Saudação com o primeiro nome do usuário.
- **Modo escuro** com botão próprio, preferência salva no navegador e aplicado antes da primeira pintura da tela (para sensibilidade visual, dor de cabeça).

### Início
- Card **"Como você está se sentindo hoje?"** que flutua até o registro do dia; depois mostra "Registro do dia feito. Até amanhã! 💜" em card verde claro e volta no dia seguinte.
- **Registro diário**: humor, sono (horário de deitar/acordar, despertares), dor 0–10, cansaço, disposição, névoa mental, ciclo/menopausa, gatilhos e **mapa corporal** frente/costas com intensidade por região.
- **Progresso Diário**: anel com a porcentagem concluída e linhas clicáveis de Exercícios, Alimentação e Sono, cada uma com a própria barra e o número feito. Tocar abre a tela correspondente; sono conta ao concluir "Preparar para dormir".
- Atalhos com imagens: Exercitar, Receitas, Relaxamento, Comunidade, Evolução e Biblioteca.
- Botão **"Estou em crise"** — segurar até a barra vermelha encher para abrir o modo crise.
- Botão para instalar o app no celular e rodapé acolhedor.

### Notificações
- Sino com avisos reais: registro pendente e atividade do programa.
- Lembretes no celular (Web Push) para treino, registro diário e programa — funcionam no app publicado com notificações ativadas.

### Movimento
- **Meu plano de movimento**: dias com datas, hoje selecionado, apenas exercícios programados, progresso que começa em zero e não passa para outro dia.
- **Exercícios**: 26 exercícios do guia em PDF (Aquecimento, Mobilidade, Força leve, Movimento mínimo, Desaquecimento) com as imagens originais, passo a passo, respiração, atenção e benefício; escolha de dias individualmente.
- Plano semanal padrão criado no primeiro acesso, editável depois.

### Alimentação
- Cardápio anti-inflamatório do PDF com 15 receitas, ingredientes e modo de preparo.
- Planejamento por dia e por refeição (café, almoço, lanche, janta, ceia); plano padrão no primeiro acesso.
- Lista de compras derivada das receitas escolhidas, sem duplicatas.
- **Substituições**: tabela de trocas em modal e ingredientes com troca destacados com botão "Trocar".

### Relaxamento
- Respiração guiada (2/5/10 min) com círculo animado, tempo restante, pausar/encerrar, modo só texto, áudio opcional e botão Próximo nas práticas instruídas.
- Meditações em carrossel contínuo; sessões concluídas salvas na conta.

### Programa guiado de 30 dias
- Quatro semanas progressivas (acalmar a dor, soltar/fortalecer, sono/energia, autonomia), atividade nova por dia, progresso salvo e lembrete diário.

### Evolução e relatórios
- Períodos 30 dias / 3 meses / personalizado; cartões de dor, sono, energia e bem-estar com comparação ao período anterior; gráficos.
- "O que percebemos": padrões descritivos (não clínicos).
- **PDF** com os registros reais.
- Botão **Histórico** abre o Diário; os cards guardam também o Progresso do dia quando passar de 0% (exercícios, refeições e sono feitos).

### Comunidade
- Mural com publicação automática, nome/foto/data, curtidas, respostas em modal e filtros Todos / Meus assuntos / Populares.
- Cada pessoa apaga só o que é seu; a admin pode apagar qualquer conteúdo.

### Biblioteca de conhecimento
- Assuntos sobre a doença e cuidados diários, com filtros, busca instantânea (ignora acentos) e páginas de leitura com imagens.

### App no celular
- Instalável (PWA) com ícones e manifesto, sem cache offline.

---

## Paleta de cores

As cores são tokens semânticos no `src/styles.css` (valores em OKLCH; hex aproximado entre parênteses). O modo escuro troca todos os tokens de uma vez — nenhum componente usa cor fixa.

### Tema claro

| Token | Valor (OKLCH) | Hex aprox. | Uso |
|---|---|---|---|
| `--background` | `0.99 0.004 300` | `#FCFBFE` | Fundo geral, quase branco lilás |
| `--foreground` | `0.24 0.04 285` | `#1D1C31` | Texto principal |
| `--card` | `1 0 0` | `#FFFFFF` | Fundo dos cards |
| `--primary` | `0.56 0.19 295` | `#8054D6` | Lilás/violeta principal (botões, destaques) |
| `--primary-soft` | `0.95 0.03 300` | `#F1EAFF` | Fundo lilás claro |
| `--secondary` / `--muted` | `0.97 0.01 300` | `#F7F4FB` | Superfícies suaves |
| `--muted-foreground` | `0.52 0.03 285` | — | Texto secundário |
| `--border` / `--input` | `0.93 0.012 300` | — | Bordas suaves |
| `--ring` | `0.7 0.12 295` | — | Foco de formulários |
| `--destructive` | `0.6 0.2 20` | `#DE394B` | Ações destrutivas |

Cores por tema do app:

| Token | Hex aprox. | Uso |
|---|---|---|
| `--pain` | `#EF4B67` | Dor |
| `--sleep` | `#7D5BE6` | Sono |
| `--energy` | `#1C985A` | Energia |
| `--food` | `#F09C17` | Alimentação |
| `--move` | `#2389E2` | Movimento |
| `--mood` | `#B954CF` | Humor |
| `--good` / `--good-soft` | `#14874E` / `#E0F9E8` | Confirmação (registro do dia) |
| `--warn` / `--warn-soft` | `#B17000` / — | Aviso |
| `--alert` / `--alert-soft` | `#D63053` / — | Alerta / modo crise |
| `--nutrition-blue` | `#00638A` | Destaques da nutrição |

Gradientes: `--gradient-checkin` (check-in), `--gradient-insight` (Evolução), `--gradient-focus` (foco/relaxamento). Sombras suaves: `--shadow-soft` e `--shadow-float`. Arredondamento base `--radius: 1.25rem` (cards `rounded-2xl`/`3xl`).

### Tema escuro (`.dark`)

| Token | Valor (OKLCH) | Hex aprox. |
|---|---|---|
| `--background` | `0.19 0.008 285` | `#131317` |
| `--card` | `0.235 0.01 285` | `#1D1D23` |
| `--primary` | `0.59 0.12 295` | `#836DBD` |
| `--foreground` | `0.86 0.012 285` | — |

No escuro, imagens ficam mais escuras (`filter: brightness(0.72)`) e os tokens de tema (dor, sono, energia…) ganham versões mais claras para manter contraste.

### Tipografia
- **Figtree** — textos e interface.
- **Outfit** — títulos (`--font-display`).

---

## Tecnologia

- **TanStack Start v1** (React 19 + TypeScript) — framework full-stack; rotas em `src/routes/`, lógica de servidor com `createServerFn`.
- **TanStack Router** — navegação sem recarregar, com transições suaves.
- **TanStack Query** — carregamento e cache de dados.
- **Tailwind CSS v4** — estilos por tokens semânticos em `src/styles.css`.
- **shadcn/ui + Radix UI** — componentes de interface acessíveis (diálogos, abas, sliders…).
- **Lovable Cloud (Supabase)** — banco de dados PostgreSQL, autenticação, segurança por linha (RLS).
- **Drizzle ORM** — migrações da estrutura do banco em `drizzle/migrations/`.
- **Recharts** — gráficos da Evolução.
- **pdf-lib** — geração do PDF do relatório.
- **Web Push (VAPID)** — lembretes no celular.
- **Embla Carousel** — carrosséis (meditações e outros).
- **Zod + react-hook-form** — validação de formulários.
- **PWA** — manifesto e ícones para instalar no celular.
- **Vitest + Testing Library** — testes automatizados em `src/test/`.
- **ESLint + Prettier** — padrão de código.

---

## Sistemas por processo

| Processo | Como funciona |
|---|---|
| **Autenticação** | Login com e-mail/senha do Lovable Cloud; sessão anexada às chamadas de servidor por middleware; sem cadastro público; troca de senha exige a senha atual (tela e servidor) e há proteção contra senhas vazadas. |
| **Cadastro de usuárias** | Função de servidor que confirma no banco se quem pede é admin (verificação no servidor, nunca no navegador) e então cria a conta. |
| **Registros da paciente** | Tabelas próprias por pessoa (check-in, exercícios, receitas, programa, relaxamento, progresso) com regras de segurança que permitem ler e alterar só os próprios dados. |
| **Planos padrão** | No primeiro acesso, semana pronta de receitas e de exercícios é criada na conta; depois a pessoa edita como quiser. |
| **Progresso diário** | Exercícios concluídos salvos na conta por exercício e data; refeições marcadas e "Preparar para dormir" concluído contam no Progresso; ao abrir a Início, o dia é gravado no Histórico quando houver progresso. |
| **Relatório PDF** | Gerado no servidor com pdf-lib a partir dos registros reais (período, mapa corporal, gatilhos, sono). |
| **Evolução** | Consultas agregadas por período, comparação com o período anterior e gráficos; índices são estimativas informativas. |
| **Notificações internas** | Sino calcula avisos com dados reais (registro pendente, atividade do programa); abre caixa de avisos. |
| **Lembretes no celular** | Agendador no servidor roda de 5 em 5 minutos e, na hora escolhida, envia Web Push assinado (chave VAPID guardada no banco), sem conteúdo sensível; o service worker busca o texto e mostra o aviso. Só funciona no app publicado com notificações ligadas. |
| **Segurança (RLS)** | Todas as tabelas pessoais bloqueadas para terceiros; papéis (admin, moderadora, usuária) em tabela protegida; comunidade com leitura compartilhada intencional entre pacientes logadas e escrita/exclusão só da autora (ou admin). |
| **Substituições de ingredientes** | Módulo que liga cada ingrediente à tabela de trocas do cardápio original, sem alterar o texto fornecido. |
| **Erros** | Captura e reporte automático de erros no navegador (`error-capture`/`lovable-error-reporting`) com página de erro amigável. |

---

## Segurança

- **Login obrigatório** em todas as telas internas; sem cadastro público.
- **Dados privados por paciente**: todas as tabelas pessoais só podem ser lidas e alteradas pela própria dona.
- **Papéis separados** em tabela protegida; verificação de admin sempre no servidor.
- **Troca de senha** exige a senha atual (na tela e no servidor).
- **Proteção contra senhas vazadas** ativada.
- **Comunidade**: leitura compartilhada entre pacientes logadas é intencional; escrita e exclusão limitadas à autora (ou admin).
- **Lembretes**: notificações sem conteúdo sensível no envio; o agendador usa um token secreto guardado apenas no servidor.
- Nenhum dado da paciente é compartilhado com a doutora.

---

## Observações

- Conteúdo educativo, exercícios e programa são gerais e devem ser revisados por profissional.
- Os índices da Evolução são estimativas informativas, não diagnóstico.
- O PDF do relatório pode sair com títulos sem acentos.
- Notificações no celular só funcionam no app publicado.

---

## Estrutura do código

```
src/
  routes/            Telas e rotas (públicas, autenticadas e api/)
    _authenticated/  Telas internas do app
    api/public/      Agendador de lembretes e assinaturas de push
  components/vl/     Componentes do VivaLeve (AppShell, check-in, mapa de dor, água, tema…)
  data/              Conteúdo: exercícios, receitas, biblioteca, programa, relaxamento, planos padrão
  lib/               Regras e hooks: progresso, planos, hidratação, substituições, PDF, push, admin
  integrations/      Clientes do banco gerados automaticamente
  test/              Testes automatizados
  styles.css         Tokens de cor, tipografia, sombras e animações
drizzle/migrations/  Migrações do banco
```

```sh
npm i
npm run dev      # desenvolvimento
npm run test     # testes
npm run build    # build de produção
```
