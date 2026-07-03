import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToId } from "./scrollTo";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Contact from "./Contact";

function Home({ revealed }) {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      scrollToId(location.state.scrollTo);
    }
  }, [location.state]);

  return (
    <>
      <Hero revealed={revealed} />
      <About />
      <Skills />
      <Contact />
    </>
  );
}

export default Home;
