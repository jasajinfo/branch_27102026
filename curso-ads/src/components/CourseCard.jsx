function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <div className="course-image">
        <img src={course.image} alt="" />

        {course.badge && (
          <span className="course-badge">{course.badge}</span>
        )}
      </div>

      <div className="course-content">
        <span className="course-category">{course.category}</span>

        <h3>{course.title}</h3>

        <p className="course-teacher">com {course.teacher}</p>

        <p className="course-details">
          ◷ {course.duration} · {course.level}
        </p>

        <p className="course-rating">
          <span>★</span> {course.rating}{" "}
          <small>({course.reviews})</small>
        </p>

        <div className="course-bottom">
          <div>
            <span className="price-prefix">R$</span>{" "}
            <strong className="price">{course.price}</strong>

            <small className="installments">Valor ilustrativo</small>
          </div>

          <button
            type="button"
            className="course-button"
            onClick={() => onSelect(course)}
            aria-label={`Assistir à aula de ${course.title}`}
          >
            ↗
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;