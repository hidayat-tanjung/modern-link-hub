import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/components/AppHeader";
import {
  Sparkles,
  Check,
  X,
  Zap,
  Star,
  Gift,
  Rocket,
  Crown,
  Bolt,
  Timer,
  Tag,
  Copy,
  CheckCheck,
  ArrowRight,
  Infinity,
  Gem,
  Flame,
  Users,
  Layers,
} from "lucide-react";

const promoPackages = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "free",
    credits: "50",
    icon: Sparkles,
    color: "from-slate-400 to-slate-300",
    badge: null,
    features: [
      "50 kredit AI generation per bulan",
      "Akses semua tools dasar",
      "Studio editor standar",
      "Model Free",
      "Export PNG, JPEG",
      "Basic support",
    ],
    limitations: [
      "Resolusi max 1024x1024",
      "Ada watermark",
      "Tidak bisa akses model premium",
      "Antrian prioritas rendah",
    ],
    cta: "Mulai Gratis",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "29",
    period: "month",
    credits: "500",
    icon: Bolt,
    color: "from-blue-500 to-cyan-500",
    badge: { label: "Populer", icon: Flame },
    features: [
      "500 kredit AI generation per bulan",
      "Akses semua tools + tools premium",
      "Studio editor pro",
      "Model Free + beberapa model premium",
      "Export semua format",
      "Prioritas generasi lebih cepat",
      "Hapus watermark",
      "Email support",
    ],
    limitations: [
      "Resolusi max 2048x2048",
      "Belum ada akses unlimited",
    ],
    cta: "Mulai Starter",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "79",
    period: "month",
    credits: "2000",
    icon: Crown,
    color: "from-violet-500 to-purple-500",
    badge: { label: "Best Value", icon: Gem },
    features: [
      "2.000 kredit AI generation per bulan",
      "Akses SEMUA tools tanpa batas",
      "Studio editor pro + fitur eksklusif",
      "SEMUA model (Free + Premium)",
      "Export semua format + SVG",
      "Resolusi max 4096x4096",
      "Prioritas generasi tinggi",
      "Tanpa watermark",
      "Batch generation (10 gambar)",
      "Priority support 24/7",
    ],
    limitations: [
      "Kredit terbatas per bulan",
    ],
    cta: "Mulai Pro",
    popular: false,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "199",
    period: "month",
    credits: "Unlimited",
    icon: Infinity,
    color: "from-amber-500 to-orange-500",
    badge: { label: "Terlaris", icon: Rocket },
    features: [
      "UNLIMITED AI generation",
      "Akses SEMUA tools & fitur",
      "Studio editor pro + semua fitur eksklusif",
      "SEMUA model termasuk model premium terbaru",
      "Export semua format + vector",
      "Resolusi max 8192x8192",
      "Prioritas generasi tertinggi",
      "Batch generation unlimited",
      "Private model hosting",
      "API access",
      "Dedicated support 24/7",
      "Early access fitur baru",
    ],
    limitations: [],
    cta: "Mulai Unlimited",
    popular: false,
  },
];

const promoDeals = [
  {
    id: "bulk",
    name: "Bulk Credit Pack",
    price: "499",
    originalPrice: "699",
    credits: "10.000",
    icon: Layers,
    color: "from-emerald-500 to-teal-500",
    badge: "Hemat 28%",
    description: "Kredit tambahan yang tidak pernah kadaluarsa. Cocok untuk pengguna aktif.",
    features: [
      "10.000 kredit sekali beli",
      "Tidak ada masa kadaluarsa",
      "Bisa untuk semua model & tools",
      "Bisa dikombinasikan dengan paket bulanan",
    ],
  },
  {
    id: "student",
    name: "Student Discount",
    price: "49",
    originalPrice: "79",
    credits: "2000",
    icon: Star,
    color: "from-pink-500 to-rose-500",
    badge: "Diskon 38%",
    description: "Untuk pelajar & mahasiswa. Dapatkan akses Pro dengan harga spesial!",
    features: [
      "Akses penuh fitur Pro",
      "2.000 kredit per bulan",
      "Semua model premium",
      "Verifikasi email .edu diperlukan",
    ],
  },
  {
    id: "annual",
    name: "Annual VIP",
    price: "1.499",
    originalPrice: "2.388",
    credits: "Unlimited",
    icon: Crown,
    color: "from-indigo-500 to-purple-500",
    badge: "Hemat 37%",
    description: "Paket Unlimited selama 1 tahun penuh dengan harga spesial!",
    features: [
      "UNLIMITED generation 12 bulan",
      "Semua fitur Unlimited",
      "Bonus 3 bulan gratis",
      "Prioritas support VIP",
      "Free early access fitur baru",
    ],
  },
  {
    id: "team",
    name: "Team Plan",
    price: "499",
    originalPrice: "597",
    credits: "Unlimited",
    icon: Users,
    color: "from-cyan-500 to-blue-500",
    badge: "Hemat 16%",
    description: "Untuk tim kreatif. 5 anggota tim dengan akses unlimited!",
    features: [
      "5 anggota tim",
      "Unlimited generation per anggota",
      "Shared workspace & assets",
      "Admin dashboard",
      "Billing terpusat",
    ],
  },
];

