import LandingNavbar from "@/components/landing/LandingNavbar";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FooterSection from "@/components/landing/FooterSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <div className="pt-[72px]">
        <PricingSection />
        <FAQSection />
        <FooterSection />
      </div>
    </div>
  );
}
