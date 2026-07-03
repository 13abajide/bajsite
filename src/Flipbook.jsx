import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLightbox } from "./Lightbox";
import "./Flipbook.css";

const FLIP_DURATION_MS = 700;
const PAUSE_MS = 3300;

function ChevronIcon({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Builds the page sequence: the first and last images stand alone as
// front/back covers, and everything between is paired up two at a time
// (a trailing odd one out gets a blank partner instead of being crammed
// in with a neighbor).
function buildSlides(images) {
  const total = images.length;
  if (total === 0) return [];
  if (total === 1) return [{ kind: "single", indices: [0] }];

  const middleCount = total - 2;
  const slides = [{ kind: "single", indices: [0] }];
  for (let i = 0; i < middleCount; i += 2) {
    const left = 1 + i;
    const right = i + 1 < middleCount ? left + 1 : null;
    slides.push({ kind: "pair", indices: [left, right] });
  }
  slides.push({ kind: "single", indices: [total - 1] });
  return slides;
}

// A magazine reader styled after Issuu's embed. The page sequence loops
// continuously in both directions (front cover -> paired spreads -> back
// cover -> front cover again), each turn using a page-curl 3D animation,
// with side nav arrows and a page counter. Drops into the same slot an
// <img>/<iframe> thumbnail would. `compact` (the small Work grid tile)
// hides the nav/counter chrome and just autoplays.
function Flipbook({ images, title, className, compact = false, pageAspectRatio = 0.7 }) {
  const pages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, rotate: 0 } : { rotate: 0, ...img }
      ),
    [images]
  );
  const slides = useMemo(() => buildSlides(pages), [pages]);
  const total = slides.length;
  const canFlip = total > 1;
  const openLightbox = useLightbox();

  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(null); // null | "next" | "prev"
  const [paused, setPaused] = useState(false);
  const flippingRef = useRef(false);
  const timeoutsRef = useRef([]);

  const goNext = useCallback(() => {
    if (flippingRef.current || !canFlip) return;
    flippingRef.current = true;
    setFlip("next");
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % total);
      setFlip(null);
      flippingRef.current = false;
    }, FLIP_DURATION_MS);
    timeoutsRef.current.push(t);
  }, [canFlip, total]);

  const goPrev = useCallback(() => {
    if (flippingRef.current || !canFlip) return;
    flippingRef.current = true;
    setFlip("prev");
    const t = setTimeout(() => {
      setIndex((i) => (i - 1 + total) % total);
      setFlip(null);
      flippingRef.current = false;
    }, FLIP_DURATION_MS);
    timeoutsRef.current.push(t);
  }, [canFlip, total]);

  useEffect(() => {
    if (!canFlip || paused) return undefined;
    const interval = setInterval(goNext, PAUSE_MS + FLIP_DURATION_MS);
    return () => clearInterval(interval);
  }, [canFlip, paused, goNext]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const target = flip === "next"
    ? (index + 1) % total
    : flip === "prev"
    ? (index - 1 + total) % total
    : index;

  // "next": the current slide flies off, revealing the next one already
  // sitting underneath. "prev": the previous slide flies in on top of the
  // current one. Either way there's one static layer and (during a flip)
  // one animated layer, instead of animating both at once.
  const staticIndex = flip === "next" ? target : index;
  const flyingIndex = flip === "next" ? index : flip === "prev" ? target : null;
  const staticSlide = slides[staticIndex];
  const flyingSlide = flyingIndex !== null ? slides[flyingIndex] : null;
  const displaySlide = slides[target];

  const pageLabel = (slide) =>
    slide.indices
      .filter((i) => i !== null)
      .map((i) => i + 1)
      .join("–");
  const counterLabel = displaySlide ? `${pageLabel(displaySlide)} / ${pages.length}` : "";

  const handleNav = (event, action) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  // `rotate` is for source photos that were shot/exported sideways and
  // are meant to display that way — the scale compensates for the 90deg
  // swap so a photo whose native ratio matches the page ratio still fills
  // it edge to edge. This lives on the image itself, separate from the
  // slide shell's own 3D turn transform, so the two don't fight over one
  // element's `transform`.
  const renderImg = (page, extraClassName = "") => (
    <img
      src={page.src}
      alt=""
      className={["flipbook-page-img", extraClassName].filter(Boolean).join(" ")}
      style={
        page.rotate
          ? {
              transform: `rotate(${page.rotate}deg) scale(${1 / pageAspectRatio})`,
            }
          : undefined
      }
      onClick={
        compact
          ? undefined
          : (event) => {
              event.preventDefault();
              event.stopPropagation();
              openLightbox(page.src, title);
            }
      }
    />
  );

  const renderPageImg = (idx) => {
    if (idx === null || idx === undefined) {
      return <div className="flipbook-blank" />;
    }
    return renderImg(pages[idx]);
  };

  const renderSlideContent = (slide) => {
    if (!slide) return null;
    if (slide.kind === "single") {
      return renderImg(pages[slide.indices[0]], "flipbook-cover-img");
    }
    const [leftIdx, rightIdx] = slide.indices;
    return (
      <>
        <div className="flipbook-leaf flipbook-leaf--left">{renderPageImg(leftIdx)}</div>
        <div className="flipbook-leaf flipbook-leaf--right">{renderPageImg(rightIdx)}</div>
      </>
    );
  };

  return (
    <div
      className={`flipbook${className ? ` ${className}` : ""}`}
      style={{ "--flipbook-spread-ratio": pageAspectRatio * 2 }}
      role="group"
      aria-label={title ? `${title} — magazine flipbook` : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flipbook-stage">
        <div className="flipbook-spread">
          <div className={`flipbook-slide-shell flipbook-slide-shell--${staticSlide?.kind}`}>
            {renderSlideContent(staticSlide)}
          </div>

          {flyingSlide && (
            <div
              className={`flipbook-slide-shell flipbook-slide-shell--${flyingSlide.kind} flipbook-slide-shell--flying flipbook-slide-shell--${flip}`}
            >
              {renderSlideContent(flyingSlide)}
            </div>
          )}
        </div>

        {!compact && canFlip && (
          <>
            <button
              type="button"
              className="flipbook-nav flipbook-nav--prev"
              aria-label="Previous page"
              onClick={(e) => handleNav(e, goPrev)}
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              className="flipbook-nav flipbook-nav--next"
              aria-label="Next page"
              onClick={(e) => handleNav(e, goNext)}
            >
              <ChevronIcon direction="next" />
            </button>
          </>
        )}
      </div>

      {!compact && canFlip && <span className="flipbook-counter">{counterLabel}</span>}
    </div>
  );
}

export default Flipbook;
