import { useCallback, useEffect, useRef, useState } from "react";
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

// A magazine reader styled after Issuu's embed: the first image is a
// standalone cover, and "next" opens it into a two-page spread built from
// the rest — bound-edge shading, a page-curl turn animation (both for the
// cover opening/closing and for turning pages within the spread), side
// nav arrows, and a page counter. Drops into the same slot an
// <img>/<iframe> thumbnail would. `compact` (the small Work grid tile)
// hides the nav/counter chrome and just autoplays.
function Flipbook({ images, title, className, compact = false, pageAspectRatio = 0.7 }) {
  const total = images.length;
  const nonCoverTotal = Math.max(total - 1, 0);
  const hasSpread = nonCoverTotal >= 2;
  const openLightbox = useLightbox();

  const [phase, setPhase] = useState("cover"); // "cover" | "spread"
  const [order, setOrder] = useState(() =>
    Array.from({ length: nonCoverTotal }, (_, i) => i + 1)
  );
  const [flip, setFlip] = useState(null); // null | "next" | "prev" | "open" | "close"
  const [paused, setPaused] = useState(false);
  const flippingRef = useRef(false);
  const timeoutsRef = useRef([]);

  const runFlip = useCallback((kind, onSettle) => {
    flippingRef.current = true;
    setFlip(kind);
    const t = setTimeout(() => {
      onSettle();
      setFlip(null);
      flippingRef.current = false;
    }, FLIP_DURATION_MS);
    timeoutsRef.current.push(t);
  }, []);

  const goNext = useCallback(() => {
    if (flippingRef.current || !hasSpread) return;
    if (phase === "cover") {
      runFlip("open", () => setPhase("spread"));
    } else {
      runFlip("next", () =>
        setOrder((prev) => [...prev.slice(1), prev[0]])
      );
    }
  }, [phase, hasSpread, runFlip]);

  const goPrev = useCallback(() => {
    if (flippingRef.current || !hasSpread) return;
    if (phase === "cover") return;
    if (order[0] === 1) {
      runFlip("close", () => setPhase("cover"));
    } else {
      runFlip("prev", () =>
        setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
      );
    }
  }, [phase, order, hasSpread, runFlip]);

  useEffect(() => {
    if (!hasSpread || paused) return undefined;
    const interval = setInterval(goNext, PAUSE_MS + FLIP_DURATION_MS);
    return () => clearInterval(interval);
  }, [hasSpread, paused, goNext]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const showSpread = hasSpread && (phase === "spread" || flip === "open");
  const showCover = phase === "cover" || flip === "close";
  const coverAnim =
    flip === "open"
      ? "flipbook-cover-img--turning-out"
      : flip === "close"
      ? "flipbook-cover-img--turning-in"
      : "";

  const leftIdx = hasSpread ? order[0] : null;
  const rightIdx = hasSpread ? order[1] : null;
  const rightUnderIdx = hasSpread ? (order.length > 2 ? order[2] : order[0]) : null;
  const prevIncomingIdx = hasSpread ? order[order.length - 1] : null;
  const rightFlipping = flip === "next";
  const leftFlipping = flip === "prev";

  const counterLabel =
    showSpread && hasSpread
      ? `${order[0] + 1}–${order[1] + 1} / ${total}`
      : `1 / ${total}`;

  const handleNav = (event, action) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  const renderPageImg = (idx, extraClassName = "") => {
    const src = images[idx];
    const classes = ["flipbook-page-img", extraClassName].filter(Boolean).join(" ");
    return (
      <img
        src={src}
        alt=""
        className={classes}
        onClick={
          compact
            ? undefined
            : (event) => {
                event.preventDefault();
                event.stopPropagation();
                openLightbox(src, title);
              }
        }
      />
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
          {showSpread && (
            <>
              <div className="flipbook-leaf flipbook-leaf--left">
                <div className="flipbook-leaf-base">{renderPageImg(leftIdx)}</div>
                {leftFlipping && (
                  <div className="flipbook-leaf-turn flipbook-leaf-turn--in">
                    {renderPageImg(prevIncomingIdx)}
                  </div>
                )}
              </div>

              <div className="flipbook-leaf flipbook-leaf--right">
                <div className="flipbook-leaf-base">{renderPageImg(rightUnderIdx)}</div>
                <div
                  className={`flipbook-leaf-turn flipbook-leaf-turn--out${
                    rightFlipping ? " flipbook-leaf-turn--active" : ""
                  }`}
                >
                  {renderPageImg(rightIdx)}
                </div>
              </div>
            </>
          )}

          {showCover && (
            <div className="flipbook-cover">
              {renderPageImg(
                0,
                `flipbook-cover-img${coverAnim ? ` ${coverAnim}` : ""}`
              )}
            </div>
          )}
        </div>

        {!compact && hasSpread && (
          <>
            <button
              type="button"
              className="flipbook-nav flipbook-nav--prev"
              aria-label="Previous page"
              disabled={phase === "cover"}
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

      {!compact && hasSpread && (
        <span className="flipbook-counter">{counterLabel}</span>
      )}
    </div>
  );
}

export default Flipbook;
