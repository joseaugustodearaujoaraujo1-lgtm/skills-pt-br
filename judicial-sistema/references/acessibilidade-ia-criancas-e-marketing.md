# Acessibilidade, IA, crianças, cookies e marketing

## 1. Acessibilidade digital

- **Lei Brasileira de Inclusão (Lei 13.146/2015), art. 63:** é **obrigatória a acessibilidade nos sítios da internet** mantidos por empresas com sede ou representação comercial no País ou por órgãos de governo, para uso pela pessoa com deficiência, garantindo acesso às informações disponíveis, conforme as melhores práticas e diretrizes de acessibilidade adotadas internacionalmente.
- Padrão de referência: **WCAG 2.2, nível AA** (e eMAG para governo). Falta de acessibilidade já gera ações do Ministério Público, associações e consumidores.
- Requisitos práticos: HTML semântico; texto alternativo; contraste ≥ 4,5:1; navegação por teclado com foco visível; rótulos de formulário; mensagens de erro claras; legendas e transcrição em vídeos; sem *flash* perigoso; respeito a `prefers-reduced-motion`; alvos de toque ≥ 24×24 px; evitar *captcha* inacessível; leitor de tela testado (NVDA/VoiceOver).
- Declaração de acessibilidade com canal de contato é boa prática.
- Cuidado: estilo neumórfico e animações de scroll costumam falhar em contraste e movimento; trate nos tokens e no motion.

## 2. Cookies e rastreadores

- **Cookies estritamente necessários** (sessão, segurança, carrinho) não precisam de consentimento, mas devem ser informados.
- **Analytics, publicidade, personalização, pixels e embeds de terceiros** → base legal adequada (normalmente consentimento) **antes** de carregar o rastreador.
- Banner com **aceitar, recusar e configurar** em mesmo nível de destaque; sem *dark patterns*; registro da escolha; possibilidade de mudar depois (link "Preferências de cookies" no rodapé).
- Política de cookies: lista por categoria (nome, finalidade, prazo, terceiros).
- Seguir o **Guia Orientativo de Cookies** da ANPD. Considere ferramentas de analytics sem cookies e hospedagem local de fontes/scripts para reduzir transferências a terceiros.

## 3. Marketing, e-mail e mensagens

- **Opt-in claro**, finalidade informada, **descadastro com 1 clique** e respeito imediato; nada de listas compradas.
- Em cadastro/compra, só use o e-mail para marketing com base legal (consentimento ou legítimo interesse documentado); transações (pedido, recuperação de senha) são outra finalidade.
- Identifique anúncios e conteúdo patrocinado; siga o **CDC** (publicidade enganosa/abusiva) e o **Código do CONAR**.
- **Influenciadores e depoimentos:** divulgação de parceria; depoimentos reais e autorizados.
- **WhatsApp e SMS:** consentimento e política da plataforma; frequência razoável.
- **Sorteios e promoções:** regras específicas (Lei 5.768/71 e regulamentação) podem exigir autorização prévia; consulte antes de lançar "sorteio" ou "concurso".
- **Telemarketing:** respeitar listas de bloqueio e normas aplicáveis.

## 4. Crianças e adolescentes

- **LGPD art. 14:** tratamento no **melhor interesse** da criança/adolescente; consentimento específico e em destaque de um dos pais/responsável para crianças, esforço razoável de verificação, informações simples e acessíveis; não condicionar jogos/aplicações ao fornecimento de dados além do necessário.
- **ECA Digital (Lei 15.211/2025)** e regulamentos: normas específicas para produtos e serviços digitais direcionados a, ou provavelmente acessados por, crianças e adolescentes (verificação de idade, proteção por padrão, supervisão parental, restrições a publicidade e perfilamento, etc.). **Verifique vigência, prazos de adaptação e regulamentação** antes de lançar; o assunto está em evolução.
- Prática: se seu público pode incluir menores (jogos, escolas, comunidades de games), implemente verificação de idade proporcional, configurações de privacidade mais restritivas por padrão, sem anúncios personalizados para menores e sem *loot boxes* ou mecânicas manipulativas dirigidas a eles.
- Sistema **não** destinado a menores: declare a restrição de idade nos termos e evite coletar dados de menores.

## 5. Inteligência artificial

- **Decisões automatizadas** que afetem interesses do titular (crédito, preço personalizado, bloqueio de conta, triagem): **direito de revisão** e informação sobre critérios (LGPD art. 20), respeitados os segredos comercial e industrial. Mantenha *humano no circuito* em decisões relevantes.
- **Chatbots:** informe que é IA; não colete dados sensíveis desnecessários; **não** envie dados pessoais a provedores de IA sem base legal e contrato (DPA); verifique retenção/treino pelos dados do cliente; evite que o bot **prometa** condições que a loja não cumprirá (a oferta pode vincular — CDC art. 30).
- **Prompt injection e vazamento:** isole dados, limite ferramentas, valide saídas, registre ações (ver skills de segurança de IA).
- **Direitos autorais e imagem:** ver `propriedade-intelectual-e-licencas.md`; deepfakes e imitação de pessoas podem configurar crimes e dano moral.
- **Regulação de IA no Brasil** está em tramitação (projeto de lei específico) e deve ser **monitorada**; adote por padrão governança: inventário de modelos, avaliação de risco, testes de viés e documentação.
- **Conteúdo gerado por IA em produtos** (descrições, especificações): revise para não induzir a erro o consumidor.

## 6. Dados de saúde, biometria e localização

- **Biometria/saúde são sensíveis** (LGPD art. 11): evite, ou use com base legal específica, RIPD, minimização, armazenamento do *template* e não da imagem original, criptografia reforçada.
- **Geolocalização precisa:** coletar só quando necessário, com aviso e controle do usuário.

## 7. Checklist

- [ ] Auditoria WCAG 2.2 AA (ferramentas + teste manual com teclado/leitor de tela).
- [ ] Banner de cookies com recusa; rastreadores só após consentimento.
- [ ] Política de cookies e preferências acessíveis.
- [ ] E-mail marketing com opt-in e descadastro 1 clique.
- [ ] Regras de promoções/sorteios verificadas.
- [ ] Fluxo para menores definido (excluir, restringir ou proteger).
- [ ] Verificação da vigência do ECA Digital e regulamentos aplicáveis.
- [ ] IA: transparência, contrato com provedor, revisão humana para decisões relevantes.
- [ ] Dados sensíveis/biométricos evitados ou protegidos com RIPD.
