# 05 · Componentes e seções

Anatomia, estados e erros comuns dos blocos que aparecem em quase todo site. Para a aparência de seções prontas, consulte também o pinstack.app (ver `09-referencias.md`).

## Sumário
1. Botões
2. Links
3. Cards
4. Navegação (header e menu)
5. Hero
6. Features / benefícios
7. Prova social
8. Pricing
9. Formulários
10. Tabelas
11. Modais e diálogos
12. Footer
13. Estados: carregando, vazio, erro, sucesso
14. Ícones e imagens

---

## 1. Botões

**Hierarquia:**

| Tipo | Uso | Visual |
|---|---|---|
| **Primário** | a ação principal da tela (uma por vista) | fundo cheio com o acento, texto com contraste |
| **Secundário** | ação alternativa | contorno ou fundo neutro |
| **Terciário** | ações de menor peso (cancelar, ver mais) | só texto, com sublinhado ou ícone |
| **Destrutivo** | apagar, cancelar assinatura | cor de perigo, sempre com confirmação |

**Anatomia:**
- Altura de 40 a 48px (44px no celular).
- Padding horizontal de cerca de 2 a 2,5 vezes o vertical.
- Texto em peso 500–600.
- Raio igual ao dos outros componentes.
- Ícone opcional a 8px do texto.

**Estados obrigatórios:**
- `hover`: um pouco mais escuro ou elevado;
- `focus-visible`: anel de foco com contraste;
- `active`: um pouco afundado;
- `disabled`: menos contraste e `cursor: not-allowed`, mas legível;
- `loading`: spinner e o texto "Enviando…", sem mudar a largura do botão.

**Texto:** um verbo que diz o que acontece ("Criar conta", "Baixar o guia", "Agendar visita"). Evite "Clique aqui", "Enviar" ou "Saiba mais" sozinhos.

**Erros comuns:**
- três botões iguais lado a lado;
- botão primário em todo card de uma lista;
- `outline: none` sem substituto;
- `<div onclick>` no lugar de `<button>`;
- botões de tamanhos diferentes na mesma linha.

## 2. Links

- Dentro de parágrafos, cor de acento **e** sublinhado (`text-underline-offset: 0.2em`, `text-decoration-thickness: 1px`).
- Em menus e rodapés, o sublinhado pode aparecer só no hover, desde que o contexto deixe claro que são links.
- Links externos: indique com ícone ou texto quando abrem em nova aba.
- Texto do link descreve o destino ("Leia a política de privacidade", e não "aqui").

## 3. Cards

- Use card quando o conteúdo é uma **unidade clicável ou comparável** (produto, post, plano). Não coloque tudo em card: texto corrido não precisa de caixa.
- Padding de 20 a 32px; um único raio e uma única sombra (ou borda) para todos os cards.
- Ordem interna: imagem (proporção fixa com `aspect-ratio`) → rótulo/categoria → título → descrição curta → metadados → ação.
- Card inteiro clicável: um link no título com `::after { content: ""; position: absolute; inset: 0; }` no card com `position: relative`. Assim o card inteiro responde ao clique e o leitor de tela anuncia só o título.
- Em linha, mantenha alturas e alinhamento das partes (botão no fim com `margin-top: auto`).

## 4. Navegação (header e menu)

- 5 a 7 itens no máximo no menu principal; o resto vai para o rodapé ou para submenus.
- O item da página atual fica marcado (`aria-current="page"` + estilo).
- CTA do header (ex.: "Agendar") como botão; o resto como links.
- Header fixo (`position: sticky`) só se for compacto. No celular, considere esconder ao rolar para baixo e mostrar ao rolar para cima.
- Menu mobile:
  - botão com `aria-expanded` e `aria-controls`;
  - fecha com Esc;
  - o foco vai para o primeiro item ao abrir;
  - o scroll da página trava enquanto aberto.
- Logo leva para a página inicial.

## 5. Hero

O primeiro quadro decide se a pessoa fica.

- **Título:** o benefício concreto, para quem é. Evite slogans vagos ("Inovação que transforma").
- **Subtítulo:** como funciona ou o que a pessoa recebe, em 1 ou 2 frases.
- **Ação:** um botão primário e, no máximo, uma ação secundária (link ou botão secundário).
- **Prova:** imagem real do produto, do serviço ou do resultado; logos de clientes reais ou uma métrica com fonte.
- **Tamanho:** pelo conteúdo, não `100vh` por padrão. O começo da próxima seção pode aparecer, o que convida a rolar.
- No celular: o título e a ação aparecem sem rolar; a imagem pode vir depois.

## 6. Features / benefícios

- Fale do **resultado para o cliente**, não da funcionalidade ("Feche o caixa em 5 minutos", e não "Módulo financeiro integrado").
- Mostre o produto (prints, fotos, demonstração) em vez de três ícones genéricos com três frases.
- Alterne layouts (texto + imagem alternando lados, grid, lista) para não ficar repetitivo.
- 3 a 6 benefícios principais; o resto vai para uma lista ou página de detalhes.

