import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import Flipbook from "./Flipbook";
import { useLightbox } from "./Lightbox";
import { CATEGORIES, CATEGORY_LABELS, PRIMARY_CATEGORIES, PROJECTS } from "./projectsData";
import "./Work.css";

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      <path d="M11 8v6M8 11h6" strokeLinecap="round" />
    </svg>
  );
}

function Work() {
  const [filter, setFilter] = useState("all");
  const openLightbox = useLightbox();
  const projects =
    filter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(filter));

  return (
    <section className="section work">
      <Reveal className="work-intro">
        <p className="eyebrow">Work</p>
        <h1 className="work-heading">Selected projects</h1>
      </Reveal>

      <div className="work-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`work-filter${
              filter === cat.id ? " work-filter--active" : ""
            }`}
            aria-pressed={filter === cat.id}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="work-grid">
        {projects.map((project, i) => (
          <Reveal
            as={Link}
            key={project.id}
            to={`/work/${project.id}`}
            className="work-card"
            style={{ transitionDelay: `${(i % 6) * 60}ms` }}
          >
            <div className="work-thumb">
              {project.flipbookImages ? (
                <Flipbook
                  images={project.flipbookImages}
                  title={project.title}
                  className="flipbook--inset"
                />
              ) : project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt=""
                  className={project.thumbnailFit === "contain" ? "work-thumb-icon" : undefined}
                />
              ) : project.embedUrl ? (
                <iframe
                  src={project.embedUrl}
                  title={`${project.title} — ${
                    project.embedUrl.includes("figma.com") ? "Figma" : "Live demo"
                  }`}
                  allowFullScreen
                  tabIndex={-1}
                />
              ) : (
                <span className="work-thumb-placeholder">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              {project.thumbnail && (
                <button
                  type="button"
                  className="work-thumb-zoom"
                  aria-label={`Zoom in on ${project.title} image`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLightbox(project.thumbnail, project.title);
                  }}
                >
                  <ZoomIcon />
                </button>
              )}
            </div>
            <div className="work-card-meta">
              <h3 className="work-card-title">{project.title}</h3>
              <span className="work-card-tag">
                {
                  CATEGORY_LABELS[
                    project.categories.find((id) => PRIMARY_CATEGORIES.includes(id))
                  ]
                }{" "}
                · {project.year}
              </span>
            </div>
          </Reveal>
        ))}

        {projects.length === 0 && (
          <p className="work-empty">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}

export default Work;
