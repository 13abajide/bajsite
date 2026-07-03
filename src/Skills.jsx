import Reveal from "./Reveal";
import "./Skills.css";

const GROUPS = [
  {
    label: "Design",
    items: [
      "UI Design",
      "Visual Identity",
      "Prototyping",
      "Typography",
      "Illustration",
    ],
  },
  {
    label: "Development",
    items: ["JavaScript", "React", "Python", "Flask", "HTML & CSS"],
  },
  {
    label: "Tools & Platforms",
    items: ["Figma", "Git & GitHub", "VS Code", "Adobe Creative Suite"],
  },
];

function Skills() {
  return (
    <section id="skills" className="section skills">
      <Reveal className="skills-intro">
        <p className="eyebrow">Skills</p>
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
    </section>
  );
}

export default Skills;
