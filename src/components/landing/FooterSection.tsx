import { useNavigate } from "react-router-dom";

export default function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1a1a2e] border-t border-[#2a2a3e] py-14 px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="https://osciva.io/images/osciva-web.png" alt="Osciva" className="h-8 w-8" />
              <span className="text-[16px] font-bold text-white">
                Osciva <span className="text-[#E8613C]">AI</span>
              </span>
            </div>
            <p className="text-[13px] text-[#888] leading-relaxed max-w-xs mb-5">
              India's first enterprise AI agent platform. Build, train, and deploy intelligent customer support agents in minutes.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {["🇮🇳 India Hosted", "DPDP Compliant", "SOC 2 Ready"].map((b) => (
                <span key={b} className="text-[10px] px-3 py-1 rounded-full bg-[#2a2a3e] text-[#888] border border-[#333] font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: [
              { label: "Features", action: () => navigate("/features") },
              { label: "Pricing", action: () => navigate("/pricing") },
              { label: "How It Works", action: () => navigate("/how-it-works") },
              { label: "Integrations", action: () => navigate("/features") },
            ]},
            { title: "Company", links: [
              { label: "About Us", action: () => {} },
              { label: "Careers", action: () => {} },
              { label: "Blog", action: () => {} },
              { label: "Contact", action: () => navigate("/contact") },
            ]},
            { title: "Legal", links: [
              { label: "Privacy Policy", action: () => {} },
              { label: "Terms of Service", action: () => {} },
              { label: "DPDP Compliance", action: () => {} },
              { label: "Security", action: () => {} },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold text-[#666] uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={link.action} className="text-[13px] text-[#888] hover:text-white transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2a2a3e] pt-6">
          <p className="text-[12px] text-[#666]">© 2025 Osciva AI. All rights reserved. Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