## 7. Prova social

- **Depoimentos reais:** nome, foto, cargo/empresa ou cidade e um trecho específico ("reduziu de 3 dias para 4 horas"). Depoimentos sem nome parecem falsos.
- **Logos de clientes:** só com permissão; em escala de cinza ou cor única, com tamanhos visualmente equilibrados.
- **Números:** com período e fonte ("4.200 pedidos entregues em 2025"). Nunca invente.
- Posicione perto das ações (antes do CTA final, ao lado do formulário).

## 8. Pricing

- 2 a 4 planos; destaque o recomendado (borda, rótulo "Mais escolhido", leve elevação).
- Preço grande, período claro ("por mês", "à vista"), e o que muda entre os planos no topo da lista.
- Alternância mensal/anual com a economia explícita; a troca não pode mudar o layout.
- Lista de recursos alinhada entre os planos; ✓ e — com texto alternativo ("incluído", "não incluído").
- Ações com texto específico ("Começar no Básico") e informação sobre teste grátis e cancelamento perto do botão.

## 9. Formulários

- **Label visível acima do campo** (nunca só placeholder), ligada pelo `for`/`id`.
- Peça o mínimo de campos. Cada campo a mais reduz a conversão.
- **Tipos e autocompletar certos:** `type="email"`, `type="tel"`, `inputmode="numeric"`, `autocomplete="name"`, `"email"`, `"tel"`, `"postal-code"`, `"street-address"`. O celular mostra o teclado certo e o navegador preenche.
- A largura do campo sugere o tamanho da resposta (CEP curto, endereço longo).
- **Validação:**
  - ao sair do campo ou ao enviar, não a cada tecla;
  - mensagem de erro junto do campo, dizendo como corrigir ("Informe um e-mail com @, ex.: nome@empresa.com");
  - `aria-invalid="true"` e `aria-describedby` apontando para a mensagem;
  - foco no primeiro erro ao enviar.
- Marque o que é **opcional** em vez de pôr asterisco em tudo.
- Botão de envio com estado de carregamento e mensagem de sucesso clara depois.
- Campos agrupados por tema com `fieldset` e `legend`, quando houver muitos.

## 10. Tabelas

- Números alinhados à direita com `tabular-nums`; texto à esquerda.
- Cabeçalho fixo em tabelas longas; zebra sutil ou linhas finas, não ambos.
- No celular: rolagem horizontal dentro de um container, ou transformação em lista de cards.
- `<th scope="col">` e `<caption>` para acessibilidade.

## 11. Modais e diálogos

- Use para confirmações e tarefas curtas, não para conteúdo importante que a pessoa queira consultar.
- `<dialog>` nativo com `showModal()` resolve foco, Esc e fundo inerte.
- Título claro, ação principal à direita (ou abaixo, no celular), botão de fechar acessível.
- Não abra modal automaticamente na entrada (newsletter, cookies gigantes): é a principal fonte de irritação.

## 12. Footer

- Contato real (endereço, telefone, e-mail como texto selecionável), links importantes, redes sociais, informações legais (CNPJ, política de privacidade, termos).
- Organizado em 3 a 5 colunas no desktop e empilhado no celular.
- Contraste adequado: footer escuro com texto cinza muito apagado é falha comum.

## 13. Estados: carregando, vazio, erro, sucesso

Toda área com dados precisa dos quatro:
- **Carregando:** esqueleto (skeleton) com o formato do conteúdo, melhor que spinner em telas grandes.
- **Vazio:** explique o que vai aparecer ali e como começar ("Você ainda não tem pedidos. Explore o cardápio").
- **Erro:** o que aconteceu, o que fazer, botão de tentar de novo. Sem culpar o usuário e sem códigos técnicos.
- **Sucesso:** confirme o que foi feito ("Pedido 482 confirmado. Enviamos os detalhes para seu e-mail").

## 14. Ícones e imagens

- **Ícones:**
  - uma única família (Lucide, Phosphor, Tabler, Heroicons), mesma espessura de traço e mesmo tamanho por contexto (16, 20 ou 24px);
  - alinhados ao texto;
  - ícone sozinho precisa de `aria-label`, e ícone decorativo de `aria-hidden="true"`.
- **Imagens:**
  - fotos reais do negócio valem mais que bancos de imagem;
  - tratamento consistente (mesma proporção, mesma temperatura de cor, mesmo raio);
  - `alt` descritivo, ou `alt=""` se forem decorativas;
  - `width`/`height` ou `aspect-ratio` para não "pular" ao carregar;
  - formatos WebP/AVIF e `loading="lazy"` abaixo da dobra.
- **Emojis como ícones de seção:** em geral parecem improvisados. Prefira ícones de uma família ou ilustrações próprias.
