import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sparkles,
  Wand2,
  ImageIcon,
  Palette,
  Cuboid,
  Crop,
  Shrink,
  Eraser,
  Brush,
  ScanSearch,
  ArrowRight,
  Clock,
  TrendingUp,
  Star,
  Layers,
  Zap,
  Upload,
} from "lucide-react";

const quickActions = [
  {
    icon: Sparkles,
    label: "AI Generate",
    desc: "Create from text prompt",
    to: "/generate",
    gradient: "from-studio-1 to-studio-2",
  },
  {
    icon: Eraser,
    label: "Remove BG",
    desc: "Remove background",
    to: "/tools",
    gradient: "from-studio-2 to-studio-3",
  },
  {
    icon: ImageIcon,
    label: "Open Editor",
    desc: "Full studio editor",
    to: "/studio",
    gradient: "from-studio-3 to-studio-4",
  },
  {
    icon: Cuboid,
    label: "Browse Models",
    desc: "Explore AI models",
    to: "/models",
    gradient: "from-studio-4 to-studio-5",
  },
  {
    icon: Shrink,
    label: "Convert",
    desc: "Format converter",
    to: "/tools",
    gradient: "from-studio-5 to-studio-1",
  },
  {
    icon: Palette,
    label: "All Tools",
    desc: "Full tool suite",
    to: "/tools",
    gradient: "from-studio-1 to-studio-3",
  },
];

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds <= 0) return "just now";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const recentGenerations = useQuery(api.generations.recent);
  const dashboardStats = useQuery(api.generations.stats);

  const isLoading = recentGenerations === undefined || dashboardStats === undefined;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome back to{" "}
              <span className="text-gradient">PixelForge</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              What would you like to create today?
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                  >
                    <Link to={action.to}>
                      <Card className="glass-card p-5 text-center group hover:border-primary/30 hover:glow transition-all duration-300 cursor-pointer h-full">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} p-2.5 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-full h-full text-white" />
                        </div>
                        <h3 className="text-sm font-semibold mb-0.5">{action.label}</h3>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <Card className="glass-card">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">Loading activity...</p>
                  </div>
                ) : recentGenerations && recentGenerations.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {recentGenerations.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.prompt}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.style} · {timeAgo(item._creationTime)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          Generated
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No generations yet</p>
                    <Link to="/generate">
                      <Button variant="link" size="sm" className="gap-1 mt-1 text-xs">
                        Create your first image <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Stats & Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Daily Stats */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Today's Stats</h2>
                </div>
                <Card className="glass-card p-5 space-y-4">
                  {[
                    { label: "Today's Generations", value: isLoading ? "..." : String(dashboardStats?.todayGenerations ?? 0), icon: Zap },
                    { label: "Total Generations", value: isLoading ? "..." : String(dashboardStats?.totalGenerations ?? 0), icon: Wand2 },
                    { label: "Storage Used", value: isLoading ? "..." : (dashboardStats?.storageEstimate ?? "0 KB"), icon: Upload },
                  ].map((stat: { label: string; value: string; icon: any }, i: number) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="text-sm font-semibold">{stat.value}</span>
                      </div>
                    );
                  })}
                </Card>
              </div>

              {/* Quick Tip */}
              <Card className="glass-card p-5 bg-gradient-to-br from-studio-1/10 via-studio-2/5 to-transparent border-primary/20">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Pro Tip</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Try the Studio editor for advanced layer-based editing with filters,
                      text overlays, and drawing tools.
                    </p>
                    <Link to="/studio">
                      <Button variant="link" size="sm" className="gap-1 p-0 h-auto mt-2 text-xs">
                        Open Studio <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
