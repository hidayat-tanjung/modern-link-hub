import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect, lazy, Suspense } from "react";
import BottomNav from "./components/BottomNav";
import { NotificationWatcher } from "./components/NotificationWatcher";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import "./types/global.d.ts";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Generate = lazy(() => import("./pages/Generate.tsx"));
const Tools = lazy(() => import("./pages/Tools.tsx"));
const Studio = lazy(() => import("./pages/Studio.tsx"));
const Models = lazy(() => import("./pages/Models.tsx"));
const Animate = lazy(() => import("./pages/Animate.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Promo = lazy(() => import("./pages/Promo.tsx"));
const Payment = lazy(() => import("./pages/Payment.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Animated loading screen with ocean theme
function RouteLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-studio-1/10 rounded-full animate-[pulse_3s_ease-in-out_infinite] blur-[128px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-studio-4/10 rounded-full animate-[pulse_3s_ease-in-out_infinite_0.5s] blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-studio-2/10 rounded-full animate-[pulse_3s_ease-in-out_infinite_1s] blur-[100px]" />
      </div>

      {/* Logo animation */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-studio-1 via-studio-2 to-studio-4 flex items-center justify-center animate-[spin_3s_linear_infinite] shadow-2xl shadow-studio-1/30">
            <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center">
              <svg className="w-8 h-8 text-studio-1 animate-[spin_2s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
              </svg>
            </div>
          </div>

          {/* Pulsing dots */}
          <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-studio-1 animate-[ping_1.5s_ease-in-out_infinite]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-studio-4 animate-[ping_1.5s_ease-in-out_infinite_0.5s]" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight">
            <span className="text-gradient">izumy</span>
            <span className="text-foreground/80"> create</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Loading your creative studio...</p>
        </div>

        {/* Animated progress bar */}
        <div className="w-32 h-0.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-studio-1 to-studio-4 animate-[loading-bar_2s_ease-in-out_infinite]" style={{ width: "40%" }} />
        </div>
      </div>
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <ErrorBoundary>
            <NotificationWatcher />
          </ErrorBoundary>
          <BottomNav />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/models" element={<Models />} />
              <Route path="/animate" element={<Animate />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/promo" element={<Promo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);
