import { Hero } from "../../../components/ui/Hero";

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
      description="For over 15 years, Fairyland Secondary School has been a beacon of academic brilliance and character development."
    />
  );
}
