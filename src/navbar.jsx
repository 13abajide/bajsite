import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Bajlogo from "./ijab";
import { scrollToId } from "./scrollTo";
import "./navbar.css";

const SECTION_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function NavigationBar({ revealed }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const closeMenu = () => setOpen(false);

  const scrollToTop = (event) => {
    event.preventDefault();
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
    closeMenu();
  };

  // Section links only exist on the home page — scroll there directly, or
  // navigate home first and scroll once it's mounted (see Home.jsx).
  const goToSection = (event, id) => {
    event.preventDefault();
    closeMenu();
    if (isHome) {
      scrollToId(id);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <nav
      className={`nav${revealed ? " nav--revealed" : ""}${
        open ? " nav--open" : ""
      }`}
    >
      <div className="nav-row">
        <button
          type="button"
          className="nav-mark"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <Bajlogo />
        </button>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="nav-links" id="nav-menu">
          <ul>
            {SECTION_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={(e) => goToSection(e, link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/work" className="nav-cta" onClick={closeMenu}>
                Work
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
