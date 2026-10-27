import { useEffect, useRef } from "react";

function VideoPlayer({ course, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!course) return;

    const previousFocus = document.activeElement;

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [course, onClose]);

  if (!course) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="close-button"
          onClick={onClose}
          aria-label="Fechar vídeo"
        >
          ✕
        </button>

        <h2 id="video-title">{course.title}</h2>

        <div className="video-container">
          <iframe
            src={`https://youtu.be/EJVxyE1VR7I${course.videoId}`}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;