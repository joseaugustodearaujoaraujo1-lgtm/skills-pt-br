# Entrega e imagens (passo 6 do fluxo)

Só entregue depois dos três portões do passo 5 (verificador com 0 FAIL, fidelidade se for réplica, juiz LIBERADO).

## 1. Relatório
- Formato: [base-design-completo/_SKILL-original.md](base-design-completo/_SKILL-original.md) §6, com a tabela de [rubrica.md](rubrica.md) ("Como relatar").
- Inclua: notas do juiz por critério (e dos dois juízes, se perto do corte), relatório do verificador, Lighthouse, peso da primeira dobra, componentes das plataformas com origem e licença ([plataformas.md](plataformas.md)) e as decisões tomadas sem o usuário (`design/DECISOES.md`).
- Diga o que **não** foi testado: celular real, redes lentas, outros navegadores, leitor de tela, o 3D com GPU (o juiz vê só o plano B).
- Não declare "nível Awwwards": declare o que foi medido.

## 2. Imagens e vídeos
- **Não gere imagem ou vídeo essencial** (pessoas, cenário-chave, vídeo do hero, foto do produto real). Liste em `IMAGENS.md` na raiz do projeto, no formato de [../galeria/IMAGENS-PARA-GERAR.md](../galeria/IMAGENS-PARA-GERAR.md): número, arquivo que será trocado, formato (proporção e tamanho mínimo) e prompt em português ("foto ultra-realista, luz cinematográfica, sem texto e sem logotipo").
- No site, cada imagem da lista fica num placeholder **sem texto à vista**, com o nome em `data-imagem="..."`, no tamanho, na proporção e nas cores finais ([elementos.md](elementos.md) §3). O verificador reprova nota de produção à vista.
- Imagem não essencial: placeholder do mesmo tamanho e proporção, em cor neutra da paleta.
- Com 3D: entregue `referencias-3d/<objeto>/` (referências, imagens molde, Blender, vistas Three.js, `comparacao.png`, `estado.json` com as aprovações) e o resultado de `verificar-3d.mjs`. Diga se o realismo do WebGL foi conferido com GPU real.
- Quando o usuário mandar os arquivos: converter para WebP (AVIF opcional), recortar na proporção reservada, trocar o placeholder e rodar o verificador e o juiz de novo.

## 3. Direitos
Marcas, fotos e texturas de terceiros só como estudo. Em projeto de cliente, use material próprio ou licenciado, com crédito das fontes abertas no relatório.
