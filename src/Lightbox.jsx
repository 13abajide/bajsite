import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Lightbox.css";

const LightboxContext = createContext(null);

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

/**
 * Wrap the app in this once. Descendants call useLightbox() to get an
 * `open(src, alt)` function, or just render <ZoomableImage> directly.
 */
export function LightboxProvider({ children }) {
  const [image, setImage] = useState(null);
  const open = useCallback((src, alt = "") => setImage({ src, alt }), []);
  const close = useCallback(() => setImage(null), []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {image && (
        <LightboxOverlay src={image.src} alt={image.alt} onClose={close} />
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return ctx;
}

/**
 * Drop-in replacement for <img> that opens the shared lightbox on click.
 * Any extra props (className, style, etc.) pass through to the <img>.
 */
export function ZoomableImage({ src, alt = "", className = "", ...rest }) {
  const open = useLightbox();
  return (
    <img
      src={src}
      alt={alt}
      className={`zoomable-image ${className}`.trim()}
      onClick={() => open(src, alt)}
      {...rest}
    />
  );
}

function LightboxOverlay({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2))),
    []
  );
  const zoomOut = useCallback(
    () =>
      setScale((s) => {
        const next = Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2));
        if (next === MIN_SCALE) setPos({ x: 0, y: 0 });
        return next;
      }),
    []
  );
  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, zoomIn, zoomOut]);

  const onWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const onPointerDown = (e) => {
    if (scale === 1) return;
    dragRef.current = { startX: e.clientX - pos.x, startY: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    setPos({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY,
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onImageClick = (e) => {
    e.stopPropagation();
    if (scale === 1) setScale(1 + SCALE_STEP * 2);
    else reset();
  };

  return (
    <div
      className="lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image preview"}
    >
      <div className="lightbox-controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom out"
          disabled={scale <= MIN_SCALE}
        >
          −
        </button>
        <span className="lightbox-scale">{Math.round(scale * 100)}%</span>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          disabled={scale >= MAX_SCALE}
        >
          +
        </button>
        <button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>
      </div>

      <div
        className="lightbox-frame"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <img
          src={src}
          alt={alt}
          className="lightbox-img"
          draggable={false}
          onClick={onImageClick}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            cursor: scale === 1 ? "zoom-in" : "grab",
          }}
        />
      </div>
    </div>
  );
}

export default LightboxProvider;
