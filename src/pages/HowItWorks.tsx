import LandingNavbar from "@/components/landing/LandingNavbar";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FooterSection from "@/components/landing/FooterSection";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <div className="pt-[72px]">
        <HowItWorksSection />
        <FooterSection />
      </div>
    </div>
  );
}
