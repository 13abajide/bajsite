import { useState } from "react";
import "./BillFlip.css";

// An interactive bill viewer: click the bill to flip it over in 3D and
// reveal its back, use the arrows to switch between denominations.
function BillFlip({ bills, title, className }) {
  const [billIndex, setBillIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const bill = bills[billIndex];

  const goPrev = () => {
    setBillIndex((i) => (i - 1 + bills.length) % bills.length);
    setFlipped(false);
  };
  const goNext = () => {
    setBillIndex((i) => (i + 1) % bills.length);
    setFlipped(false);
  };

  const billLabel = title ? `${title} — ${bill.label} bill` : `${bill.label} bill`;

  return (
    <div className={`bill-flip${className ? ` ${className}` : ""}`}>
      {bills.length > 1 && (
        <button
          type="button"
          className="bill-flip-arrow bill-flip-arrow--prev"
          onClick={goPrev}
          aria-label="Previous bill"
        >
          ‹
        </button>
      )}

      <button
        type="button"
        className="bill-flip-stage"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${billLabel}, showing ${flipped ? "back" : "front"} — click to flip`}
      >
        <div className={`bill-flip-card${flipped ? " bill-flip-card--flipped" : ""}`}>
          <img src={bill.front} alt="" className="bill-flip-face bill-flip-face--front" />
          <img src={bill.back} alt="" className="bill-flip-face bill-flip-face--back" />
        </div>
      </button>

      {bills.length > 1 && (
        <button
          type="button"
          className="bill-flip-arrow bill-flip-arrow--next"
          onClick={goNext}
          aria-label="Next bill"
        >
          ›
        </button>
      )}
    </div>
  );
}

export default BillFlip;
