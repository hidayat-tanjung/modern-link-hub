import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Sun,
  Moon,
  HelpCircle,
  Bell,
  Menu,
  X,
  Film,
  LayoutDashboard,
  Wand2,
  ImageIcon,
  Cuboid,
  Images,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/animate", label: "Animate", icon: Film },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/tools", label: "Tools", icon: Wand2 },
  { to: "/studio", label: "Studio", icon: ImageIcon },
  { to: "/models", label: "Models", icon: Cuboid },
];

const secondaryLinks = [
  { to: "/faq", label: "FAQ", icon: HelpCircle },
];

function NotificationBell() {
  const unreadNotifications = useQuery(api.notifications.unread);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const markRead = useMutation(api.notifications.markRead);
  const [open, setOpen] = useState(false);

  const unreadCount = unreadNotifications?.length ?? 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary relative"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-popover border border-border/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => { markAllRead(); }}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {unreadNotifications && unreadNotifications.length > 0 ? (
                unreadNotifications.map((notif: any) => (
                  <div
                    key={notif._id}
                    className={`px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/10 last:border-0 ${
                      notif.type === "payment_completed"
                        ? "border-l-2 border-l-green-500"
                        : notif.type === "payment_failed"
                        ? "border-l-2 border-l-red-500"
                        : notif.type === "payment_cancelled"
                        ? "border-l-2 border-l-slate-500"
                        : "border-l-2 border-l-primary"
                    }`}
                    onClick={() => {
                      markRead({ notificationId: notif._id });
                      if (notif.link) window.location.href = notif.link;
                      setOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">No new notifications</p>
                </div>
              )}
            </div>

          </motion.div>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}

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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:block ${
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
                <span className="text-gradient">izumy</span>
                <span className="text-foreground/80"> create</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 bg-secondary/40 backdrop-blur-sm rounded-full px-1 py-1 border border-border/30">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to}>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>            {/* Right side */}
          <div className="flex items-center gap-1.5">
              {/* Secondary links - desktop only */}
              <div className="hidden md:flex items-center gap-0.5 mr-1">
                {secondaryLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link key={link.to} to={link.to}>
                      <span
                        className={`rounded-full px-2.5 py-1.5 text-xs gap-1.5 inline-flex items-center transition-all duration-200 ${
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Notification Bell */}
              {isAuthenticated && (
                <ErrorBoundary>
                  <NotificationBell />
                </ErrorBoundary>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </Button>

              {isAuthenticated && (
                <Link to="/dashboard">
                  <Avatar className="h-7 w-7 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
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

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/30 overflow-hidden bg-background/95 backdrop-blur-xl">
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
          </div>
        )}
      </header>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
