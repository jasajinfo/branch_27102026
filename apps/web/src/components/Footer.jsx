import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="rodape">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#inicio" className="logo"><span className="logo-symbol" aria-hidden="true">✳</span><span>curso<span className="logo-accent">ads</span><span className="logo-dot">.</span></span></a>
            <p>Aprender transforma possibilidades. Descubra conteúdos para acompanhar cada passo da sua evolução.</p>
            <span className="footer-tag">Tecnologia · Conhecimento · Carreira</span>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#cursos">Todos os cursos</a>
            <a href="#cursos">Cursos para iniciantes</a>
            <a href="#cursos">Novas habilidades</a>
          </div>
          <div className="footer-column">
            <h4>A plataforma</h4>
            <a href="#inicio">Nossa proposta</a>
            <a href="#cursos">Catálogo de cursos</a>
            <a href="#inicio">Voltar ao topo</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Curso ADS · Projeto acadêmico demonstrativo.</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
