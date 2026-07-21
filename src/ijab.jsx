import "./ijab.css";

const STROKES = [
  "M585.653 328.115C766.525 303.794 949.397 287.513 1131.4 272.158C1179.17 268.128 1226.92 265.87 1274.56 261.454C1275.23 261.392 1289.3 262.538 1289.27 259.978C1289.23 255.258 1233.04 309.347 1232.17 310.048C1196.71 338.448 1151.85 360.856 1106.86 368.786C1061.61 376.761 1004.37 371.596 963.423 350.038C946.811 341.291 917.286 306.284 897.412 306.469C891.067 306.528 872.592 339.656 866.969 344.241C841.298 365.172 809.418 382.389 776.331 387.929C732.116 395.333 686.484 399.103 642.454 389.175C634.137 387.299 580.606 361.187 591.282 357.518",
  "M953.398 423.77C953.398 423.77 1011.04 444.926 1033.97 449.798C1036.66 450.368 1045.08 451.236 1046.07 455.041C1047.08 458.92 1031.94 463.616 1030.09 464.562C987.676 486.266 939.914 497.927 898.054 519.346",
  "M966.997 446.405C963.412 446.438 959.426 484.996 956.723 493.361",
  "M1158.44 474.625C1152.52 463.056 1179.45 602.425 1165.06 609.791",
  "M1149.73 545.668C1046.55 598.464 921.25 629.636 803.626 617.172C794.087 616.161 686.254 606.454 693.598 591.418",
  "M1089.38 691.714C1038.96 692.183 937.791 695.915 894.085 710.937",
];

/**
 * The hand-drawn "Bàbájídé" signature mark.
 * Pass `animated` for the once-per-load draw-in version (used for the
 * intro). Without it, the mark renders fully drawn — used for the small
 * copy that lives in the navbar once the intro has docked.
 */
function Bajlogo({ animated = false, className = "" }) {
  const classes = ["bajlogo", animated ? "bajlogo--animated" : "", className]
    .filter(Boolean)
    .join(" ");

  // The nav-bar mark is cropped flush against the ink's left edge so it
  // lines up with the page's gutter. The intro mark needs the opposite —
  // padding split evenly on both sides — so it renders visually centered
  // in the viewport instead of skewed left.
  const viewBox = animated ? "557 231 760 508" : "567 237 873 496";

  return (
    <svg
      className={classes}
      viewBox={viewBox}
      width="100%"
      height="100%"
      strokeMiterlimit={10}
      style={{ fillRule: "nonzero", clipRule: "evenodd" }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bàbájídé — signature mark"
    >
      <g>
        {STROKES.map((d, i) => (
          <path
            key={i}
            className={`bajlogo-line bajlogo-line-${i + 1}`}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={37.4633}
            pathLength="1"
          />
        ))}
      </g>
    </svg>
  );
}

export default Bajlogo;
