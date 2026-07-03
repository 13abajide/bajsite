import { useEffect, useRef, useState } from "react";
import "./Flipbook.css";

const FLIP_DURATION_MS = 700;
const PAUSE_MS = 1700;

// A stack of images that periodically flips its front page over in 3D,
// like Issuu's homepage cover carousel, revealing the next image
// underneath. Drops into the same slot an <img>/<iframe> thumbnail would.
function Flipbook({ images, title, className }) {
  const [order, setOrder] = useState(() => images.map((_, i) => i));
  const [flipping, setFlipping] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    function scheduleFlip() {
      const toFlip = setTimeout(() => {
        setFlipping(true);
        const toReset = setTimeout(() => {
          setOrder((prev) => [...prev.slice(1), prev[0]]);
          setFlipping(false);
          scheduleFlip();
        }, FLIP_DURATION_MS);
        timeoutsRef.current.push(toReset);
      }, PAUSE_MS);
      timeoutsRef.current.push(toFlip);
    }

    scheduleFlip();
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
    };
  }, [images.length]);

  return (
    <div
      className={`flipbook${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={title ? `${title} — photo flipbook` : undefined}
    >
      {order.map((imgIndex, stackPos) => (
        <div
          key={imgIndex}
          className="flipbook-slot"
          style={{
            zIndex: order.length - stackPos,
            transform: `translate(${stackPos * 2}px, ${stackPos * -2}px) rotate(${
              stackPos === 0 ? 0 : (stackPos % 2 === 0 ? 1 : -1) * stackPos * 0.8
            }deg)`,
          }}
        >
          <div className={`flipbook-page${stackPos === 0 && flipping ? " flipbook-page--flip" : ""}`}>
            <img src={images[imgIndex]} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Flipbook;
