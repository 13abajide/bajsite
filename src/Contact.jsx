import Reveal from "./Reveal";
import "./Contact.css";

const LINKS = [
  {
    label: "Email",
    value: "hello@yourname.com",
    href: "mailto:hello@yourname.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/yourname",
    href: "https://linkedin.com/in/yourname",
  },
];

function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal className="contact-grid">
        <p className="eyebrow">Contact</p>
        <div className="contact-copy">
          <h2 className="contact-heading">Let&rsquo;s talk</h2>
          <p className="contact-body">
            Have a project in mind, or just want to say hello? My inbox is
            always open.
          </p>

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
