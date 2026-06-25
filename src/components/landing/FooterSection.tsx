import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", path: "/features" },
      { label: "Pricing", path: "/pricing" },
      { label: "How it works", path: "/how-it-works" },
      { label: "Integrations", path: "/features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Blog", path: "/blog" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", path: "/privacy" },
      { label: "Terms", path: "/terms" },
      { label: "DPDP", path: "/dpdp" },
      { label: "Security", path: "/security" },
    ],
  },
];

export default function FooterSection() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0E14] px-5 sm:px-6 pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="https://osciva.io/images/osciva-web.png" alt="Osciva" className="h-8 w-8" />
              <span className="text-[16px] font-bold text-white tracking-[-0.02em]">Osciva <span className="text-[#E8613C]">AI</span></span>
            </div>
            <p className="text-[13.5px] text-white/55 leading-relaxed max-w-xs mb-6">
              The no-code platform to build, train and deploy AI assistants on your own data — in minutes.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {["India hosted", "DPDP ready", "SOC 2"].map((b) => (
                <span key={b} className="text-[10.5px] px-3 py-1 rounded-full bg-white/[0.06] text-white/60 border border-white/10 font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.12em] mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-[13.5px] text-white/65 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6">
          <p className="text-[12.5px] text-white/45">© {year} Osciva AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
