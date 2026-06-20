import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Features", path: "/features" },
  { label: "How it works", path: "/how-it-works" },
  { label: "Pricing", path: "/pricing" },
  { label: "Docs", path: "/docs" },
  { label: "Contact", path: "/contact" },
];

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-[#EBEDF0] shadow-[0_1px_0_rgba(11,14,20,0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 sm:px-6 h-[68px]">
        <a href="/" className="flex items-center gap-2.5 group">
          <img
            src="https://osciva.io/images/osciva-web.png"
            alt="Osciva"
            className="h-8 w-8 transition-transform group-hover:scale-105"
          />
          <span className="text-[17px] font-bold tracking-[-0.02em] text-[#0B0E14]">Osciva <span className="text-[#0EC2A8]">AI</span></span>
        </a>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => navigate(l.path)}
              className="px-3.5 py-2 rounded-lg text-[14px] font-medium text-[#586072] hover:text-[#0B0E14] hover:bg-[#F2F4F7] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 rounded-full text-[14px] font-semibold text-[#0B0E14] hover:bg-[#F2F4F7] transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="group flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0EC2A8] text-white text-[14px] font-semibold hover:bg-[#0AA593] transition-colors shadow-[0_8px_20px_-8px_rgba(14,194,168,0.7)]"
          >
            Start Free Trial
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#0B0E14] p-1"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#EBEDF0] px-5 py-4 space-y-1">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => {
                setMobileOpen(false);
                navigate(l.path);
              }}
              className="block w-full text-left py-3 px-2 rounded-lg text-[15px] text-[#586072] hover:bg-[#F2F4F7] hover:text-[#0B0E14]"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/auth");
              }}
              className="w-full py-3 rounded-full border border-[#E3E6EB] text-[15px] font-semibold text-[#0B0E14]"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/auth");
              }}
              className="w-full py-3 rounded-full bg-[#0EC2A8] text-white text-[15px] font-semibold"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
