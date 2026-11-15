import { useEffect, useRef } from "react";
import "./VideoPlayer.css";

function VideoPlayer({ course, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!course) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [course, onClose]);

  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="video-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-topbar">
          <div>
            <span className="modal-eyebrow">AULA EM VÍDEO</span>
            <h2 id="video-title">{course.title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="close-button" onClick={onClose} aria-label="Fechar vídeo">✕</button>
        </div>
        <div className="video-container">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${course.videoId}?rel=0`}
            title={`Vídeo do curso: ${course.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="video-caption">Vídeo demonstrativo hospedado no YouTube. A disponibilidade depende do criador.</p>
      </div>
    </div>
  );
}

export default VideoPlayer;
