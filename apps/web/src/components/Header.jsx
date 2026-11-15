import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-content">
        <a href="#inicio" className="logo" onClick={closeMenu} aria-label="Curso ADS — início">
          <span className="logo-symbol" aria-hidden="true">✳</span>
          <span>curso<span className="logo-accent">ads</span><span className="logo-dot">.</span></span>
        </a>

        <button
          type="button"
          className="mobile-menu-button"
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>

        <nav className={`menu ${menuOpen ? "menu-open" : ""}`} id="site-navigation" aria-label="Navegação principal">
          <a href="#inicio" onClick={closeMenu}>Início</a>
          <a href="#cursos" onClick={closeMenu}>Explorar cursos</a>
          <a href="#rodape" onClick={closeMenu}>Sobre a plataforma</a>
          <a href="#cursos" className="button button-primary menu-cta" onClick={closeMenu}>Comece agora <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
