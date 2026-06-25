import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import HighlightsSection from "@/components/landing/HighlightsSection";
import HomeHowItWorks from "@/components/landing/HomeHowItWorks";
import HomeFeatures from "@/components/landing/HomeFeatures";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import HomePricing from "@/components/landing/HomePricing";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <HighlightsSection />
      <HomeHowItWorks />
      <HomeFeatures />
      <TestimonialsSection />
      <HomePricing />
      <CTASection />
      <FooterSection />
    </div>
  );
}
