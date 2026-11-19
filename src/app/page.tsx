import {
  HeroSection,
  FeaturedMenuSection,
  CategoriesSection,
  WhyChooseSection,
  HowItWorksSection,
} from "@/features/home/components/home-sections";

import { getFeaturedMenuItems } from "@/features/menu/services/menu.service";

export default async function HomePage() {
  const featuredItems = await getFeaturedMenuItems();

  return (
    <main className="w-full flex-1 bg-white">
      <HeroSection />

      <FeaturedMenuSection items={featuredItems} />

      <CategoriesSection />

      <WhyChooseSection />

      <HowItWorksSection />
    </main>
  );
}
