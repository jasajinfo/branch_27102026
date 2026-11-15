import "./Banner.css";

function Banner({ search, setSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    document.getElementById("cursos")?.scrollIntoView({ behavior: "smooth" });
  }

  const quickSearch = (topic) => {
    setSearch(topic);
    document.getElementById("cursos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow"><span className="eyebrow-mark" aria-hidden="true">✦</span> SEU FUTURO COMEÇA AQUI</span>
          <h1>Aprenda hoje. <br />Transforme seu <em>amanhã.</em></h1>
          <p className="hero-description">
            Cursos para desenvolver habilidades reais, no seu ritmo e do seu jeito. Explore novas oportunidades na tecnologia.
          </p>

          <form className="search-box" onSubmit={handleSubmit} role="search">
            <label className="sr-only" htmlFor="busca">Pesquisar cursos</label>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>
            </svg>
            <input
              id="busca"
              type="search"
              placeholder="O que você deseja aprender?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" className="button button-primary">Buscar cursos <span aria-hidden="true">→</span></button>
          </form>

          <div className="trending" aria-label="Sugestões de cursos">
            <span>Explore:</span>
            <button type="button" onClick={() => quickSearch("React")}>React</button>
            <button type="button" onClick={() => quickSearch("Python")}>Python</button>
            <button type="button" onClick={() => quickSearch("Inteligência artificial")}>Inteligência artificial</button>
          </div>

          <div className="hero-feature" aria-label="Características da plataforma">
            <span><span className="feature-check" aria-hidden="true">✓</span> Conteúdos práticos</span>
            <span><span className="feature-check" aria-hidden="true">✓</span> Aprenda no seu ritmo</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Ilustração de uma pessoa estudando online">
          <div className="visual-glow" aria-hidden="true"/>
          <div className="image-frame">
            <img src="/imagens/banner.png" alt="Pessoa estudando com um computador" />
          </div>
          <div className="hero-small-tag"><span aria-hidden="true">✦</span> Evolua a cada aula</div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
