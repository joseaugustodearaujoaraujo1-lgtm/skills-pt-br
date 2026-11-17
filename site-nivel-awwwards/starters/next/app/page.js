// Página (Server Component). Conteúdo no HTML para SEO e LCP; o movimento vem do componente cliente <Motion /> (GSAP).
// Troque todo texto [entre colchetes] por conteúdo real do cliente.
import Motion from '../components/Motion';

const itens = [
  ['[Item 1]', '[Descrição curta e real]'], ['[Item 2]', '[Descrição curta e real]'], ['[Item 3]', '[Descrição curta e real]'],
  ['[Item 4]', '[Descrição curta e real]'], ['[Item 5]', '[Descrição curta e real]'],
];
const numeros = [[0, '', '[legenda 1: número real do cliente]'], [0, '', '[legenda 2]'], [0, '', '[legenda 3]']];
const passos = [['[Passo 1]', '[Descrição]'], ['[Passo 2]', '[Descrição]'], ['[Passo 3]', '[Descrição]']];

export default function Page() {
  return (
    <>
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <header className="topo" id="topo">
        <a className="marca" href="#inicio" aria-label="{{NOME}}, início">{{NOME}}</a>
        <nav aria-label="Principal"><ul>
          <li><a href="#colecao">[Seção 1]</a></li><li><a href="#numeros">[Seção 2]</a></li><li><a href="#contato">[Contato]</a></li>
        </ul></nav>
        <a className="topo-cta" href="#contato">[Ação principal]</a>
      </header>

      <main id="conteudo">
        {/* HERO: um protagonista na primeira dobra; título entra por CSS (linhas já divididas) */}
        <section className="hero" id="inicio" aria-labelledby="hero-titulo">
          <div className="hero-texto">
            <p className="hero-local">[Rótulo curto: o que é · onde]</p>
            <h1 id="hero-titulo">
              <span className="linha-mask"><span className="linha" style={{ '--i': 0 }}>[Título linha 1]</span></span>
              <span className="linha-mask"><span className="linha" style={{ '--i': 1 }}><em>[linha 2 em destaque.]</em></span></span>
            </h1>
            <p className="hero-sub">[Uma frase que diz o que você faz e para quem, com o diferencial concreto.]</p>
            <div className="hero-acoes">
              <a className="botao" href="#contato">[Ação principal]</a>
              <a className="link-seta" href="#colecao">[Ação secundária] <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <figure className="hero-midia" aria-hidden="true"><div className="hero-forma" /></figure>
          <ul className="hero-fatos" aria-label="Resumo">
            {['[Fato 1]', '[Fato 2]', '[Fato 3]'].map(f => <li key={f}><strong>{f}</strong> [detalhe]</li>)}
          </ul>
        </section>

        <section className="manifesto" aria-label="Manifesto">
          <p className="manifesto-texto">[Escreva 25 a 45 palavras sobre o que acredita e como trabalha. Texto real do cliente, sem inventar números nem depoimentos.]</p>
        </section>

        <section className="colecao" id="colecao" aria-labelledby="colecao-titulo">
          <div className="colecao-cab"><h2 id="colecao-titulo">[Título da coleção]</h2><p>[Frase de apoio]</p></div>
          <div className="trilho-janela"><ol className="trilho" role="list">
            {itens.map(([t, d]) => <li className="item" key={t}><div className="item-midia" /><h3>{t}</h3><p>{d}</p></li>)}
          </ol></div>
        </section>

        <section className="escura" id="numeros" aria-labelledby="numeros-titulo">
          <h2 id="numeros-titulo">[Título da seção escura]</h2>
          <ul className="numeros" aria-label="Números">
            {numeros.map(([n, suf, leg]) => <li key={leg}><span className="num" data-n={n} data-suf={suf}>{n}{suf}</span> {leg}</li>)}
          </ul>
        </section>

        <section className="passos" aria-labelledby="passos-titulo">
          <h2 id="passos-titulo">[Como funciona]</h2>
          <ul className="passos-lista">{passos.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ul>
        </section>

        <section className="contato" id="contato" aria-labelledby="contato-titulo">
          <h2 id="contato-titulo">[Chamada final.]</h2>
          <div className="contato-grade">
            <div><p className="contato-rotulo">[Endereço ou canal]</p><p>[Texto]</p></div>
            <div><p className="contato-rotulo">[Horário ou prazo]</p><p>[Texto]</p></div>
            <div className="contato-acao"><a className="botao botao-grande" href="#contato">[Ação principal]</a><p className="contato-nota">[Nota curta]</p></div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <p className="rodape-marca" aria-hidden="true">{{NOME}}</p>
        <div className="rodape-linha"><p>© {{ANO}} {{NOME}}</p><p>[Créditos das imagens e licenças, se houver]</p></div>
      </footer>
      <Motion />
    </>
  );
}
