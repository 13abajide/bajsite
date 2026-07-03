import Reveal from "./Reveal";
import "./About.css";

function About() {
  return (
    <section id="about" className="section about">
      <Reveal className="about-grid">
        <p className="eyebrow">About</p>
        <div className="about-copy">
          <h2 className="about-lead">
            I like building things that are equal parts functional and
            considered.
          </h2>
          <p className="about-body">
            Most of my work sits where design and engineering meet — I care
            about the structure underneath as much as the details on top.
            Outside of that, you&rsquo;ll usually find me discovering new music,
            supporting local art and community spaces, or working on
            whatever&rsquo;s got my curiosity at the moment.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default About;
