import "./Footer.css";

function Footer() {
  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <a href="#top" className="footer-top" onClick={scrollToTop}>
        Back to top ↑
      </a>
    </footer>
  );
}

export default Footer;
