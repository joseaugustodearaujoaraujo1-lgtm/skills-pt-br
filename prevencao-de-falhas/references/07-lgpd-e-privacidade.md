# 07 · LGPD e privacidade

Vale para qualquer sistema que colete, guarde, envie ou processe **dados pessoais** de pessoas no Brasil: cadastro, login, formulário de contato, pedido, chatbot, analytics, agente de IA que recebe mensagens de usuários.

> **Aviso:** este arquivo traduz a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) em requisitos técnicos e de produto. **Não é aconselhamento jurídico.** Os artigos citados servem de ponto de partida; confira o texto vigente em planalto.gov.br e as orientações da ANPD em gov.br/anpd, e consulte advogado ou encarregado (DPO) em casos de risco, dados sensíveis ou grande escala.

## Sumário
- LGP-01 Coletar dados sem finalidade nem base legal
- LGP-02 Consentimento e transparência mal feitos
- LGP-03 Direitos do titular sem como exercer
- LGP-04 Dados sensíveis e de crianças e adolescentes sem cuidado extra
- LGP-05 Incidente de segurança sem plano de resposta
- LGP-06 Compartilhar dados com terceiros, inclusive IA, sem controle

## Por onde começar (mínimo viável para projeto pequeno)

1. **Inventário:** liste quais dados pessoais o sistema guarda, onde, por quê e por quanto tempo (uma tabela de 10 linhas já ajuda).
2. **Colete só o necessário** para a finalidade (minimização).
3. **Política de privacidade** em linguagem simples, acessível no site, dizendo o que é coletado, para quê, com quem é compartilhado e como pedir exclusão.
4. **Canal de contato** do responsável (e-mail do encarregado) funcionando.
5. **Segurança básica** do restante desta skill (senha com hash, HTTPS, controle de acesso, log de segurança, backup).
6. **Plano de incidente** de uma página (LGP-05).

Sanções previstas na lei (art. 52) incluem advertência, publicização da infração, bloqueio ou eliminação dos dados e multa simples de até 2% do faturamento, limitada a R$ 50 milhões por infração. Além disso, vazamento destrói confiança.

---

## LGP-01 · Coletar dados sem finalidade nem base legal
**Gravidade:** Alto · LGPD arts. 6 e 7

**Por que importa:** a lei exige que todo tratamento tenha **finalidade específica** e uma **base legal** (consentimento, execução de contrato, obrigação legal, legítimo interesse, entre outras do art. 7). Formulários que pedem CPF, data de nascimento e endereço "por via das dúvidas" violam o princípio da necessidade (art. 6, III).

**Como detectar:** campos de formulário que nenhuma funcionalidade usa; tabelas com colunas pessoais nunca lidas; dados coletados "para análise futura".

**Como corrigir:**
1. Para cada campo pessoal, escreva: **finalidade**, **base legal** e **prazo de guarda**. Se não consegue escrever, remova o campo.
2. Peça o dado só no momento em que ele é necessário (CPF no pagamento, não no cadastro).
3. Defina retenção e exclusão automática (OPS-13).
4. Registre as operações de tratamento (art. 37): um documento ou planilha atualizada basta em projetos pequenos.

**Como testar:** pegue cada coluna da tabela de usuários e responda "para que serve e quando será apagada?".

---

## LGP-02 · Consentimento e transparência mal feitos
**Gravidade:** Alto · LGPD arts. 8 e 9

**Por que importa:** quando a base é consentimento, ele deve ser **livre, informado e inequívoco**, para finalidades determinadas, e **revogável**. Caixa já marcada, consentimento embutido nos termos de uso ou "aceito tudo para continuar" são práticas frágeis. O titular também tem direito a informação clara sobre o tratamento (art. 9).

**Como corrigir:**
1. Caixas de consentimento **desmarcadas por padrão**, uma por finalidade (ex.: e-mail marketing separado do cadastro).
2. Texto simples dizendo o que será feito e com quem será compartilhado, com link para a política de privacidade.
3. **Registre** o consentimento: quem, quando, qual versão do texto e como foi dado. Permita revogar tão fácil quanto foi dar.
4. Banner de cookies: cookies não essenciais (analytics, publicidade) só depois do aceite; recusar deve ser tão fácil quanto aceitar.

```js
// Registro mínimo de consentimento (guarde numa tabela própria)
export function registrarConsentimento(db, { usuarioId, finalidade, versaoTexto, ip }) {
  return db.execute(
    "INSERT INTO consentimentos (usuario_id, finalidade, versao_texto, ip, concedido_em) VALUES (?, ?, ?, ?, NOW())",
    [usuarioId, finalidade, versaoTexto, ip]
  );
}
```

**Como testar:** crie uma conta e confirme que nada opcional veio marcado; revogue e confirme que o envio de e-mails para e que o registro mostra a data da revogação.

---

## LGP-03 · Direitos do titular sem como exercer
**Gravidade:** Alto · LGPD arts. 18 e 19

**Por que importa:** o titular pode pedir **confirmação** de que seus dados são tratados, **acesso**, **correção**, **anonimização, bloqueio ou eliminação** de dados desnecessários, **portabilidade**, informação sobre com quem os dados foram compartilhados e **revogação do consentimento**. O art. 19 prevê resposta imediata em formato simplificado ou declaração completa em até 15 dias.

