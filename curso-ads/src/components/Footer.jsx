function Footer() {
  return (
    <footer className="footer" id="rodape">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#inicio" className="logo">
              Curso ADS
            </a>

            <p>
              Para quem acredita que aprender é um jeito de seguir em
              frente.
            </p>

            <div className="social-icons" aria-label="Redes sociais">
              <span aria-label="Instagram">◎</span>
              <span aria-label="LinkedIn">in</span>
              <span aria-label="YouTube">▶</span>
            </div>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#cursos">Todos os cursos</a>
            <a href="#cursos">Trilhas de carreira</a>
            <a href="#cursos">Novos cursos</a>
            <a href="#cursos">Cursos para iniciantes</a>
          </div>

          <div className="footer-column">
            <h4>A plataforma</h4>
            <a href="#inicio">Nossa proposta</a>
            <a href="#cursos">Nossos instrutores</a>
            <a href="#cursos">Conheça os cursos</a>
          </div>

          <div className="footer-column">
            <h4>Conte com a gente</h4>
            <a href="#inicio">Central de ajuda</a>
            <a href="#inicio">Perguntas frequentes</a>
            <a href="#inicio">Fale conosco</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Curso ADS. Projeto demonstrativo.</span>
          <span>Feito para quem quer aprender.</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;