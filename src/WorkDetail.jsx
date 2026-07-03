import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Reveal from "./Reveal";
import Flipbook from "./Flipbook";
import BillFlip from "./BillFlip";
import { CATEGORIES, PROJECTS } from "./projectsData";
import "./WorkDetail.css";

// Order here doubles as the cycle order for the arrows below.
const STORY_STEPS = [
  { key: "context", label: "Context" },
  { key: "problem", label: "Problem" },
  { key: "process", label: "Process" },
  { key: "outcome", label: "Outcome" },
];

const PLACEHOLDER_MARQUEE_COUNT = 5;

function ImagePlaceholderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WorkDetail() {
  const { id } = useParams();
  const project = PROJECTS.find((p) => String(p.id) === id);
  const [step, setStep] = useState(0);

  // Same component instance persists across /work/:id -> /work/:otherId
  // (React Router doesn't remount on a param-only change), so without
  // this the story would stay on whatever step you'd left it on.
  useEffect(() => {
    setStep(0);
  }, [id]);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const activeStep = STORY_STEPS[step];
  const goPrev = () =>
    setStep((s) => (s - 1 + STORY_STEPS.length) % STORY_STEPS.length);
  const goNext = () => setStep((s) => (s + 1) % STORY_STEPS.length);

  const tagLabel = CATEGORIES.filter((cat) =>
    project.categories.includes(cat.id)
  )
    .map((cat) => cat.label)
    .join(" · ");

  const marqueeImages =
    project.processImages.length > 0
      ? project.processImages
      : Array(PLACEHOLDER_MARQUEE_COUNT).fill(null);

  return (
    <section className="section work-detail">
      <Reveal as={Link} to="/work" className="work-detail-back">
        <span className="work-detail-back-arrow" aria-hidden="true">
          ←
        </span>
        Back to work
      </Reveal>

      <Reveal className="work-detail-hero">
        {project.embedUrl ? (
          <iframe
            src={project.embedUrl}
            title={`${project.title} — ${
              project.embedUrl.includes("figma.com") ? "Figma" : "Live demo"
            }`}
            className="work-detail-hero-media"
            allowFullScreen
          />
        ) : project.flipbookImages ? (
          <Flipbook
            images={project.flipbookImages}
            title={project.title}
            className="work-detail-hero-media"
          />
        ) : project.billFlip ? (
          <BillFlip
            bills={project.billFlip.bills}
            title={project.title}
            className="work-detail-hero-media"
          />
        ) : project.heroImage || project.thumbnail ? (
          <img
            src={project.heroImage || project.thumbnail}
            alt=""
            className="work-detail-hero-media"
          />
        ) : (
          <div
            className="work-detail-hero-media img-placeholder"
            aria-hidden="true"
          >
            <ImagePlaceholderIcon />
          </div>
        )}
      </Reveal>

      <Reveal className="work-detail-meta">
        <h1 className="work-detail-title">{project.title}</h1>
        <p className="work-detail-tags">
          {tagLabel} · {project.year}
        </p>
      </Reveal>

      <Reveal className="work-detail-story">
        <div className="story-frame">
          <button
            type="button"
            className="story-arrow story-arrow--prev"
            onClick={goPrev}
            aria-label="Previous section"
          >
            ‹
          </button>

          <div className="story-panel">
            <div
              className="story-steps"
              role="group"
              aria-label="Case study sections"
            >
              {STORY_STEPS.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={i === step}
                  aria-label={s.label}
                  className={`story-dot${
                    i === step ? " story-dot--active" : ""
                  }`}
                  onClick={() => setStep(i)}
                />
              ))}
            </div>

            <div className="story-body" key={activeStep.key}>
              <span className="story-label">{activeStep.label}</span>
              <p className="story-text">
                {project[activeStep.key] || "Nothing written for this section yet."}
              </p>

              {activeStep.key === "process" && !project.hideProcessMarquee && (
                <div className="story-marquee">
                  <div className="story-marquee-track">
                    {[...marqueeImages, ...marqueeImages].map((src, i) => (
                      <div
                        className="story-marquee-item img-placeholder"
                        key={i}
                      >
                        {src ? (
                          <img src={src} alt="" />
                        ) : (
                          <ImagePlaceholderIcon />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="story-arrow story-arrow--next"
            onClick={goNext}
            aria-label="Next section"
          >
            ›
          </button>
        </div>
      </Reveal>
    </section>
  );
}

export default WorkDetail;
