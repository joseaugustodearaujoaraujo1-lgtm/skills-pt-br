# Pipeline do elemento 3D (obrigatório)

Todo elemento 3D da experiência passa por estas etapas, **nesta ordem**, cada uma com aprovação do usuário. A etapa 2 (Blender) é **opcional: quem decide é o usuário**. Este arquivo manda sobre qualquer outra regra de 3D da skill; se outro arquivo disser diferente, vale este.

```
0. Referências  →  1. Imagens molde  →  APROVAÇÃO  →  [2. Molde no Blender → APROVAÇÃO]  →  3. Elemento em Three.js (< 200 KB)  →  APROVAÇÃO
```

## Com ou sem Blender (perguntar depois que o molde for aprovado)
Recomende um caminho, diga o motivo e o gasto, e **pergunte** com `AskUserQuestion`. A opção recomendada vem primeiro. Nunca escolha sozinho.

| Recomende **com Blender** quando | Recomende **sem Blender** quando |
|---|---|
| objeto complexo: muitas peças, curvas compostas, encaixes | objeto simples: anel, frasco liso, lata, moeda, peça de revolução |
| o usuário quer aprovar forma e proporção em 3D antes do código | as imagens molde já deixam tudo claro |
| falta um alvo realista de luz e material | há boas fotos reais que servem de alvo |

Diga com franqueza: com Blender o objeto é feito duas vezes (mais tempo, tokens e uma aprovação a mais), o que ajuda a acertar a forma mas **não melhora sozinho** o resultado em Three.js; e pede o Blender instalado ([preparacao.md](preparacao.md)).
- **Escolheu com:** siga para a etapa 2.
- **Escolheu sem:** registre `estado-3d.mjs --objeto <obj> dispensar --etapa blender --fala "<resposta do usuário>"`, pule para a etapa 3 e não instale o Blender. Para voltar atrás: `alterar --etapa blender`.

**Em todas as etapas, o máximo de realismo possível.** Não existe "versão rápida": proporção exata, bordas chanfradas (nenhuma aresta de primitivo), imperfeições (riscos, poeira, variação de rugosidade), materiais distintos por peça, reflexos e refrações coerentes com o ambiente, sombra de contato e oclusão.

## Controle das aprovações
Registre cada etapa com `scripts/estado-3d.mjs` (arquivo `referencias-3d/<objeto>/estado.json`):
```bash
node <skill>/scripts/estado-3d.mjs --objeto relogio status
node <skill>/scripts/estado-3d.mjs --objeto relogio exigir --etapa blender      # sai com erro se "molde" não estiver aprovado
node <skill>/scripts/estado-3d.mjs --objeto relogio aprovar --etapa molde --fala "<palavras do usuário>"
node <skill>/scripts/estado-3d.mjs --objeto relogio alterar --etapa molde --fala "<o que o usuário pediu>"
```
- Antes de começar uma etapa, rode `exigir`. Se falhar, **pare**.
- `aprovar` só com a resposta do usuário **nesta conversa**, copiada em `--fala`. Nunca aprove no lugar dele, nem em teste ou automação: sem usuário, pare e espere.
- `alterar` numa etapa anula as aprovações das etapas seguintes. Refaça e peça de novo.
- Pergunte sempre com `AskUserQuestion`: **Aprovar** · **Alterar** (o usuário descreve o quê). Mostre os arquivos com `SendUserFile` (modo `render`).

## Etapa 0. Referências (pedir ao usuário)
- **Peça imagens de referência de como é o elemento**: fotos, links do fabricante, prints, em vários ângulos (frente, lado, 3/4, costas, topo) e closes de material (textura, gravação, transparência). Peça medidas, se houver.
- Elemento inventado (personagem, objeto de história): peça descrição (forma, tamanho, materiais, cores, clima) e esboço ou referências de estilo.
- Se o usuário pedir que você procure: busque fontes abertas, mostre o que achou com os links e use só depois do "ok".
- Salve em `referencias-3d/<objeto>/0-referencias/` com `README.md` (fonte, direitos, medidas, o que não copiar). Marca de terceiros: só forma, material e luz; o elemento sai sem a marca, a menos que o usuário seja o dono.