const promoBanners = [
  {
    icon: Gift,
    title: "Welcome Bonus",
    desc: "Pengguna baru dapat 100 kredit GRATIS!",
    gradient: "from-studio-1 to-studio-2",
  },
  {
    icon: Rocket,
    title: "Early Adopter",
    desc: "Diskon 20% untuk 1000 pendaftar pertama!",
    gradient: "from-studio-2 to-studio-3",
  },
  {
    icon: Timer,
    title: "Flash Sale",
    desc: "Setiap akhir bulan — diskon 50% semua paket!",
    gradient: "from-studio-4 to-studio-5",
  },
  {
    icon: Users,
    title: "Referral Program",
    desc: "Ajak teman, dapatkan 200 kredit per referral!",
    gradient: "from-studio-5 to-studio-1",
  },
];

export default function Promo() {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">("monthly");

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-studio-1/5 via-studio-4/5 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              <Tag className="w-3 h-3 mr-1" /> Promo & Paket
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Pilih Paket{" "}
              <span className="text-gradient">Terbaikmu</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dapatkan akses ke AI image generation tanpa batas, tools profesional, 
              dan berbagai model premium dengan harga terjangkau.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoBanners.map((banner, i) => {
              const Icon = banner.icon;
              return (
                <motion.div
                  key={banner.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`glass-card p-4 bg-gradient-to-br ${banner.gradient}/10 border-${banner.gradient.split(" ")[1]}/20 hover:border-primary/30 transition-all`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${banner.gradient} p-2 shrink-0`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{banner.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{banner.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoPackages.map((pkg, i) => {
              const Icon = pkg.icon;
              const isPopular = pkg.popular;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1 gap-1">
                        <Flame className="w-3 h-3" /> Paling Populer
                      </Badge>
                    </div>
                  )}

                  <Card
                    className={`glass-card p-6 h-full flex flex-col relative transition-all duration-300 ${
                      isPopular
                        ? "border-primary/40 ring-1 ring-primary/20 scale-[1.02]"
                        : "hover:border-primary/30"
                    }`}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} p-2.5 mb-4`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-lg font-bold">{pkg.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        {pkg.price === "0" ? (
                          <span className="text-4xl font-bold">Gratis</span>
                        ) : (
                          <>
                            <span className="text-3xl sm:text-4xl font-bold">
                              Rp {parseInt(pkg.price).toLocaleString("id-ID")}
                            </span>
                            <span className="text-sm text-muted-foreground">/bln</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {pkg.credits} kredit
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-3 mb-6">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Includes
                      </p>
                      {pkg.features.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{f}</span>
                        </div>
                      ))}

                      {pkg.limitations.length > 0 && (
                        <>
                          <div className="pt-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Limitations
                            </p>
                          </div>
                          {pkg.limitations.map((l, li) => (
                            <div key={li} className="flex items-start gap-2 text-sm">
                              <X className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground/60">{l}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    {/* CTA */}
                    <Button
                      variant={isPopular ? "default" : "outline"}
                      className={`w-full gap-2 ${
                        isPopular ? "glow" : ""
                      }`}
                    >
                      {pkg.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Deals Extra */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              <Gift className="w-3 h-3 mr-1" /> Promo Spesial
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Lebih Banyak <span className="text-gradient">Penawaran</span>
            </h2>
            <p className="text-muted-foreground">
              Diskon khusus dan paket tambahan untuk kebutuhan spesifik kamu.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {promoDeals.map((deal, i) => {
              const Icon = deal.icon;
              return (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-6 group hover:border-primary/30 transition-all h-full flex">
                    <div className="flex gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${deal.color} p-2.5 shrink-0`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{deal.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{deal.description}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-xs bg-green-500/10 text-green-500 border-green-500/30">
                            {deal.badge}
                          </Badge>
                        </div>

                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-2xl font-bold">
                            Rp {parseInt(deal.price).toLocaleString("id-ID")}
                          </span>
                          {deal.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              Rp {parseInt(deal.originalPrice).toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 space-y-1.5">
                          {deal.features.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-green-500 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>

                        <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-xs">
                          <Gift className="w-3 h-3" /> Klaim Promo
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Code */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Card className="glass-card p-8 text-center border-primary/20 bg-gradient-to-br from-studio-1/5 via-studio-4/5 to-transparent">
            <Tag className="w-10 h-10 text-primary/60 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Punya Kode Promo?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Masukkan kode promo kamu di bawah ini untuk mendapatkan diskon spesial!
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Masukkan kode promo..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="pl-9"
                  disabled={promoApplied}
                />
              </div>
              {promoApplied ? (
                <Button variant="outline" className="gap-2 text-green-500" disabled>
                  <CheckCheck className="w-4 h-4" />
                  Applied
                </Button>
              ) : (
                <Button onClick={handleApplyPromo} disabled={!promoCode.trim()} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Apply
                </Button>
              )}
            </div>
            {promoApplied && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-500 mt-3"
              >
                ✓ Kode promo "{promoCode}" berhasil diterapkan! Diskon 20% akan diterapkan saat checkout.
              </motion.p>
            )}
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-studio-1 to-studio-4 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">PixelForge</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/promo" className="hover:text-foreground transition-colors">Promo</Link>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
