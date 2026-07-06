import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  CreditCard,
  Banknote,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const paymentTypeLabels: Record<string, string> = {
  bank: "Bank Transfer",
  ewallet: "E-Wallet",
  paypal: "PayPal",
};

const paymentTypeIcons: Record<string, any> = {
  bank: Banknote,
  ewallet: Wallet,
  paypal: CreditCard,
};

export default function Admin() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [proofPreviewId, setProofPreviewId] = useState<string | null>(null);

  // Users
  const stats = useQuery(api.admin.globalStats);
  const users = useQuery(api.admin.listUsers);
  const setRole = useMutation(api.admin.setUserRole);

  // Payments
  const allMethods = useQuery(api.payments.listAllMethods);
  const allPayments = useQuery(api.payments.listAllPayments);
  const createMethod = useMutation(api.payments.createMethod);
  const updateMethod = useMutation(api.payments.updateMethod);
  const deleteMethod = useMutation(api.payments.deleteMethod);
  const updateStatus = useMutation(api.payments.updateStatus);

  // Payment method form state
  const [methodForm, setMethodForm] = useState({
    name: "",
    type: "bank" as "bank" | "ewallet" | "paypal",
    provider: "",
    accountNumber: "",
    accountName: "",
    instructions: "",
    isActive: true,
  });
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [methodDialogOpen, setMethodDialogOpen] = useState(false);

  const isLoading = stats === undefined || users === undefined;

  const filteredUsers = users?.filter((u: any) => {
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

  // ── Payment Methods ──────────────────────────────────────────────

  const resetMethodForm = () => {
    setMethodForm({
      name: "",
      type: "bank",
      provider: "",
      accountNumber: "",
      accountName: "",
      instructions: "",
      isActive: true,
    });
    setEditingMethod(null);
  };

  const openEditMethod = (method: any) => {
    setEditingMethod(method);
    setMethodForm({
      name: method.name,
      type: method.type,
      provider: method.provider,
      accountNumber: method.accountNumber ?? "",
      accountName: method.accountName,
      instructions: method.instructions ?? "",
      isActive: method.isActive,
    });
    setMethodDialogOpen(true);
  };

  const handleSaveMethod = async () => {
    try {
      if (editingMethod) {
        await updateMethod({
          id: editingMethod._id,
          ...methodForm,
          accountNumber: methodForm.accountNumber || undefined,
          instructions: methodForm.instructions || undefined,
        });
        toast.success("Payment method updated");
      } else {
        await createMethod({
          ...methodForm,
          accountNumber: methodForm.accountNumber || undefined,
          instructions: methodForm.instructions || undefined,
        });
        toast.success("Payment method created");
      }
      setMethodDialogOpen(false);
      resetMethodForm();
    } catch {
      toast.error("Failed to save payment method");
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await deleteMethod({ id: id as any });
      toast.success("Payment method deleted");
    } catch {
      toast.error("Failed to delete payment method");
    }
  };

  const handleUpdateStatus = async (paymentId: string, status: string) => {
    try {
      await updateStatus({ paymentId: paymentId as any, status: status as any });
      toast.success(`Payment marked as ${status}`);
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  // ── Stats Cards ─────────────────────────────────────────────────

  const statCards = [
    {
      label: "Total Users",
      value: isLoading ? "..." : String(stats?.totalUsers ?? 0),
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Total Generations",
      value: isLoading ? "..." : String(stats?.totalGenerations ?? 0),
      icon: Sparkles,
      color: "text-primary",
    },
    {
      label: "Today's Generations",
      value: isLoading ? "..." : String(stats?.todayGenerations ?? 0),
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Active Quotas",
      value: isLoading ? "..." : String(stats?.activeQuotas ?? 0),
      icon: Zap,
      color: "text-amber-500",
    },
  ];

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
              Manage users, payment methods, monitor activity, and control platform settings.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statCards.map((stat, i) => {
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="w-4 h-4" /> Payments
                {allPayments && (allPayments as any[]).filter((p: any) => p.status === "pending").length > 0 && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-1.5 py-0 h-4">
                    {(allPayments as any[]).filter((p: any) => p.status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="methods" className="gap-2">
                <Banknote className="w-4 h-4" /> Payment Methods
              </TabsTrigger>
            </TabsList>

            {/* ── Users Tab ───────────────────────────────────────── */}
            <TabsContent value="users">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* User Management */}
                <motion.div className="lg:col-span-2">
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
                        <p className="text-sm text-muted-foreground">Loading users...</p>
                      </div>
                    ) : filteredUsers && filteredUsers.length > 0 ? (
                      <div className="divide-y divide-border/50">
                        {filteredUsers.map((user: any) => (
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
                                {user.email || "No email"} · {user.generations} generations
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant={user.role === "admin" ? "default" : "secondary"}
                                className={`text-xs ${
                                  user.role === "admin"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    : ""
                                }`}
                              >
                                {user.role === "admin" && <Crown className="w-2.5 h-2.5 mr-1" />}
                                {user.role ?? "user"}
                              </Badge>
                              <div className="flex gap-1">
                                {user.role !== "admin" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-7 h-7"
                                    onClick={() => handleSetRole(user._id, "admin")}
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
                                    onClick={() => handleSetRole(user._id, "user")}
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
                        <p className="text-sm text-muted-foreground">No users found</p>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div>
                  <div className="flex items-center gap-2 mb-5">
                    <Activity className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                  </div>
                  <Card className="glass-card">
                    {isLoading ? (
                      <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">Loading activity...</p>
                      </div>
                    ) : stats?.recentGenerations && stats.recentGenerations.length > 0 ? (
                      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                        {stats.recentGenerations.slice(0, 15).map((item: any) => (
                          <div key={item._id} className="p-3">
                            <p className="text-xs font-medium truncate">{item.prompt}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {item.style} · {timeAgo(item._creationTime)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No activity yet</p>
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
            </TabsContent>

            {/* ── Payments Tab ─────────────────────────────────────── */}
            <TabsContent value="payments">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Payment Management</h2>
                {allPayments && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {allPayments.length} total
                  </Badge>
                )}
              </div>

              <Card className="glass-card">
                {allPayments === undefined ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">Loading payments...</p>
                  </div>
                ) : allPayments.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {allPayments.map((payment: any) => (
                      <div
                        key={payment._id}
                        className="p-4 hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Proof image thumbnail */}
                            {payment.proofUrl && (
                              <button
                                onClick={() => setProofPreviewId(payment._id)}
                                className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-border/30 hover:border-primary/50 transition-all group"
                              >
                                <img
                                  src={payment.proofUrl}
                                  alt="Payment proof"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                              </button>
                            )}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              payment.status === "completed" ? "bg-green-500/10" :
                              payment.status === "pending" ? "bg-amber-500/10" :
                              "bg-red-500/10"
                            }`}>
                              {payment.status === "completed" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : payment.status === "pending" ? (
                                <Clock className="w-4 h-4 text-amber-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{payment.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {payment.userName} · {payment.methodName} ({payment.methodType})
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payment.proofUrl && <span className="text-primary">Proof attached</span>}{" · "}{timeAgo(payment._creationTime)}{" · "}{payment.notes ? `Notes: ${payment.notes}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                            <div className="flex gap-1 mt-1">
                              {payment.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] text-green-500 hover:text-green-500 hover:bg-green-500/10"
                                    onClick={() => handleUpdateStatus(payment._id, "completed")}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] text-red-500 hover:text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleUpdateStatus(payment._id, "failed")}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {payment.status !== "pending" && (
                                <Badge className={`text-[10px] ${
                                  payment.status === "completed"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : payment.status === "failed"
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                }`}>
                                  {payment.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No payments yet</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Payment Methods Tab ──────────────────────────────── */}
            <TabsContent value="methods">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Payment Methods</h2>
                </div>
                <Dialog open={methodDialogOpen} onOpenChange={(open) => {
                  if (!open) resetMethodForm();
                  setMethodDialogOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-4 h-4" /> Add Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Name
                        </label>
                        <Input
                          placeholder="e.g., BCA Transfer, GoPay, PayPal"
                          value={methodForm.name}
                          onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Type
                        </label>
                        <Select
                          value={methodForm.type}
                          onValueChange={(v: "bank" | "ewallet" | "paypal") =>
                            setMethodForm({ ...methodForm, type: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
                            <SelectItem value="ewallet">📱 E-Wallet</SelectItem>
                            <SelectItem value="paypal">💳 PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Provider
                        </label>
                        <Input
                          placeholder="e.g., BCA, Gojek, PayPal"
                          value={methodForm.provider}
                          onChange={(e) => setMethodForm({ ...methodForm, provider: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Account Number
                          </label>
                          <Input
                            placeholder="e.g., 1234567890"
                            value={methodForm.accountNumber}
                            onChange={(e) => setMethodForm({ ...methodForm, accountNumber: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Account Name
                          </label>
                          <Input
                            placeholder="e.g., John Doe"
                            value={methodForm.accountName}
                            onChange={(e) => setMethodForm({ ...methodForm, accountName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Instructions (optional)
                        </label>
                        <Textarea
                          placeholder="e.g., Please include your order number in the transfer note..."
                          value={methodForm.instructions}
                          onChange={(e) => setMethodForm({ ...methodForm, instructions: e.target.value })}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={methodForm.isActive}
                          onChange={(e) => setMethodForm({ ...methodForm, isActive: e.target.checked })}
                          className="rounded border-border"
                        />
                        <label htmlFor="isActive" className="text-sm text-muted-foreground">
                          Active (visible to users)
                        </label>
                      </div>
                      <Button onClick={handleSaveMethod} className="w-full">
                        {editingMethod ? "Update Method" : "Create Method"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="glass-card">
                {allMethods === undefined ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">Loading methods...</p>
                  </div>
                ) : allMethods.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {allMethods.map((method: any) => {
                      const TypeIcon = paymentTypeIcons[method.type] || CreditCard;
                      const typeColor = method.type === "bank" ? "text-blue-500" :
                        method.type === "ewallet" ? "text-green-500" : "text-indigo-500";
                      return (
                        <div
                          key={method._id}
                          className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-xl ${typeColor.replace("text", "bg")}/10 flex items-center justify-center shrink-0`}>
                            <TypeIcon className={`w-5 h-5 ${typeColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{method.name}</p>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {paymentTypeLabels[method.type] || method.type}
                              </Badge>
                              {!method.isActive && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {method.provider}
                              {method.accountNumber && ` · ${method.accountNumber}`}
                              {method.accountName && ` (${method.accountName})`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              onClick={() => openEditMethod(method)}
                              title="Edit"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 text-red-500 hover:text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDeleteMethod(method._id)}
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Banknote className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No payment methods yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click "Add Method" to create your first payment method
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Proof Preview Dialog */}
      <Dialog open={!!proofPreviewId} onOpenChange={(open) => { if (!open) setProofPreviewId(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>
          {proofPreviewId && allPayments && (
            <div className="rounded-xl overflow-hidden border border-border/50 bg-accent/10">
              <img
                src={(allPayments as any[]).find((p: any) => p._id === proofPreviewId)?.proofUrl}
                alt="Payment proof screenshot"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
