# VivaLeve — Acompanhamento da Fibromialgia

Aplicativo acolhedor para quem vive com fibromialgia, idealizado pela **Dra. Nadya Kazzaz** (cardiologista que também convive com o diagnóstico). Foco: transmitir a sensação de "eu estou sendo acompanhada", com visual leve, tons lilás, cards arredondados e prioridade para o celular.

> Todos os registros pertencem somente à paciente. Nada é enviado à doutora — ela aparece apenas como idealizadora do app.

---

## Funcionalidades

### Acesso e conta
- **Login** com e-mail e senha. Não existe cadastro público.
- **Cadastro de usuários só pela administradora** (nome, e-mail e senha). Somente a conta admin vê essa opção.
- **Meu perfil**: e-mail, data de criação, foto de perfil, troca de senha (exige senha atual), lembrete de treino e lembrete do registro diário (todos os dias, 2x/semana, 1x/semana ou 1x/mês, com horário).
- Saudação com o primeiro nome do usuário.

### Início
- Card **"Como você está se sentindo hoje?"** que flutua até o registro do dia; depois mostra "Registro do dia feito. Até amanhã!" e volta no dia seguinte.
- **Registro diário**: humor, sono (horário de deitar/acordar, despertares), dor 0–10, cansaço, disposição, névoa mental, ciclo/menopausa, gatilhos e **mapa corporal** frente/costas com intensidade por região.
- Atalhos com imagens: Exercitar, Receitas, Relaxamento, Comunidade, Evolução e Biblioteca.
- Botão **"Estou em crise"** — segurar até a barra vermelha encher para abrir o modo crise (respiração, posição de alívio, compressa morna, quando procurar ajuda, 192 e 188).
- Botão para instalar o app no celular e rodapé acolhedor.

### Notificações
- Sino com avisos reais: registro pendente e atividade do programa.
- Lembretes no celular (Web Push) para treino, registro diário e programa — funcionam no app publicado com notificações ativadas.

### Movimento
- **Meu plano de movimento**: dias Domingo–Sábado com datas, hoje selecionado, apenas exercícios programados, progresso que começa em zero e não passa para outro dia.
- **Exercícios**: 26 exercícios do guia em PDF (Aquecimento, Mobilidade, Força leve, Movimento mínimo, Desaquecimento) com imagens, passo a passo, respiração, atenção e benefício; escolha de dias individualmente.
- Plano semanal padrão criado no primeiro acesso, editável depois.

### Alimentação
- Cardápio anti-inflamatório do PDF com 15 receitas, ingredientes e modo de preparo.
- Planejamento por dia e por refeição (café, almoço, lanche, janta, ceia); plano padrão no primeiro acesso.
- Lista de compras derivada das receitas escolhidas, sem duplicatas.
- **Substituições**: tabela de trocas em modal e ingredientes com troca destacados com botão "Trocar".

### Relaxamento
- Respiração guiada (2/5/10 min) com círculo animado, tempo restante, pausar/encerrar, modo só texto e áudio opcional.
- Meditações em carrossel contínuo; sessões concluídas salvas na conta.

### Programa guiado de 30 dias
- Quatro semanas progressivas (acalmar a dor, soltar/fortalecer, sono/energia, autonomia), atividade nova por dia, progresso salvo e lembrete diário.

### Evolução e relatórios
- Períodos 30 dias / 3 meses / personalizado; cartões de dor, sono, energia e bem-estar com comparação ao período anterior; gráficos.
- "O que percebemos": padrões descritivos (não clínicos).
- **PDF** com os registros reais.
- Botão **Histórico** abre o Diário com todos os registros.

### Comunidade
- Mural com publicação automática, nome/foto/data, curtidas, respostas em modal.
- Filtros Todos / Meus assuntos / Populares.
- Cada pessoa apaga só o que é seu; a admin pode apagar qualquer conteúdo.

### Biblioteca de conhecimento
- Assuntos sobre a doença e cuidados diários, com filtros, busca instantânea (ignora acentos) e páginas de leitura com imagens.

### Quem criou o VivaLeve
- Apresentação da Dra. Nadya Kazzaz.

### App no celular
- Instalável (PWA) com ícones e manifesto, sem cache offline.

---

## Segurança

- **Login obrigatório** em todas as telas internas; sem cadastro público.
- **Dados privados por paciente**: todas as tabelas pessoais (registros, exercícios, receitas, programa, relaxamento, lembretes, notificações) só podem ser lidas e alteradas pela própria dona.
- **Papéis separados** (admin, moderadora, usuária) em tabela protegida; a verificação de admin é feita no servidor.
- **Cadastro de usuários** feito no servidor, só após confirmar que quem pede é admin.
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

## Tecnologia
TanStack Start (React 19, TypeScript), Tailwind CSS v4, Lovable Cloud (banco, autenticação e funções), Web Push, pdf-lib e Vitest.

```sh
npm i
npm run dev
```
