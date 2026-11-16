function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <a href="#inicio" className="logo">
          Curso ADS
        </a>

        <nav className="menu" aria-label="Menu principal">
          <a href="#cursos">Explorar cursos</a>
          <a href="#cursos">Trilhas de carreira</a>
          <a href="#rodape">Para empresas</a>
        </nav>

        <div className="header-actions">
          <a href="#cursos" className="login-link">
            Explorar
          </a>

          <a href="#cursos" className="button button-primary">
            Comece agora
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;