import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  LayoutDashboard,
  ImageIcon,
  Palette,
  Cuboid,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  HelpCircle,
  Tag,
  Wand2,
  ImageMinus,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/tools", label: "Tools", icon: Wand2 },
  { to: "/studio", label: "Studio", icon: ImageIcon },
  { to: "/models", label: "Models", icon: Cuboid },
];

const secondaryLinks = [
  { to: "/promo", label: "Promo", icon: Tag },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
];

export default function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-black/5"
          : "bg-background/40 backdrop-blur-md border-b border-border/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-studio-1 via-studio-2 to-studio-3 flex items-center justify-center shadow-lg shadow-studio-1/20 group-hover:shadow-studio-1/40 transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-gradient">Pixel</span>
              <span className="text-foreground/80">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 bg-secondary/40 backdrop-blur-sm rounded-full px-1 py-1 border border-border/30">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Secondary nav - desktop only */}
            <div className="hidden md:flex items-center gap-0.5 mr-1">
              {secondaryLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full px-2.5 py-1.5 text-xs gap-1.5 ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="w-px h-5 bg-border/40 mx-0.5 hidden md:block" />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Avatar className="h-7 w-7 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-1.5 rounded-full px-3 py-1.5 text-xs h-auto">
                  <LogIn className="w-3 h-3" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-8 h-8"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 overflow-hidden bg-background/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-3 space-y-0.5">
              {[...navLinks, ...secondaryLinks].map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
