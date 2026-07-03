import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import "./App.css";
import Bajlogo from "./ijab";
import NavigationBar from "./navbar";
import Home from "./Home";
import Work from "./Work";
import WorkDetail from "./WorkDetail";
import Footer from "./Footer";

// Matches the total runtime of the six-stroke signature draw in ijab.css
// (last stroke: 2.5s delay + 0.5s duration = 3s).
const DRAW_DURATION = 3000;

function App() {
  const location = useLocation();
  // Captured once: the intro should only ever play on a fresh load of the
  // home route, never replayed by client-side navigation back to "/".
  const startedOnHome = useRef(location.pathname === "/");
  const [introDone, setIntroDone] = useState(!startedOnHome.current);

  useEffect(() => {
    if (!startedOnHome.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setIntroDone(true);
      return;
    }

    const timer = setTimeout(() => setIntroDone(true), DRAW_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const skipToContent = (event) => {
    event.preventDefault();
    document.getElementById("main-content")?.focus();
  };

  return (
    <>
      <a href="#main-content" className="skip-link" onClick={skipToContent}>
        Skip to content
      </a>

      {/* Big centered mark that draws itself in, then shrinks into the navbar */}
      <div
        className={`intro-mark${introDone ? " intro-mark--docked" : ""}`}
        aria-hidden="true"
      >
        <Bajlogo animated />
      </div>

      <NavigationBar revealed={introDone} />

      <main className="page" id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home revealed={introDone} />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<WorkDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
