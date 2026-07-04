import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { scrollToId } from "./scrollTo";
import Bajlogo from "./ijab";
import "./Hero.css";

// "báji" stays normal-sized through the fade-in, waits this long, then
// grows big and holds briefly before shrinking back down — matching the
// transitions on .hero-name-mid / .hero-name--grown in Hero.css, which
// both take the same 1.1s so growing and shrinking are the same speed.
const GROW_DELAY = 4000;
const GROW_DURATION = 1100;
const HOLD_DURATION = 400;
const SHRINK_DURATION = 1100;
const GROW_SHRINK_TOTAL = GROW_DELAY + GROW_DURATION + HOLD_DURATION + SHRINK_DURATION;

// Once "báji" has finished growing and shrinking back down, wait this
// long, then draw the green signature mark on top of it (rotated). The
// draw itself takes 3s (matches the stroke delays/durations in
// ijab.css), then it holds fully drawn for 3s before fading out.
const GREEN_OVERLAY_DELAY = 45000;
const GREEN_DRAW_DURATION = 3000;
const GREEN_HOLD_DURATION = 3000;
// Matches the opacity transition on .hero-name-overlay in Hero.css —
// hover shouldn't act "normal" again until the fade has actually finished.
const GREEN_FADE_DURATION = 1000;

// The whole grow/shrink/overlay sequence (well under 5 minutes end to
// end) replays on this interval.
const CYCLE_INTERVAL = 5 * 60 * 1000;

function Hero({ revealed }) {
  const [grown, setGrown] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [showGreenOverlay, setShowGreenOverlay] = useState(false);
  const [greenOverlayFading, setGreenOverlayFading] = useState(false);

  // Track the overlay's own lifecycle outside of React state so a hover
  // mid-draw can reach in and reschedule the fade without racing the
  // timers a fresh cycle schedules.
  const overlayShownAtRef = useRef(null);
  const overlayInterruptedRef = useRef(false);
  const fadeTimerRef = useRef(null);
  const hoverReenableTimerRef = useRef(null);

  const scheduleOverlayFade = (delay) => {
    clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setGreenOverlayFading(true);
      clearTimeout(hoverReenableTimerRef.current);
      hoverReenableTimerRef.current = setTimeout(
        () => setHoverable(true),
        GREEN_FADE_DURATION
      );
    }, delay);
  };

  // Hovering "báji" while the green overlay is up shouldn't trigger the
  // normal hover effect underneath it — instead let the draw finish (or,
  // if it already has, fade immediately), then only re-enable the normal
  // hover once the overlay is fully gone.
  const handleOverlayHoverInterrupt = () => {
    if (!showGreenOverlay || greenOverlayFading || overlayInterruptedRef.current) {
      return;
    }
    overlayInterruptedRef.current = true;
    const elapsedSinceShow = overlayShownAtRef.current
      ? Date.now() - overlayShownAtRef.current
      : GREEN_DRAW_DURATION;
    const remainingDraw = Math.max(0, GREEN_DRAW_DURATION - elapsedSinceShow);
    scheduleOverlayFade(remainingDraw);
  };

  useEffect(() => {
    if (!revealed) return;

    // Timers from every cycle collect here so cleanup can clear them all,
    // not just the latest cycle's — scheduling them up front within each
    // cycle (rather than chaining off state changes) avoids the flag
    // flipping back and forth cancelling the ones still pending.
    const timers = [];

    const runCycle = () => {
      clearTimeout(fadeTimerRef.current);
      clearTimeout(hoverReenableTimerRef.current);
      overlayInterruptedRef.current = false;
      overlayShownAtRef.current = null;

      setGrown(false);
      setHoverable(false);
      setShowGreenOverlay(false);
      setGreenOverlayFading(false);

      timers.push(setTimeout(() => setGrown(true), GROW_DELAY));
      timers.push(
        setTimeout(
          () => setGrown(false),
          GROW_DELAY + GROW_DURATION + HOLD_DURATION
        )
      );
      timers.push(setTimeout(() => setHoverable(true), GROW_SHRINK_TOTAL));
      timers.push(
        setTimeout(() => {
          setShowGreenOverlay(true);
          setHoverable(false);
          overlayShownAtRef.current = Date.now();
          scheduleOverlayFade(GREEN_DRAW_DURATION + GREEN_HOLD_DURATION);
        }, GROW_SHRINK_TOTAL + GREEN_OVERLAY_DELAY)
      );
    };

    runCycle();
    const interval = setInterval(runCycle, CYCLE_INTERVAL);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(fadeTimerRef.current);
      clearTimeout(hoverReenableTimerRef.current);
    };
  }, [revealed]);

  return (
    <section id="top" className={`hero${revealed ? " hero--revealed" : ""}`}>
      <div className="hero-inner">
        <p className={`hero-greeting${revealed ? " hero-greeting--revealed" : ""}`}>
          hi, i'm
        </p>
        <h1
          className={`hero-name${grown ? " hero-name--grown" : ""}${
            hoverable ? " hero-name--hoverable" : ""
          }`}
        >
          <span className="hero-name-part">Ba</span>
          <span className="hero-name-mid-wrap">
            <span
              className="hero-name-mid"
              onMouseEnter={handleOverlayHoverInterrupt}
            >
              báji
            </span>
            {showGreenOverlay && (
              <span
                className={`hero-name-overlay${
                  greenOverlayFading ? " hero-name-overlay--fading" : ""
                }`}
                aria-hidden="true"
              >
                <Bajlogo animated />
              </span>
            )}
          </span>
          <span className="hero-name-part">de</span>
        </h1>
        <p className="hero-tagline">Learner. Designer. Savant.</p>
        <div className="hero-actions">
          <Link to="/work" className="btn btn-primary">
            View my work
          </Link>
          <a
            href="#contact"
            className="btn btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("contact");
            }}
          >
            Get in touch
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="hero-scroll"
        aria-label="Scroll to About section"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("about");
        }}
      >
        <span>Scroll</span>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
          <path
            d="M7 1V21M7 21L1 15M7 21L13 15"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}

export default Hero;
