# Plataformas de componentes, transições e direção de design

Verificado em **2026-11-16** nas páginas oficiais (preço e licença mudam: confira antes de usar em projeto de cliente).
Regra fixa: **não fazer login, não criar conta, não comprar**. Item pago, PRO ou que exija login fica com o usuário, com o acesso dele.

## Resumo: grátis, pago e limites

| Plataforma | Para que serve aqui | Grátis | Pago | Licença | Limites |
|---|---|---|---|---|---|
| **tasteskill.dev** (Taste Skill) | Direção de arte: 20 direções de composição, 58 heros, 185 seções, 44 sistemas de fonte livre, 56 paletas, 202 sites estudados (Awwwards/OPL); inspetor em navegador real | **Tudo** (skill e app TasteCode) | Não tem (patrocínio opcional) | **MIT** | Precisa de Node 22 + Chrome para o inspetor; fotos da biblioteca são placeholders (Unsplash), trocar por material próprio |
| **transitions.dev** (Transitions.dev) | Transições de UI prontas (modal, dropdown, painel, badge, troca de ícone, página lado a lado, erro com tremida) | Biblioteca **core**, skill grátis, Motion Agent (10 correções hospedadas/mês, uso pessoal), Builder com 100 créditos de IA/mês | Pro **US$ 12/mês** ou **US$ 149 vitalício** (43+ transições, variantes React/TS); Business US$ 59/mês | Core: **MIT**. Pro: comercial, projetos ilimitados | Pro exige login (device flow). Motion Agent grátis só para **uso pessoal** |
| **reactbits.dev** (React Bits) | Componentes React animados: texto animado, animações, componentes, fundos (WebGL/three/shader), microinterações; JS ou TS, CSS ou Tailwind | Biblioteca principal (~200 componentes) | **React Bits Pro** (pro.reactbits.dev): blocos de página, templates, mais componentes; vitalício ou anual (≈ US$ 99–349, varia por plano) | **MIT + Commons Clause**: pode usar em projetos pessoais e comerciais; **não pode revender/redistribuir** os componentes | Só React (há ports Vue Bits e Svelte Bits); fundos WebGL pesam: aplique as regras de `3d-leve.md` |
| **naocodei.com** (Não Codei) | Motion em CSS e JS puro (30 animações CSS, 36 em JS), prompts e guias | **Tudo** ("tudo grátis e sem precisar programar") | Não encontrado | Material educativo; adapte, não copie em bloco | Sem limite declarado |
| **pinstack.app** (Pinstack) | Seções e componentes premium como referência de estrutura e visual (hero, pricing, cards, footer); cola no Figma ou vira código | Parte do acervo (navegação) | **Pro mensal** e **vitalício** (valores não aparecem sem login/checkout) | Ver `pinstack.app/legal/terms` (uso em trabalho de cliente é tratado na FAQ do plano) | PRO e cópia exigem login: **fica com o usuário** |

Da skill `design-completo` também vêm: naocodei e pinstack (acima), mais as galerias e recursos de `base-design-completo/09-referencias.md`.

## Como usar cada uma nesta skill

### tasteskill.dev: direção e anti-genérico
- Use como **segunda fonte de direção**, ao lado do acervo local: as 20 direções (ex.: "o nome como monumento", "capítulos de cor", "a página é o objeto", "o instrumento silencioso", "a sala escura") servem para propor as opções A–C quando o tema pede algo menos óbvio.
- O inspetor deles cobra o mesmo que a nossa rubrica: título legível em 1,2 s, margens iguais, ≥ 4 imagens reais, ≥ 8 elementos com movimento, sem gradiente/glass/emoji/ícone-em-card genéricos. Use a lista como checagem extra no portão de qualidade.
- **Instalar a skill deles** (`design-taste-frontend`) é opcional e depende de autorização do usuário; esta skill não depende dela.

### transitions.dev: microinterações e transições de interface
- Pegue da biblioteca **core (MIT)** o snippet CSS da transição (troca de ícone, check de sucesso, tremida de erro, pilha de cards, página lado a lado) e adapte aos tokens (`--ease`, `--dur`).
- Para site de marketing, prefira 2 ou 3 transições coerentes entre si; anime só `transform`, `opacity` e `filter` e respeite `prefers-reduced-motion`.
- Itens marcados "Pro only" (ex.: Gooey plus menu, Smoky dissolve) **não** entram sem o usuário ter o plano.

### reactbits.dev: componentes e fundos animados
- Em projeto React/Next: instale pela CLI ou copie a fonte do componente escolhido (JS/TS, CSS/Tailwind). Em HTML puro, use como **referência** e reescreva em JS/CSS.
- Bons para: texto animado (split, blur, scramble), fundos (aurora, partículas, shader), cursores, cards com tilt, marquee.
- Cheque: tamanho do bundle, `prefers-reduced-motion` (muitos componentes não tratam: adicione), e que o fundo WebGL não bloqueie a primeira dobra (carregue tarde, como o diamante do Atelier Lume).
- Licença: pode usar em site de cliente; não pode vender o componente como produto.

### naocodei.com: motion sem biblioteca
- Escolha pelo catálogo `base-design-completo/catalogo-naocodei.md`. Para efeitos de rolagem com inércia, prefira GSAP + ScrollTrigger (`elementos.md`).

### pinstack.app: estrutura de seção
- Use as páginas públicas como referência de composição (hierarquia, espaçamento, ritmo). Não copie marca, texto ou imagem. PRO fica com o usuário.

## Onde cada plataforma entra no fluxo
| Etapa | Plataforma |
|---|---|
| Opções de site (A–E) | acervo local + Awwwards + One Page Love + **tasteskill.dev** (direções e sites estudados) |
| Construção: componentes | **reactbits.dev**, `biblioteca-componentes`, **pinstack.app** (referência) |
| Construção: transições e microinterações | **transitions.dev** (core), **naocodei.com** |
| Portão de qualidade | `rubrica.md` + checagens do inspetor do **tasteskill.dev** |