## Etapa 1. Imagens molde
- **Você mesmo faz as imagens molde, sem custo:** copie [../starters/molde/molde.html](../starters/molde/molde.html) para `referencias-3d/<objeto>/1-molde/` e desenhe cada vista em SVG a partir das referências do usuário: silhueta exata em mm, chanfros, todas as peças, cotas e cada material com degradê que mostre o acabamento. Capture as vistas:
  ```bash
  node <skill>/scripts/capturar-vistas-three.mjs --url "file:///<caminho>/1-molde/molde.html" --saida referencias-3d/<obj>/1-molde --lado 1024
  ```
  e a folha completa para o usuário (a mesma URL sem `?vista`, em captura única).
- O molde manda na **forma** (proporção, peças, materiais). O acabamento de foto vem do render Cycles do Blender na etapa 2, também sem custo.
- Gerador de imagens só se o usuário já tiver um e pedir; custo, conta ou serviço pago pedem autorização (prompts em [prompts-3d.md](prompts-3d.md)).
- Vistas obrigatórias, **mesmo objeto, mesma escala e mesma luz**: `frente`, `lado`, `tres-quartos`, `costas`, `topo`, mais `detalhe-*` para cada material importante.
- Confira você mesmo antes de mostrar: proporções iguais entre vistas, mesmo número de partes, nada inventado. Gere de novo o que não bater.
- Salve em `referencias-3d/<objeto>/1-molde/<vista>.png`.
- **Peça ao usuário para verificar as imagens molde**: o que precisa alterar, ou se está aprovado. Ajuste até aprovar.

## Etapa 2. Molde 3D no Blender (opcional)
Só se o usuário escolheu o caminho com Blender.
- Rode `node <skill>/scripts/estado-3d.mjs --objeto <obj> exigir --etapa blender`.
- Modele **exatamente igual às imagens molde aprovadas**: carregue as vistas como imagens de fundo, ajuste silhueta e proporção vista por vista.
- Trabalhe por script Python, rodado em segundo plano com `node <skill>/scripts/blender/rodar.mjs --python <arquivo>.py` (acha o Blender sozinho e resume a saída); o script salva o `.blend` com `bpy.ops.wm.save_as_mainfile`. Guarde script e `.blend` em `referencias-3d/<objeto>/2-blender/`. Use as vistas do molde como guia de medidas (valores em mm do SVG), não por tentativa e erro com capturas.
- **Blender por linha de comando, não por MCP:** existe um servidor MCP de terceiros para Blender (addon dentro do Blender + servidor local), mas cada chamada devolve cena e capturas ao modelo e gasta muito mais tokens. Use o MCP só se o usuário pedir, para inspecionar a cena ao vivo.
- Qualidade máxima: modificadores de chanfro (Bevel) em toda aresta, subdivisão onde a forma é curva, materiais Principled BSDF físicos (metal, rugosidade, clearcoat, transmissão, IOR), microdetalhe procedural (escovado, granulado, riscos), luz de estúdio, Cycles com amostras suficientes para não ter ruído.
- **Poucos tokens:** medidas e materiais em constantes no topo do script; nas correções, edite só o necessário. Enquanto ajusta, renderize rascunho acrescentando `--lado 512 --amostras 32` no fim do comando abaixo. **Antes de pedir aprovação, renderize sem essas opções** (qualidade máxima).
- Renderize as **mesmas vistas** do molde com `scripts/blender/vistas.py` (mesmos nomes de arquivo):
  ```bash
  node <skill>/scripts/blender/rodar.mjs referencias-3d/<obj>/2-blender/<obj>.blend --python <skill>/scripts/blender/vistas.py -- --saida referencias-3d/<obj>/2-blender/vistas
  ```
