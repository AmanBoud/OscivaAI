import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";
import PageHero from "@/components/landing/PageHero";
import { Reveal } from "@/components/landing/_primitives";
import { imgFallback } from "@/components/landing/ImageCycler";

const upcoming = [
  { tag: "Guide", title: "How to train an AI agent on your own documents", desc: "A practical walkthrough from raw PDFs to a grounded, production-ready assistant.", img: "https://images.unsplash.com/photo-1777635168256-be42aa28c457?auto=format&fit=crop&w=800&q=80", seed: "osciva-blog-1" },
  { tag: "Playbook", title: "Cutting support volume without hurting CSAT", desc: "Where automation helps, where it hurts, and how to draw the line.", img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80", seed: "osciva-blog-2" },
  { tag: "Product", title: "Designing for 20+ Indian languages", desc: "What it takes to make an assistant feel native, not translated.", img: "https://images.unsplash.com/photo-1776248783518-400b6d0da64c?auto=format&fit=crop&w=800&q=80", seed: "osciva-blog-3" },
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <PageHero
        breadcrumb="Blog"
        title="Notes on building"
        highlight="useful AI"
        subtitle="Practical writing on AI agents, customer support and shipping product for Indian businesses. The first articles are on the way."
        primaryCta={null}
        secondaryCta={{ label: "Talk to us", to: "/contact" }}
      />

      <section className="px-5 sm:px-6 pb-20 md:pb-28">
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#A2AAB6] mb-6">Coming soon</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcoming.map((a, i) => (
              <Reveal key={a.title} i={i}>
                <article className="h-full rounded-2xl border border-[#EBEDF0] bg-white overflow-hidden flex flex-col">
                  <img
                    src={a.img}
                    alt=""
                    loading="lazy"
                    onError={(e) => imgFallback(e, a.seed)}
                    className="w-full h-[170px] object-cover"
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <span className="self-start text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF1EC] text-[#E8613C] mb-4">{a.tag}</span>
                    <h3 className="text-[16px] font-bold text-[#0B0E14] leading-snug mb-2">{a.title}</h3>
                    <p className="text-[13px] text-[#586072] leading-relaxed">{a.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 rounded-3xl border border-[#EBEDF0] bg-[#F7F8FA] p-10 text-center">
              <h2 className="text-[20px] font-bold text-[#0B0E14]">Want these in your inbox?</h2>
              <p className="mt-3 text-[14px] text-[#586072] max-w-md mx-auto">
                We will start publishing soon. Reach out and we will let you know when the first articles go live.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="group mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B0E14] text-white text-[14px] font-semibold hover:bg-[#1b2030] transition-colors"
              >
                Get notified
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