**Como corrigir:**
1. Um canal claro (e-mail do encarregado e/ou página "Meus dados" no sistema).
2. **Exportar meus dados** (JSON ou CSV) e **excluir minha conta** implementados de verdade, apagando também de backups no prazo da política, logs com dados pessoais, índices de busca, caches e bases vetoriais de IA.
3. Exclusão **verifica a identidade** do solicitante (para não permitir que terceiros apaguem a conta de outra pessoa) e registra o pedido.
4. Dados que a lei obriga a guardar (fiscais, por exemplo) são separados e informados: "não podemos apagar X por obrigação legal até Y".

**Como testar:** peça a exclusão da sua conta de teste e procure o e-mail dela em todas as tabelas, logs e armazenamentos; nada deve restar, exceto o que está justificado.

---

## LGP-04 · Dados sensíveis e de crianças e adolescentes sem cuidado extra
**Gravidade:** Crítico · LGPD arts. 11 e 14

**Por que importa:** dados **sensíveis** (saúde, origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, dado genético ou biométrico, vida sexual) têm regime mais rígido, com hipóteses legais mais restritas. Dados de **crianças e adolescentes** devem ser tratados no melhor interesse deles e, no caso de crianças, em regra com consentimento específico de um dos pais ou responsável. Um sistema de clínica, de igreja ou escolar cai aqui.

**Como corrigir:**
1. Identifique se qualquer campo ou conteúdo livre pode conter dado sensível (um chat de clínica receberá sintomas).
2. Colete o mínimo, com base legal adequada, criptografia em repouso, acesso restrito por papel e log de acesso (OPS-14).
3. Nunca use esses dados para marketing ou treinamento de modelo sem base legal clara.
4. Para menores: verifique a idade quando fizer sentido, peça autorização do responsável, evite coleta além do indispensável e linguagem de interface adequada.
5. Em mensagens e notificações (e-mail, SMS, WhatsApp), **não coloque o dado sensível na pré-visualização** ("Lembrete da sua sessão amanhã às 9h", sem diagnóstico).

**Como testar:** revise logs, e-mails de notificação e telas de listagem procurando dados sensíveis expostos sem necessidade.

---

## LGP-05 · Incidente de segurança sem plano de resposta
**Gravidade:** Alto · LGPD arts. 46 a 48

**Por que importa:** o controlador deve adotar medidas de segurança (art. 46) e, quando um incidente puder acarretar risco ou dano relevante aos titulares, **comunicar a ANPD e os titulares** (art. 48). A regulamentação da ANPD define o prazo de comunicação (a Resolução CD/ANPD nº 15/2024 fixa **3 dias úteis** para o caso geral; **confirme o prazo e o procedimento vigentes** no site da ANPD). Sem plano, o prazo passa enquanto a equipe descobre o que aconteceu.

**Como corrigir:** um plano de uma página, escrito **antes**:

| Item | O que registrar |
|---|---|
| Responsável | quem lidera e quem o substitui; contato do encarregado |
| Detectar | quais alertas indicam incidente (OPS-07, OPS-14) |
| Conter | revogar tokens e chaves, derrubar acesso comprometido, isolar o serviço (OPS-06) |
| Avaliar | quais dados, de quantas pessoas, que risco para elas; guarde evidências |
| Comunicar | modelo de aviso à ANPD e aos titulares, canal e prazo |
| Aprender | causa raiz e correção registrada; teste do que falhou |

**Como testar:** simule um incidente ("a chave do banco vazou às 14h") e cronometre quanto tempo leva para responder cada linha da tabela.

---

## LGP-06 · Compartilhar dados com terceiros, inclusive IA, sem controle
**Gravidade:** Alto · LGPD arts. 33, 39 e 42 a 44

**Por que importa:** cada serviço que recebe dados pessoais (hospedagem, e-mail, pagamento, analytics, **provedor de LLM**) é um **operador** ou outro controlador, e o responsável continua respondendo pelo tratamento. Enviar mensagens de usuários a uma API de IA sem saber como ela guarda ou usa esses dados, ou em país sem regras equivalentes, é um risco jurídico e de segurança (AGT-06). Há regras específicas para **transferência internacional** (art. 33).

**Como corrigir:**
1. Mantenha a **lista de operadores** e para que cada um recebe dados.
2. Leia, para cada um: política de privacidade, se usa os dados para treinar modelos, retenção, localização e se existe contrato ou termo de tratamento de dados (DPA).
3. **Minimize o que sai:** remova ou mascare nome, CPF, e-mail e telefone antes de enviar texto a uma IA externa, quando a tarefa não precisar deles.
4. Para dados sensíveis (LGP-04), prefira provedor com garantias contratuais, ou processamento local.
5. Informe na política de privacidade com quem os dados são compartilhados.

**Como testar:** monte o diagrama de fluxo de dados (quem recebe o quê) e confira se cada seta tem finalidade, base legal e aviso na política.

---

## Quando chamar um profissional

Procure advogado especializado ou encarregado (DPO) antes de: tratar dados sensíveis ou de menores em escala, usar IA para decisões automatizadas sobre pessoas (art. 20), transferir dados para outros países, fazer perfis comportamentais, ou responder a um incidente real.
