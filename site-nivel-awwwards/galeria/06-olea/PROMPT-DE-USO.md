# Como usar o site olea

Cole este texto numa sessão nova do Claude Code, com este repositório aberto. Ele faz as perguntas e escolhe o caminho.

```
Leia galeria/06-olea/CLAUDE.md e galeria/06-olea/conceito/ (capturas-alvo).
Antes de mexer em qualquer coisa, me faça estas perguntas e espere a resposta:
1. Qual é a marca ou o cliente (nome, cidade, o que vende) e quem é o público?
2. Vou usar o site como está (demonstração), trocar marca e paleta, ou construir um site novo a partir do padrão deste?
3. Já existe logotipo, fotos, textos e cores da marca? Se não, uso placeholders e anoto o que falta.
4. Quais seções ficam e quais saem? Tem página ou seção que o site precisa ter e este não tem?
5. Quais ações importam (WhatsApp, reserva, formulário, compra) e onde ficam os dados de contato?
6. Prazo, domínio e onde vai ficar publicado?
Depois siga o caminho escolhido abaixo. Não mude o movimento nem a estrutura sem eu pedir.
```

## Caminho 1: usar como está
1. `npm install && npm run build && npm run serve` e abra http://localhost:3006/.
2. Troque só os textos, os contatos e os links (no `public/index.html`) e as imagens em `public/img/` (mesmo tamanho e proporção).
3. Confira com `verificar-site.mjs` (0 FAIL) e refaça as capturas de `conceito/` se a aparência mudar.

## Caminho 2: trocar marca e paleta
1. Cores: edite os papéis no `:root` do `public/estilo.css` (`--cor-escura`, `--cor-escura-2`, `--cor-claro`, `--cor-claro-2`...). Para testar sem editar, abra `?tema=quente` (temas prontos: quente, frio, mono). Para criar um tema novo, copie um bloco `html[data-paleta="..."]`.
2. Marca: troque nome, logotipo e textos mantendo o comprimento aproximado (o layout quebra linha no mesmo ponto).
3. Fotos e vídeos: o que for essencial está em `../IMAGENS-PARA-GERAR.md`; o resto pode ser placeholder da mesma proporção.
4. Conteúdo que muda o comportamento está nos atributos `data-*` do HTML (lista no CLAUDE.md): edite lá, sem tocar no JS.
5. Rode o build, o `verificar-site.mjs` e compare com as capturas de `conceito/`.

## Caminho 3: construir do zero a partir do padrão
1. Mantenha do olea: a estrutura de rolagem, as medidas e a lógica de movimento do CLAUDE.md. Troque a ideia: defina antes a ideia central e o gesto de cada seção (`references/direcao-criativa.md` da skill, se existir).
2. Copie a pasta, renomeie em `package.json`, e reescreva seção por seção: texto, imagem, cor e gesto. Seção sem gesto não está pronta.
3. A cada seção: build, captura (`replica/ferramentas/telas2.cjs`) no desktop (1440x900) e no celular (390x844), e olhe a imagem antes de seguir.
4. Ao fim: `verificar-site.mjs` com 0 FAIL e capturas novas em `conceito/`.

## Regras que valem nos três caminhos
- Não copie código, textos ou imagens de sites de terceiros.
- Imagem não essencial: placeholder da mesma proporção. Essencial: acrescente em `../IMAGENS-PARA-GERAR.md` com prompt.
- Nada com cara de provisório ("lorem", "[ ]", emoji no lugar de ícone).
