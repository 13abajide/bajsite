import Reveal from "./Reveal";
import "./Skills.css";

const FOCUS_AREAS = [
  "Human-AI Interaction",
  "Accessibility",
  "Web Design & Development",
  "Product Design, Management & Strategy",
];

const GROUPS = [
  {
    label: "Development",
    items: ["JavaScript", "React", "Python", "Flask", "HTML & CSS"],
  },
  {
    label: "Tools & Platforms",
    items: ["Figma", "Git & GitHub", "VS Code", "Adobe Creative Suite"],
  },
];

const HOBBIES = [
  "Music",
  "Fashion Dolls",
  "Reading",
  "Television",
  "Film",
  "Fashion",
  "Block Blast",
];

function Skills() {
  return (
    <section id="skills" className="section skills">
      <Reveal className="skills-intro">
        <p className="eyebrow">Skills &amp; Interests</p>
      </Reveal>

      <Reveal className="focus-areas">
        <p className="skills-group-label">Focus Areas</p>
        <ul className="focus-areas-list">
          {FOCUS_AREAS.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </Reveal>

      <div className="skills-groups">
        {GROUPS.map((group, i) => (
          <Reveal
            className="skills-group"
            key={group.label}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <p className="skills-group-label">{group.label}</p>
            <ul className="skills-tags">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="interests">
        <p className="skills-group-label">Interests</p>
        <ul className="skills-tags">
          {HOBBIES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export default Skills;
