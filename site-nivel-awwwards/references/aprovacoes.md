# Portões de aprovação: referências, molde e prévia do site

Três paradas obrigatórias antes de construir um site com elemento 3D. Cada uma termina com uma pergunta ao usuário (use `AskUserQuestion` quando disponível) e só avança com aprovação explícita.

## 1. Imagens de referência do elemento 3D
- **Sempre que possível, peça ao usuário.** Fotos do produto real, links de loja ou fabricante, prints. Peça vários ângulos (frente, perfil, 3/4, verso) e detalhes de material.
- **Exceção: elemento inventado.** Personagem ou objeto de uma história, mascote, peça que não existe: não há imagem na internet. Peça descrição (forma, tamanho, cores, materiais, clima) e, se houver, esboço ou referências de estilo.
- **Se o usuário pedir que você procure:** pesquise fontes abertas, mostre o que achou com o link e só use depois do "ok".
- Salve tudo em `referencias-3d/<objeto>/` com um `README.md` (fonte, direitos, o que não copiar).
- **Marcas de terceiros** (logo, nome, emblema, desenho registrado): use a referência só para forma, material e luz. O molde e o site saem **sem a marca**, a menos que o usuário seja o dono ou tenha licença. Diga isso ao usuário.

## 2. Molde ultrarrealista → "ficou bom ou precisa alterar?"
- Gere a folha de 4 vistas (frente, perfil, 3/4, verso) na mesma escala, fundo neutro, luz de estúdio, sem texto (modelos em `prompts-3d.md`). Anexe as imagens de referência ao gerador quando ele aceitar.
- Mostre o molde ao usuário e pergunte. Opções: **Aprovar** · **Alterar** (o usuário descreve: cor, proporção, detalhe, material).
- Ajuste e mostre de novo até aprovar. Registre a versão aprovada no README.

## 3. Vídeo-prévia de como o SITE vai ficar → "ficou bom ou precisa alterar?"
- Depois do molde aprovado e **antes** de construir, mostre em vídeo como o site vai ficar: hero, o objeto 3D em cena, o scroll de assinatura e 2–3 seções, com a paleta, a tipografia e o estilo escolhidos.
- Como gerar (do mais fiel ao mais rápido):
  1. **Protótipo gravado:** monte só o hero, o objeto 3D e o scroll principal e grave (screencast por CDP/Playwright, montado em MP4 com ffmpeg). É o que mais se parece com o resultado.
  2. **Vídeo gerado por IA** com a ferramenta disponível na conta do usuário (ex.: Veo pelo Gemini), descrevendo layout e movimento e anexando o molde. Avise que é ilustrativo.
- Entregue de forma que o usuário consiga ver no celular (MP4 H.264, `playsinline`) e pergunte: **Aprovar** · **Alterar** (descrever).
- Só depois da aprovação construa o site completo e rode o portão de qualidade.

## Ordem resumida
referências → molde → **aprovação** → vídeo-prévia do site → **aprovação** → construção → verificação.
