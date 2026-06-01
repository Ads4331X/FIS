import { Hero } from "../../../components/ui/Hero";
import { SITE_NAME } from "../../../constants/siteContact";

export function AboutHero() {
  return (
    <Hero
      bgImg="/images/about.jpg"
      badge="EST. 2009"
      title={
        <>
          Nurturing Minds,
          <br />
          Chasing Excellence.
        </>
      }
      description={`Located in pollution-free Baluwakhani, Kapan, ${SITE_NAME} blends academic strength with creative, character-centered learning.`}
    />
  );
}
