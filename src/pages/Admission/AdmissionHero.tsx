import { Hero } from "../../components/ui/Hero";

export function AdmissionHero() {
  return (
    <Hero
      bgImg="/images/school.jpg"
      badge="Enroll Today"
      title={
        <>
          Begin Your Journey at
          <br />
          Fairyland Secondary School
        </>
      }
      description="Explore our admissions process, key dates, and how to secure a place for your child in a caring, academically rigorous environment."
    />
  );
}
