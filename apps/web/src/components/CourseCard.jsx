import "./CourseCard.css";

function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <div className="course-image">
        <img src={course.image} alt={`Imagem ilustrativa do curso ${course.title}`} loading="lazy" />
        {course.badge && <span className="course-badge">{course.badge}</span>}
      </div>

      <div className="course-content">
        <span className="course-category">{course.category}</span>
        <h3>{course.title}</h3>
        <p className="course-teacher">Com {course.teacher}</p>

        <div className="course-meta">
          <span><span aria-hidden="true">◷</span> {course.duration}</span>
          <span>{course.level}</span>
        </div>

        <div className="course-rating">
          <span aria-hidden="true" className="star">★</span>
          <strong>{course.rating}</strong>
          <small>({course.reviews})</small>
        </div>

        <div className="course-bottom">
          <div className="price-block">
            <small>Investimento ilustrativo</small>
            <div><span className="price-prefix">R$</span> <strong className="price">{course.price}</strong></div>
          </div>
          <button type="button" className="course-button" onClick={() => onSelect(course)} aria-label={`Assistir à aula de ${course.title}`}>
            <span>Ver aula</span> <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
