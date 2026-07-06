import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppHeader from "@/components/AppHeader";
import { WaveDivider } from "@/components/WaveDivider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  CreditCard,
  Wallet,
  Banknote,
  Send,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  History,
} from "lucide-react";

const paymentTypes = [
  { value: "bank", label: "Bank Transfer", icon: Banknote },
  { value: "ewallet", label: "E-Wallet", icon: Wallet },
  { value: "paypal", label: "PayPal", icon: CreditCard },
];

const amountPresets = [25000, 50000, 100000, 250000, 500000];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default function Payment() {
  const methods = useQuery(api.payments.listMethods);
  const myPayments = useQuery(api.payments.myPayments);
  const submitPayment = useMutation(api.payments.submitPayment);

  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [lastPayment, setLastPayment] = useState<any>(null);

  const isLoading = methods === undefined || myPayments === undefined;

  const selectedMethodData = methods?.find((m: any) => m._id === selectedMethod);

  const handleSubmit = async () => {
    if (!selectedMethod || !amount || !description) return;
    setIsSubmitting(true);
    try {
      const paymentId = await submitPayment({
        paymentMethodId: selectedMethod as any,
        amount: parseInt(amount),
        currency: "IDR",
        description,
        notes: notes || undefined,
      });
      setLastPayment({ ...selectedMethodData, paymentId, amount: parseInt(amount), description });
      setSuccessDialogOpen(true);
      setAmount("");
      setDescription("");
      setNotes("");
      setSelectedMethod("");
      toast.success("Payment submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1">
            <XCircle className="w-3 h-3" /> Failed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20 gap-1">
            <XCircle className="w-3 h-3" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "bank": return <Banknote className="w-5 h-5" />;
      case "ewallet": return <Wallet className="w-5 h-5" />;
      case "paypal": return <CreditCard className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-gradient">Payment</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Choose a payment method and submit your payment. We'll confirm once received.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left - Payment Form */}
            <div className="lg:col-span-3">
              {/* Step 1: Select Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Wallet className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">1. Select Payment Method</h2>
                </div>

                {isLoading ? (
                  <Card className="glass-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">Loading payment methods...</p>
                  </Card>
                ) : methods && methods.length > 0 ? (
                  <div className="space-y-3 mb-8">
                    {paymentTypes.map((type: any) => {
                      const typeMethods = methods.filter((m: any) => m.type === type.value);
                      if (typeMethods.length === 0) return null;
                      const Icon = type.icon;
                      return (
                        <div key={type.value}>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5" />
                            {type.label}
                          </p>
                          <div className="grid gap-2">
                            {typeMethods.map((method: any) => (
                              <Card
                                key={method._id}
                                className={`glass-card p-4 cursor-pointer transition-all border-2 ${
                                  selectedMethod === method._id
                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                    : "border-transparent hover:border-primary/30 hover:bg-accent/30"
                                }`}
                                onClick={() => setSelectedMethod(method._id)}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    type.value === "bank" ? "bg-blue-500/10 text-blue-500" :
                                    type.value === "ewallet" ? "bg-green-500/10 text-green-500" :
                                    "bg-indigo-500/10 text-indigo-500"
                                  }`}>
                                    {getMethodIcon(method.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">{method.name}</p>
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                        {method.provider}
                                      </Badge>
                                    </div>
                                    {method.accountNumber && (
                                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                        {method.accountNumber} · {method.accountName}
                                      </p>
                                    )}
                                    {method.instructions && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {method.instructions}
                                      </p>
                                    )}
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                                    selectedMethod === method._id
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/30"
                                  }`}>
                                    {selectedMethod === method._id && (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="glass-card p-8 text-center">
                    <Wallet className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No payment methods available yet</p>
                  </Card>
                )}
              </motion.div>

              {/* Step 2: Enter Amount */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Banknote className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">2. Enter Amount</h2>
                </div>
                <Card className="glass-card p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Amount (IDR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                          Rp
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-9 text-lg font-semibold h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Quick Amount</p>
                      <div className="flex flex-wrap gap-2">
                        {amountPresets.map((preset) => (
                          <Button
                            key={preset}
                            variant={amount === String(preset) ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAmount(String(preset))}
                            className="text-xs h-8"
                          >
                            {formatCurrency(preset)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Step 3: Description & Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Send className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">3. Payment Details</h2>
                </div>
                <Card className="glass-card p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., Premium subscription - 1 month"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Notes (optional)
                      </label>
                      <Textarea
                        placeholder="Any additional notes or reference..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="resize-none"
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedMethod || !amount || !description || isSubmitting}
                      className="w-full gap-2 h-11"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Payment
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Sidebar - Payment History */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Payment History</h2>
                </div>
                <Card className="glass-card">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">Loading history...</p>
                    </div>
                  ) : myPayments && myPayments.length > 0 ? (
                    <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                      {myPayments.map((payment: any, i: number) => (
                        <motion.div
                          key={payment._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="p-3 hover:bg-accent/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium truncate">{payment.description}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDate(payment._creationTime)}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                              {getStatusBadge(payment.status)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <History className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No payments yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select a method above to get started
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* WaveDivider */}
      <WaveDivider />

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              Payment Submitted!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Your payment is being processed. We'll notify you once it's confirmed.
            </p>
            {lastPayment && (
              <div className="bg-accent/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">{formatCurrency(lastPayment.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span>{lastPayment?.name ?? "Selected"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </div>
            )}
            <Button
              className="w-full"
              onClick={() => setSuccessDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
