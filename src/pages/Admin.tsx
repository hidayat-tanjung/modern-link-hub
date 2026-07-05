import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/AppHeader";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Users,
  Sparkles,
  TrendingUp,
  Clock,
  Search,
  Crown,
  Shield,
  UserX,
  ArrowRight,
  Activity,
  Zap,
  Settings,
} from "lucide-react";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Admin() {
  const [search, setSearch] = useState("");
  const stats = useQuery(api.admin.globalStats);
  const users = useQuery(api.admin.listUsers);
  const setRole = useMutation(api.admin.setUserRole);

  const isLoading = stats === undefined || users === undefined;

  const filteredUsers = users?.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const handleSetRole = async (
    userId: string,
    role: "admin" | "user" | "member",
  ) => {
    try {
      await setRole({ userId: userId as any, role });
      toast.success(`Role updated to ${role}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-gradient">Admin</span> Dashboard
              </h1>
              <Badge
                variant="secondary"
                className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20"
              >
                <Crown className="w-3 h-3" /> Admin
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              Manage users, monitor activity, and control platform settings.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {[
              {
                label: "Total Users",
                value: isLoading ? "..." : String(stats?.totalUsers ?? 0),
                icon: Users,
                color: "text-blue-500",
              },
              {
                label: "Total Generations",
                value: isLoading
                  ? "..."
                  : String(stats?.totalGenerations ?? 0),
                icon: Sparkles,
                color: "text-primary",
              },
              {
                label: "Today's Generations",
                value: isLoading
                  ? "..."
                  : String(stats?.todayGenerations ?? 0),
                icon: TrendingUp,
                color: "text-green-500",
              },
              {
                label: "Active Quotas",
                value: isLoading ? "..." : String(stats?.activeQuotas ?? 0),
                icon: Zap,
                color: "text-amber-500",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Card className="glass-card p-5 group hover:border-primary/30 transition-all">
                    <Icon
                      className={`w-5 h-5 ${stat.color} mb-3 group-hover:scale-110 transition-transform`}
                    />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">User Management</h2>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Card className="glass-card">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Loading users...
                    </p>
                  </div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
                          {user.name?.charAt(0)?.toUpperCase() ||
                            user.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email || "No email"} · {user.generations}{" "}
                            generations
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                            className={`text-xs ${
                              user.role === "admin"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : ""
                            }`}
                          >
                            {user.role === "admin" && (
                              <Crown className="w-2.5 h-2.5 mr-1" />
                            )}
                            {user.role ?? "user"}
                          </Badge>
                          <div className="flex gap-1">
                            {user.role !== "admin" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7"
                                onClick={() =>
                                  handleSetRole(user._id, "admin")
                                }
                                title="Make Admin"
                              >
                                <Crown className="w-3 h-3 text-amber-500" />
                              </Button>
                            )}
                            {user.role !== "user" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7"
                                onClick={() =>
                                  handleSetRole(user._id, "user")
                                }
                                title="Make User"
                              >
                                <UserX className="w-3 h-3 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No users found
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <Card className="glass-card">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Loading activity...
                    </p>
                  </div>
                ) : stats?.recentGenerations &&
                  stats.recentGenerations.length > 0 ? (
                  <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                    {stats.recentGenerations.slice(0, 15).map((item) => (
                      <div key={item._id} className="p-3">
                        <p className="text-xs font-medium truncate">
                          {item.prompt}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.style} · {timeAgo(item._creationTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No activity yet
                    </p>
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Quick Actions</h2>
                </div>
                <div className="space-y-2">
                  <Link to="/generate">
                    <Card className="glass-card p-3 flex items-center gap-3 hover:border-primary/30 transition-all cursor-pointer">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Generate</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                    </Card>
                  </Link>
                  <Link to="/tools">
                    <Card className="glass-card p-3 flex items-center gap-3 hover:border-primary/30 transition-all cursor-pointer">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Tools</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                    </Card>
                  </Link>
                  <Link to="/dashboard">
                    <Card className="glass-card p-3 flex items-center gap-3 hover:border-primary/30 transition-all cursor-pointer">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Dashboard</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
                    </Card>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
