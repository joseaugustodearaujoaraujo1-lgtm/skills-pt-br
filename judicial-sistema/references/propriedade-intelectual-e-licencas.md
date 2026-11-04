# Propriedade intelectual e licenças

Normas: **Lei 9.609/1998** (programa de computador), **Lei 9.610/1998** (direitos autorais), **Lei 9.279/1996** (propriedade industrial: marcas e patentes), Código Civil (direitos da personalidade, art. 20 — imagem), Constituição (art. 5º, X e XXVII–XXVIII).

## 1. Software

- O programa de computador é protegido como obra intelectual; o registro no INPI é **facultativo** (a proteção nasce da criação), mas ajuda como prova de autoria e data.
- **Quem é dono do código?** Em contrato de trabalho/serviço, a regra da Lei 9.609 (art. 4º) atribui ao empregador/contratante o software desenvolvido na vigência do contrato **quando esse é o objeto da contratação**; em prestação de serviço autônomo, **defina por escrito** (cessão total, parcial, licença, exclusividade, prazo, território). Sem contrato, a disputa é fonte comum de processos.
- **Direitos morais** (autoria) não se transferem; direitos patrimoniais podem ser cedidos por escrito.
- **Código copiado** (Stack Overflow, GitHub, IA) pode carregar licença: verifique antes de reutilizar trechos relevantes.

## 2. Bibliotecas e licenças open source

Faça o **inventário de dependências** com suas licenças (`npx license-checker --summary`, `pnpm licenses list`, SBOM CycloneDX/SPDX) e registre.

| Família | Exemplos | O que exige |
|---------|----------|-------------|
| Permissivas | MIT, BSD, Apache-2.0, ISC | Manter aviso de copyright e licença; Apache-2.0 exige indicar alterações e inclui licença de patente |
| Copyleft forte | GPL-2.0/3.0 | Distribuir código-fonte derivado sob a mesma licença quando **distribuir** o software |
| Copyleft de rede | **AGPL-3.0** | Também obriga a disponibilizar o código se usuários interagirem com a aplicação **pela rede** (SaaS) |
| Copyleft fraco | LGPL, MPL | Obrigações limitadas aos componentes modificados/vinculação |
| Não comerciais / "source available" | CC BY-NC, BSL, SSPL, Elastic License | Restringem uso comercial ou SaaS; leia com cuidado |
| Sem licença | repositórios sem `LICENSE` | **Todos os direitos reservados**: não use |

Boas práticas: arquivo `THIRD_PARTY_NOTICES`/página "Licenças"; bloquear no CI licenças proibidas pela política do projeto; revisar mudança de licença em novas versões; **não** misturar AGPL/GPL em produto fechado sem análise.

## 3. Fontes, ícones, imagens, vídeos e música

- **Fontes** (inclusive Google Fonts) têm licenças próprias (OFL, Apache). Verifique o uso comercial e o *self-hosting*. Em sites com público brasileiro, hospedar localmente também reduz transferência de IP a terceiros (LGPD).
- **Ícones e ilustrações:** confira a licença (CC0, MIT, atribuição obrigatória, uso comercial).
- **Fotos e vídeos de banco de imagens:** licença que cubra uso comercial, web e a mídia desejada; guarde o comprovante.
- **Imagens de produtos:** use imagens fornecidas pelo fabricante/distribuidor com permissão; não copie de concorrentes.
- **Música/áudio:** licença de sincronização e de uso; não use faixas "de internet".
- **Pessoas:** direito de imagem exige **autorização**; uso comercial sem consentimento gera dano indenizável. Use modelos com termo de cessão de imagem.

## 4. Conteúdo gerado por IA

- Tratado como incerto no Brasil: a titularidade/autoria de obras geradas por IA **não está consolidada**; há projetos de lei em tramitação. Não presuma exclusividade.
- Confira os **termos da ferramenta** (uso comercial, restrições, propriedade da saída, plano pago).
- **Não gere** nem publique imagens de pessoas reais sem autorização, nem material que imite estilo/identidade de terceiros de forma enganosa, nem logotipos e marcas de terceiros.
- Guarde: prompt, ferramenta, versão, data, plano contratado (prova de origem).
- Revise saídas por *alucinações*: não publique "fatos", preços ou especificações geradas sem conferência.
- Se a IA for treinada ou *fine-tuned* com dados de terceiros, atenção a direitos autorais e LGPD.

## 5. Marcas, nomes e domínios

- **Antes de escolher o nome** da loja/produto: busca no **INPI** (marcas), em domínios e redes. Marca registrada em classe correlata pode gerar notificação extrajudicial e ação de abstenção/indenização.
- **Registro de marca** no INPI protege o nome e o logotipo na classe escolhida (para loja de informática, classes de comércio e de produtos). Considere registrar cedo.
- **Uso de marcas de terceiros** em loja: referência descritiva ao produto vendido é em geral aceita (ex.: "Placa de vídeo [marca] modelo X"), mas evite sugerir parceria oficial, usar o logotipo como se fosse seu, ou comprar palavras-chave de forma confusa.
- **Domínios:** registre em nome da empresa (não do freelancer); cuidado com domínios que imitam marcas conhecidas (*cybersquatting*).

## 6. Conteúdo e *scraping*

- **Copiar** textos, fichas técnicas, avaliações ou catálogos de outros sites pode violar direitos autorais, termos de uso e configurar concorrência desleal (Lei 9.279, art. 195).
- **Scraping** de dados pessoais atrai LGPD; respeite `robots.txt`, termos do site e limites; evite coletar dados pessoais sem base legal.
- **Avaliações e depoimentos:** use somente reais e autorizados; informe se patrocinados.

## 7. Checklist

- [ ] Contrato define a titularidade/licença do código e dos ativos criados.
- [ ] Inventário de dependências e licenças, com política de aprovação.
- [ ] `LICENSE` do próprio projeto definida; avisos de terceiros publicados.
- [ ] Fontes, ícones, imagens, vídeos e músicas com licença comprovada.
- [ ] Ativos gerados por IA: ferramenta/termos/uso comercial registrados; sem pessoas reais nem marcas de terceiros.
- [ ] Busca de anterioridade da marca no INPI; plano de registro.
- [ ] Domínio no nome do titular do negócio.
- [ ] Sem cópia de conteúdo de concorrentes.
