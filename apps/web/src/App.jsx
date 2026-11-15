import { useCallback, useState } from "react";

import Header from "./components/Header";
import Banner from "./components/Banner";
import CourseCard from "./components/CourseCard";
import VideoPlayer from "./components/VideoPlayer";
import Footer from "./components/Footer";

import { courses } from "./data/courses";

import "./App.css";

const filters = [
  { id: "todos", label: "Em destaque" },
  { id: "populares", label: "Mais populares" },
  { id: "novidades", label: "Novidades" },
  { id: "iniciantes", label: "Para começar do zero" },
];

function App() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const closeVideo = useCallback(() => {
    setSelectedCourse(null);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      course.title.toLowerCase().includes(searchText) ||
      course.category.toLowerCase().includes(searchText) ||
      course.teacher.toLowerCase().includes(searchText);

    const matchesFilter =
      activeFilter === "todos" ||
      course.filter === activeFilter ||
      (activeFilter === "iniciantes" &&
        course.level.toLowerCase().includes("iniciante"));

    return matchesSearch && matchesFilter;
  });

  function showAllCourses() {
    setSearch("");
    setActiveFilter("todos");
  }

  return (
    <>
      <Header />

      <main>
        <Banner search={search} setSearch={setSearch} />

        <section className="courses-section" id="cursos">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span>✦</span> O PRÓXIMO PASSO É SEU
                </span>

                <h2>Conhecimento que acompanha seus objetivos.</h2>
                <p className="section-subtitle">Encontre a próxima habilidade que vai fazer a diferença na sua trajetória.</p>
              </div>

              <button
                type="button"
                className="button button-outline"
                onClick={showAllCourses}
              >
                Ver todos os cursos ↗
              </button>
            </div>

            <div className="filters" aria-label="Filtros de cursos">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-button ${
                    activeFilter === filter.id ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <p className="results-count" aria-live="polite">{filteredCourses.length} {filteredCourses.length === 1 ? "curso encontrado" : "cursos encontrados"}</p>

            {filteredCourses.length > 0 ? (
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onSelect={setSelectedCourse}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-message">
                Nenhum curso encontrado. Experimente outra busca ou
                escolha outro filtro.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <VideoPlayer course={selectedCourse} onClose={closeVideo} />
    </>
  );
}

export default App;