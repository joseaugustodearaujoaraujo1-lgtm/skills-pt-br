# 09 · Referências e recursos

Onde buscar inspiração e recursos, e como usar sem copiar. A disponibilidade, os preços e as exigências de login dos sites mudam com o tempo: confira antes de recomendar um item específico.

## Sumário
1. Regras de uso
2. naocodei.com — motion
3. pinstack.app — componentes e seções
4. Galerias de sites (inspiração)
5. Sistemas de design para estudar
6. Fontes, cores, ícones e imagens
7. Ferramentas de verificação

---

## 1. Regras de uso

- **Inspire-se em princípios, não copie peças:** hierarquia, espaçamento, densidade, composição, tratamento de imagem, ritmo entre seções.
- **Combine de 2 a 3 referências** e adapte ao conteúdo e à marca do projeto. Uma referência só vira cópia.
- **Nunca copie** marca, logo, ilustrações, fotos ou textos de terceiros.
- **Sem login e sem contas** criadas por você. Itens pagos (PRO) ou que exigem login ficam por conta do usuário, com o acesso dele.
- **Licenças:** confira a licença de fontes, ícones, imagens e trechos de código antes de usar comercialmente.

## 2. naocodei.com — motion

- **O que é:** 66 efeitos de animação em HTML, CSS e JS puro, sem bibliotecas, com código comentado em português.
- **Páginas:** https://naocodei.com/free-code-css/ (CSS, `a01`–`a30`) e https://naocodei.com/free-code/ (JS, `j01`–`j36`).
- **Catálogo** com o ID e o uso de cada efeito: `catalogo-naocodei.md`.
- **Como extrair e adaptar:** `06-motion.md`, seção 8.
- **Combinação com o pinstack:** o pinstack define a estrutura e a aparência de um bloco; o naocodei dá movimento a ele. Monte a seção inspirada no pinstack e aplique um ou dois efeitos do naocodei.

## 3. pinstack.app — componentes e seções

- **O que é:** seções e componentes com visual de produto SaaS/IA (frequentemente escuro), para copiar como código, como prompt para IA ou para o Figma. O foco declarado é React/Next.js.
- **Seções** (https://www.pinstack.app/sections): Hero, Features, Pricing, Forms, Footer, Integrations, Dashboard, Comparison, Social proof, Stats & metrics, How it works.
- **Componentes** (https://www.pinstack.app/components): Cards, Inputs, Data table, Modal, Dialog, Command menu, Dropdown, Tooltip, Text animation e outros.
- **Backgrounds:** https://www.pinstack.app/backgrounds.
- **Acesso:** as prévias podem ser vistas livremente. Copiar código ou prompt exige login, inclusive nos itens gratuitos, e os itens PRO exigem assinatura. Se o usuário quiser usar, ele entra na própria conta ou cola o conteúdo na conversa. Nunca contorne o paywall.
- **Como usar:**
  - use as prévias como referência de hierarquia, espaçamento, densidade e tratamento de cards, tabelas e menus;
  - com o código liberado pelo usuário, adapte aos tokens e à stack do projeto;
  - com o prompt, use-o como especificação para recriar na stack do projeto.
- O site às vezes fica em manutenção. Nesse caso, siga com as outras referências e avise o usuário.

## 4. Galerias de sites (inspiração)

Galerias de sites publicados, úteis para ver composições reais por segmento:
- **Awwwards** (awwwards.com): sites premiados, muitos experimentais. Ótimo para motion e direção de arte; nem tudo é usável num site comercial comum.
- **Godly** (godly.website): seleção de sites com design forte, muitos de produtos digitais.
- **Land-book** (land-book.com): landing pages organizadas por categoria e estilo.
- **Lapa Ninja** (lapa.ninja): landing pages por segmento.
- **One Page Love** (onepagelove.com): sites de página única, portfólios.
- **SiteInspire** (siteinspire.com): sites organizados por estilo, tipo e assunto.
- **Minimal Gallery** (minimal.gallery): sites minimalistas.
- **Dark Mode Design** (darkmodedesign.com): exemplos de interfaces escuras.

Use a busca por segmento (ex.: "restaurant", "clinic", "law firm", "portfolio developer") para achar referências próximas do projeto.

## 5. Sistemas de design para estudar

Documentações públicas que explicam o porquê de cada decisão:
- **GOV.UK Design System:** referência em formulários, acessibilidade e texto claro.
- **Material Design 3** (Google) e **Human Interface Guidelines** (Apple): padrões de interação, estados e acessibilidade.
- **Carbon** (IBM), **Polaris** (Shopify), **Atlassian Design System:** tokens, tipografia, espaçamento e componentes bem documentados.
- **shadcn/ui, Radix UI e Headless UI:** componentes acessíveis para React; bons para estudar estados e teclado.
- **Livro "Refactoring UI"** (Adam Wathan e Steve Schoger): técnicas práticas de hierarquia, espaço e cor para desenvolvedores.

## 6. Fontes, cores, ícones e imagens

- **Fontes:** Google Fonts (gratuitas, fácil de usar); Fontshare (gratuitas, de uso comercial; hospede os arquivos no projeto).
- **Cores:** oklch.com (seletor OKLCH), Realtime Colors (testa uma paleta num site de exemplo), Huemint, Coolors.
- **Ícones** (escolha uma família só): Lucide, Phosphor, Tabler Icons, Heroicons.
- **Ilustrações:** prefira próprias ou encomendadas. Bibliotecas genéricas reforçam a "cara de modelo".
- **Fotos:** fotos reais do negócio são sempre melhores. Bancos gratuitos (Unsplash, Pexels) servem como apoio; confira a licença e evite as imagens mais usadas.

## 7. Ferramentas de verificação

- **Lighthouse** (no Chrome DevTools): desempenho, acessibilidade, boas práticas e SEO.
- **axe DevTools** e **WAVE:** problemas de acessibilidade.
- **WebAIM Contrast Checker:** contraste de cores.
- **PageSpeed Insights:** desempenho com dados reais de usuários.
- **Modo de dispositivo do DevTools:** larguras de celular, toque e rede lenta.
- **Emulação de `prefers-reduced-motion` e `prefers-color-scheme`** no DevTools (Rendering).
