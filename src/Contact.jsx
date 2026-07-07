import Reveal from "./Reveal";
import "./Contact.css";

const LINKS = [
  {
    label: "Email",
    value: "me@babajide.fyi",
    href: "mailto:me@babajide.fyi",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/babajide-hamzat",
    href: "https://linkedin.com/in/babajide-hamzat",
  },
];

function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal className="contact-grid">
        <p className="eyebrow">Contact</p>
        <div className="contact-copy">
          <ul className="contact-links">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <span className="contact-link-label">{link.label}</span>
                  <span className="contact-link-value">{link.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export default Contact;
