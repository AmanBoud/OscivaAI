import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile top bar */}
      {isMobile && (
        <header className="sticky top-0 z-50 h-14 flex items-center gap-3 px-4 border-b border-border bg-background-secondary">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-secondary text-foreground-secondary"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="https://osciva.io/images/osciva-web.png" alt="Osciva" className="h-7 w-7 object-contain" />
            <span className="text-sm font-bold tracking-tight text-foreground">
              Osciva <span className="text-primary">AI</span>
            </span>
          </div>
        </header>
      )}

      <Sidebar
        mobileOpen={isMobile ? sidebarOpen : undefined}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={isMobile ? "min-h-screen" : "ml-[236px] min-h-screen"}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