- Monte a comparação com o molde (`scripts/comparar-vistas.mjs`, abaixo), mostre ao usuário e **peça aprovação**. Se houver alterações, faça e mostre de novo.
- Anote no `README.md` do objeto: medidas finais, lista de peças, cada material com seus valores (cor, metalness, roughness, IOR, clearcoat, transmissão). É o que a etapa 3 vai reproduzir.

## Etapa 3. Elemento em Three.js (< 200 KB)
- Rode `exigir --etapa threejs`.
- **Alvo:** o molde do Blender aprovado; sem Blender, as imagens molde aprovadas mais as fotos reais das referências (o molde em SVG manda na forma; as fotos, no acabamento).
- Recrie o alvo **somente com código Three.js**, partindo do módulo [../starters/modulos/07-elemento-threejs/](../starters/modulos/07-elemento-threejs/README.md).
- **Permitido:** `three` e seus complementos oficiais (`three/addons/...`) que não carregam arquivos: geometrias (`LatheGeometry`, `ExtrudeGeometry` com bevel, `TubeGeometry`, `RoundedBoxGeometry`, `mergeGeometries`), `MeshPhysicalMaterial`, `RoomEnvironment` + `PMREMGenerator`, texturas geradas em código (`CanvasTexture`, `DataTexture`), `ShaderMaterial` e `onBeforeCompile`, pós-processamento.
- **Proibido no elemento:** arquivos de modelo (`.glb`, `.gltf`, `.obj`, `.fbx`), imagens de textura (`.png`, `.jpg`, `.webp`, `.avif`), HDRI (`.hdr`, `.exr`), `.ktx2`, vídeo, sequência de quadros, loaders (`GLTFLoader`, `TextureLoader`, `RGBELoader`...), `data:` URI, e malha ou imagem escondida em base64 ou em listas grandes de números (vértices copiados do Blender). A forma sai de **parâmetros e funções** (perfil de revolução com poucos pontos de controle, curvas, laços).
- **Peso:** todo o código e os dados do elemento somam **menos de 200 KB sem compressão**. A biblioteca `three` não entra nessa conta. O pôster de reserva (captura do próprio render Three.js) entra.
- Mesmos valores de material anotados no molde (com Blender, os valores e a luz do Blender); tone mapping ACES ou AgX; sombra de contato; antialias.
- Renderize as mesmas vistas (`?vista=frente` etc.) com `scripts/capturar-vistas-three.mjs`, compare com o molde (e com o Blender, se houve), e rode o verificador. **Sem Blender**, tire a pasta `2-blender/vistas` do `--pastas`:
  ```bash
  node <skill>/scripts/capturar-vistas-three.mjs --url http://localhost:3100/ --saida referencias-3d/<obj>/3-threejs/vistas
  node <skill>/scripts/comparar-vistas.mjs --pastas referencias-3d/<obj>/1-molde,referencias-3d/<obj>/2-blender/vistas,referencias-3d/<obj>/3-threejs/vistas --saida referencias-3d/<obj>/comparacao.png
  node <skill>/scripts/verificar-3d.mjs src/elemento --poster public/poster-elemento.webp
  ```
  `verificar-3d.mjs` tem que dar **0 FAIL**.
- Mostre a comparação e a página interativa (girar com o mouse) e **peça aprovação**. Se houver alterações, faça e mostre de novo.

## Depois das três aprovações
- Vídeo-prévia do site ([aprovacoes.md](aprovacoes.md) §4) → aprovação → construção.
- Desempenho e plano B do elemento: [3d-leve.md](3d-leve.md) (pôster, carga tardia, render sob demanda, sem GPU).

## Limites (diga ao usuário quando valerem)
- Código em tempo real pode não ficar idêntico ao render do Blender (Cycles traça luz; o navegador aproxima). Mostre a diferença na comparação; o usuário decide.
- Pessoas, cabelo, tecido e vegetação são muito difíceis de deixar ultrarrealistas em menos de 200 KB de código. Se não der, avise **antes** e proponha o que simplificar; não declare aprovado.
- O verificador e o juiz rodam sem GPU: eles veem o pôster. O realismo do WebGL só se confere com GPU real.
