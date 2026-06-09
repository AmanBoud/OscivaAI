import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="bg-[#1a1a2e] py-20 md:py-28 px-6">
      <div className="max-w-[700px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-[30px] md:text-[44px] font-extrabold tracking-[-0.02em] text-white leading-[1.15] mb-4">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-[15px] text-[#999] mb-8 max-w-md mx-auto leading-relaxed">
            Join 500+ businesses already using Osciva AI. Build your first agent today — it's free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-3.5 rounded-full bg-[#E8613C] text-white text-[14px] font-semibold hover:bg-[#d4522f] transition-colors flex items-center gap-2 shadow-lg shadow-[#E8613C]/30"
            >
              Start Free Trial <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-3.5 rounded-full border border-[#333] text-[14px] font-medium text-white hover:bg-white/5 transition-colors"
            >
              Talk to Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
