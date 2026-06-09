import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentProvider } from "@/context/AgentContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ensureDataVersion } from "@/lib/userStore";
import Landing from "@/pages/Landing";
import FeaturesPage from "@/pages/Features";
import HowItWorksPage from "@/pages/HowItWorks";
import PricingPage from "@/pages/Pricing";
import ContactPage from "@/pages/Contact";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import CreateAgent from "@/pages/CreateAgent";
import Analytics from "@/pages/Analytics";
import Embed from "@/pages/Embed";
import ApiKeys from "@/pages/ApiKeys";
import Docs from "@/pages/Docs";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Auth />;
}

const App = () => {
  useEffect(() => {
    ensureDataVersion();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AgentProvider>
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthRoute />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/agents/create" element={<CreateAgent />} />
                  <Route path="/agents/edit/:id" element={<CreateAgent />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/embed" element={<Embed />} />
                  <Route path="/api-keys" element={<ApiKeys />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AgentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
