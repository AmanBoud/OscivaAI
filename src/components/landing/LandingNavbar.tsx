import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Play } from "lucide-react";

const navLinks = [
  { label: "Features", path: "/features" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact Us", path: "/contact" },
];

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#f0ebe6]">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-6 h-[72px]">
        <a href="/" className="flex items-center gap-2.5">
          <img src="https://osciva.io/images/osciva-web.png" alt="Osciva" className="h-9 w-9" />
          <span className="text-[17px] font-bold tracking-tight text-[#1a1a2e]">
            Osciva <span className="text-[#E8613C]">AI</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => navigate(l.path)}
              className="text-[14px] font-medium text-[#555] hover:text-[#1a1a2e] transition-colors">
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate("/auth")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E8613C]/20 text-[14px] font-medium text-[#E8613C] hover:bg-[#E8613C]/5 transition-colors">
            <Play size={14} className="fill-[#E8613C]" /> Watch Overview
          </button>
          <button onClick={() => navigate("/auth")}
            className="px-5 py-2.5 rounded-full bg-[#E8613C] text-white text-[14px] font-semibold hover:bg-[#d4522f] transition-colors shadow-lg shadow-[#E8613C]/20">
            Start Free Trial
          </button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#1a1a2e]">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#f0ebe6] px-6 py-5 space-y-1">
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => { setMobileOpen(false); navigate(l.path); }}
              className="block w-full text-left py-3 text-[15px] text-[#555] hover:text-[#1a1a2e]">
              {l.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <button onClick={() => { setMobileOpen(false); navigate("/auth"); }}
              className="w-full py-3 rounded-full border border-[#e5ddd6] text-[15px] font-medium text-[#1a1a2e]">
              Sign in
            </button>
            <button onClick={() => { setMobileOpen(false); navigate("/auth"); }}
              className="w-full py-3 rounded-full bg-[#E8613C] text-white text-[15px] font-semibold">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
