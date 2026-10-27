function Banner({ search, setSearch }) {
  function handleSubmit(event) {
    event.preventDefault();

    document
      .getElementById("cursos")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow">
            <span>✦</span> SEU FUTURO ESTÁ EM MOVIMENTO
          </span>

          <h1>
            Aprenda hoje.
            <br />
            Abra novos
            <br />
            <em>caminhos.</em>
          </h1>

          <p className="hero-description">
            Conhecimento que vira prática. Descubra cursos com quem
            vive o mercado e dê o próximo passo na sua carreira.
          </p>

          <form className="search-box" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="busca">
              Pesquisar cursos
            </label>

            <span aria-hidden="true" className="search-icon">
              ⌕
            </span>

            <input
              id="busca"
              type="search"
              placeholder="O que você quer aprender?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" className="button button-primary">
              Encontrar meu curso
            </button>
          </form>

          <p className="trending">
            Em alta: <strong>Inteligência artificial</strong>
            <span> · </span>
            <strong>React</strong>
            <span> · </span>
            <strong>Python</strong>
          </p>

          <p className="hero-rating">
            <span>★★★★★</span>
            <strong> 4,9/5</strong> · Mais de 35 mil pessoas aprendendo
          </p>
        </div>

        <div className="hero-visual">
          <img
            src="/imagens/banner.png"
            alt="Pessoa estudando em frente a um computador"
         />

          <div className="hero-label">✦ No seu tempo. Do seu jeito.</div>

          <div className="progress-card">
            <div className="progress-heading">
              <span className="play-icon">▶</span>

              <div>
                <small>SEU PRÓXIMO CAPÍTULO</small>
                <strong>Uma habilidade de cada vez.</strong>
              </div>
            </div>

            <div className="progress-track">
              <div className="progress-fill"></div>
            </div>

            <div className="progress-caption">
              <span>Mais perto do seu objetivo</span>
              <strong>68%</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
