import LandingNavbar from "@/components/landing/LandingNavbar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FooterSection from "@/components/landing/FooterSection";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <div className="pt-[72px]">
        <FeaturesSection />
        <FooterSection />
      </div>
    </div>
  );
}
