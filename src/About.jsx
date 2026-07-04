import Reveal from "./Reveal";
import "./About.css";

function About() {
  return (
    <section id="about" className="section about">
      <Reveal className="about-grid">
        <p className="eyebrow">About</p>
        <div className="about-copy">
          <p className="about-body">
            Babajide Hamzat is a designer interested in the intersection of
            aesthetics, accessibility, and artificial intelligence. He is
            currently pursuing a Bachelor of Arts in Computer Science and
            Cognitive Science at Columbia University in the City of New York,
            where he is blessed to learn multitudes daily inside and outside
            of the classroom. Babajide is proud to lead creative direction,
            event organization, and product development for the Morningside
            Art Exchange, a Harlem-based arts collective that regularly puts
            on community-oriented events drawing hundreds of attendees. He is
            also a QuestBridge National College Match and Gates Scholarship
            recipient, but doesn&rsquo;t like to toot his own horn very much. 
          </p>
          <p className="about-body">
            Babajide is always open to new collaborations, design
            opportunities, and creative projects.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default About;
