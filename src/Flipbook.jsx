import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { useLightbox } from "./Lightbox";
import "./Flipbook.css";

const PAUSE_MS = 3500;
const FLIP_DURATION_MS = 600;

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

// react-pageflip needs a ref on each page for its internal DOM
// measurements. `rotate` is for source photos that were shot/exported
// sideways and are meant to display that way; the scale compensates for
// the 90deg swap so a photo whose native ratio matches the page ratio
// still fills it edge to edge.
const FlipPage = forwardRef(function FlipPage({ src, rotate, pageAspectRatio, title, onZoom }, ref) {
  return (
    <div className="flipbook-page" ref={ref}>
      {src ? (
        <button
          type="button"
          className="flipbook-page-zoom"
          onClick={() => onZoom(src)}
          aria-label={title ? `Zoom into ${title}` : "Zoom into image"}
        >
          <img
            src={src}
            alt=""
            className="flipbook-page-img"
            style={
              rotate
                ? { transform: `rotate(${rotate}deg) scale(${1 / pageAspectRatio})` }
                : undefined
            }
          />
        </button>
      ) : (
        <div className="flipbook-page-blank" />
      )}
    </div>
  );
});

// The first image is a standalone front cover; every other image
// (including the last) is a regular page, paired up two at a time (an
// odd one out gets a blank partner). A blank page is always appended as
// the standalone back cover, like the blank endpaper in a real book.
function buildPages(images) {
  const normalized = images.map((img) =>
    typeof img === "string" ? { src: img, rotate: 0 } : { rotate: 0, ...img }
  );
  if (normalized.length === 0) return normalized;
  const blank = () => ({ src: null, rotate: 0 });
  const [front, ...middle] = normalized;
  const paddedMiddle = middle.length % 2 === 1 ? [...middle, blank()] : middle;
  return [front, ...paddedMiddle, blank()];
}

// A magazine reader built on react-pageflip (StPageFlip) for a genuine
// curling page-turn — drag a corner or click near an edge to turn, side
// arrows and a counter for discoverability, autoplay that pauses on
// hover and loops back to the cover at the end. `compact` (the small
// Work grid tile) skips the interactive book entirely and just shows the
// cover, since a draggable page-flip doesn't make sense at thumbnail
// size.
function Flipbook({ images, title, className, compact = false, pageAspectRatio = 0.7 }) {
  const pages = useMemo(() => buildPages(images), [images]);
  const total = pages.length;
  const openLightbox = useLightbox();
  const bookRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const handleZoom = useCallback((src) => openLightbox(src, title), [openLightbox, title]);

  const goNext = useCallback(() => {
    const flip = bookRef.current?.pageFlip?.();
    if (!flip) return;
    if (flip.getCurrentPageIndex() >= flip.getPageCount() - 1) {
      flip.turnToPage(0);
    } else {
      flip.flipNext();
    }
  }, []);

  const goPrev = useCallback(() => {
    const flip = bookRef.current?.pageFlip?.();
    if (!flip) return;
    if (flip.getCurrentPageIndex() <= 0) {
      flip.turnToPage(flip.getPageCount() - 1);
    } else {
      flip.flipPrev();
    }
  }, []);

  useEffect(() => {
    if (compact || paused || total < 2) return undefined;
    const id = setInterval(goNext, PAUSE_MS);
    return () => clearInterval(id);
  }, [compact, paused, total, goNext]);

  if (compact) {
    const cover = pages[0];
    return (
      <div className={`flipbook flipbook--static${className ? ` ${className}` : ""}`}>
        {cover?.src && <img src={cover.src} alt="" className="flipbook-static-cover" />}
      </div>
    );
  }

  return (
    <div
      className={`flipbook${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={title ? `${title} — magazine flipbook` : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flipbook-stage">
        <HTMLFlipBook
          ref={bookRef}
          width={360}
          height={Math.round(360 / pageAspectRatio)}
          size="stretch"
          minWidth={160}
          maxWidth={800}
          minHeight={200}
          maxHeight={1000}
          showCover
          drawShadow
          maxShadowOpacity={0.35}
          flippingTime={FLIP_DURATION_MS}
          usePortrait={false}
          mobileScrollSupport={false}
          className={`flipbook-book${
            pageIndex === 0
              ? " flipbook-book-shift--front"
              : pageIndex === total - 1
              ? " flipbook-book-shift--back"
              : ""
          }`}
          onFlip={(e) => setPageIndex(e.data)}
        >
          {pages.map((page, i) => (
            <FlipPage
              key={i}
              src={page.src}
              rotate={page.rotate}
              pageAspectRatio={pageAspectRatio}
              title={title}
              onZoom={handleZoom}
            />
          ))}
        </HTMLFlipBook>

        {total > 1 && (
          <>
            <button
              type="button"
              className="flipbook-nav flipbook-nav--prev"
              aria-label="Previous page"
              onClick={goPrev}
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              className="flipbook-nav flipbook-nav--next"
              aria-label="Next page"
              onClick={goNext}
            >
              <ChevronIcon direction="next" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <span className="flipbook-counter">
          {pageIndex + 1} / {total}
        </span>
      )}
    </div>
  );
}

export default Flipbook;
