import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  ImageIcon,
  Cuboid,
  Film,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/animate", label: "Animate", icon: Film },
  { to: "/tools", label: "Tools", icon: Wand2 },
  { to: "/studio", label: "Studio", icon: ImageIcon },
  { to: "/models", label: "Models", icon: Cuboid },
];

export default function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/90 backdrop-blur-2xl border-t border-border/40 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0"
              >
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/60 hover:text-muted-foreground"
                }`}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/50"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
