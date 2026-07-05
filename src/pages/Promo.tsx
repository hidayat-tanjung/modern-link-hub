import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import {
  Sparkles,
  Check,
  Zap,
  Crown,
  Shield,
  Unlock,
  Layers,
  Palette,
  ImageIcon,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Image Generation",
    description: "Generate stunning images from text prompts using Flux AI model. High quality, detailed output.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Palette,
    title: "6 Style Presets",
    description: "Photorealistic, Anime, Oil Painting, 3D Render, Pixel Art, Watercolor — all free to use.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: ImageIcon,
    title: "8 Professional Tools",
    description: "Remove BG, Watermark, Smart Crop, Convert & Compress, and more — all tools included.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Layers,
    title: "Studio Editor",
    description: "Full-featured canvas editor with brushes, text, shapes, filters, and layers.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Commercial Use OK",
    description: "All generated images are suitable for Shutterstock, Adobe Stock, and other stock platforms.",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Admin Full Access",
    description: "Admin accounts get unlimited generations with no quota restrictions. Contact admin for access.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const faqItems = [
  {
    q: "Bagaimana sistem quota bekerja?",
    a: "Pengguna free mendapat quota yang reset setiap 3 hari. Setelah quota habis, kamu perlu menunggu reset berikutnya untuk generate lagi. Admin mendapat akses penuh tanpa batas.",
  },
  {
    q: "Apakah gambar bisa di-upload ke Shutterstock/Adobe Stock?",
    a: "Ya! Semua gambar yang dihasilkan menggunakan AI models kami berkualitas tinggi (1024x1024+) dan siap untuk komersial use. Kamu bisa upload ke Shutterstock, Adobe Stock, dan platform stock lainnya.",
  },
  {
    q: "Bagaimana cara mendapatkan akses admin?",
    a: "Hubungi administrator untuk mendapatkan akses admin. Admin mendapat quota unlimited dan bisa generate tanpa batasan.",
  },
  {
    q: "Apakah ada deskripsi dan kategori otomatis?",
    a: "Ya! Setiap gambar yang di-generate akan otomatis mendapat deskripsi dan kategori yang sesuai, siap untuk di-upload ke stock platforms.",
  },
];

export default function Promo() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-studio-1/5 via-studio-2/5 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              <Unlock className="w-3 h-3 mr-1" /> Free Tier Available
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              AI Image Generation{" "}
              <span className="text-gradient">Free</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate gambar AI berkualitas tinggi dengan quota gratis.
              Reset tiap 3 hari. Admin mendapat akses unlimited.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Clock, text: "3-Day Reset" },
                { icon: Shield, text: "Commercial Use" },
                { icon: Sparkles, text: "Auto Description" },
                { icon: Crown, text: "Admin Unlimited" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Badge key={item.text} variant="secondary" className="gap-1.5 px-4 py-2 text-sm">
                    <Icon className="w-4 h-4 text-primary" /> {item.text}
                  </Badge>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate">
                <Button size="lg" className="gap-2 text-base px-10 h-12 glow">
                  <Sparkles className="w-5 h-5" />
                  Start Generating
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/models">
                <Button variant="outline" size="lg" className="gap-2 text-base px-10 h-12">
                  <Crown className="w-5 h-5" />
                  Browse All Models
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              <Zap className="w-3 h-3 mr-1" /> Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Yang Kamu Dapatkan{" "}
              <span className="text-gradient">Secara Gratis</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua fitur di bawah ini tersedia untuk semua pengguna free dengan quota 3-hari.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stock Site Ready */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Card className="glass-card p-8 border-green-500/20 bg-gradient-to-br from-green-500/5 via-transparent to-transparent">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="outline" className="mb-4 border-green-500/30 text-green-500 bg-green-500/5">
                  <Shield className="w-3 h-3 mr-1" /> Commercial Use
                </Badge>
                <h2 className="text-2xl font-bold mb-4">Ready for Stock Platforms</h2>
                <p className="text-muted-foreground mb-6">
                  Semua gambar berkualitas tinggi dan siap untuk di-upload ke platform stock photography.
                </p>
                <div className="space-y-3">
                  {[
                    "Resolusi 1024x1024+ (high quality)",
                    "Format JPEG untuk kompatibilitas maksimal",
                    "Auto-generated description & kategori",
                    "Lisensi komersial untuk semua pengguna",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Shutterstock", desc: "Upload & sell" },
                  { name: "Adobe Stock", desc: "Contributor ready" },
                  { name: "iStock", desc: "Commercial use" },
                  { name: "Getty Images", desc: "Premium quality" },
                ].map((platform) => (
                  <Card key={platform.name} className="glass-card p-4 text-center hover:border-primary/30 transition-colors">
                    <p className="font-semibold text-sm">{platform.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{platform.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">
              Pertanyaan <span className="text-gradient">Umum</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card p-5">
                  <h3 className="font-semibold text-sm mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-studio-1 to-studio-3 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">PixelForge</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ — Powered by cutting-edge AI
          </p>
        </div>
      </footer>
    </div>
  );
}
