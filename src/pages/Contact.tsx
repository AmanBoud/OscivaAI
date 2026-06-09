import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <div className="pt-[72px]">
        <section className="bg-[#FFF5F0] py-20 md:py-28 px-6">
          <div className="max-w-[1000px] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
              <motion.span variants={fadeUp} custom={0}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FDEAE3] text-[12px] font-semibold text-[#E8613C] uppercase tracking-wider mb-4">
                Contact Us
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1}
                className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e] mb-3">
                Get in Touch
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-[15px] text-[#888] max-w-md mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hello@osciva.io" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                  { icon: MapPin, label: "Location", value: "Bangalore, India 🇮🇳" },
                  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us on WhatsApp" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#f0ebe6]">
                    <div className="w-11 h-11 rounded-xl bg-[#FDEAE3] flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-[#E8613C]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#888] uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-[14px] text-[#1a1a2e] font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
                className="bg-white rounded-3xl border border-[#f0ebe6] p-8">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-[#FDEAE3] flex items-center justify-center mx-auto mb-4">
                      <Mail size={28} className="text-[#E8613C]" />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#1a1a2e] mb-2">Message Sent!</h3>
                    <p className="text-[14px] text-[#888] mb-6">We'll get back to you within 24 hours.</p>
                    <button onClick={() => navigate("/")}
                      className="px-6 py-2.5 rounded-full bg-[#E8613C] text-white text-[14px] font-semibold hover:bg-[#d4522f] transition-colors">
                      Back to Home
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { id: "name", label: "Your Name", type: "text", placeholder: "Rahul Sharma" },
                      { id: "email", label: "Email Address", type: "email", placeholder: "rahul@company.com" },
                      { id: "company", label: "Company (optional)", type: "text", placeholder: "Acme Inc." },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block text-[13px] font-semibold text-[#1a1a2e] mb-1.5">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={form[field.id as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#f0ebe6] text-[14px] text-[#1a1a2e] placeholder:text-[#bbb] focus:outline-none focus:border-[#E8613C]/50 focus:ring-2 focus:ring-[#E8613C]/10 transition-all"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#1a1a2e] mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#f0ebe6] text-[14px] text-[#1a1a2e] placeholder:text-[#bbb] focus:outline-none focus:border-[#E8613C]/50 focus:ring-2 focus:ring-[#E8613C]/10 transition-all resize-none"
                      />
                    </div>
                    <button type="submit"
                      className="w-full py-3 rounded-full bg-[#E8613C] text-white text-[14px] font-semibold hover:bg-[#d4522f] transition-colors shadow-lg shadow-[#E8613C]/20">
                      Send Message
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
        <FooterSection />
      </div>
    </div>
  );
}
