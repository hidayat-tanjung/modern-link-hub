import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import {
  Sparkles,
  Check,
  Zap,
  Gift,
  Crown,
  Shield,
  Unlock,
  Infinity,
  Palette,
  ImageIcon,
  Layers,
  Star,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Unlimited AI Generation",
    description: "Generate unlimited images from text prompts using Flux AI model. No limits, no restrictions.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Palette,
    title: "6 Style Presets",
    description: "Photorealistic, Anime, Oil Painting, 3D Render, Pixel Art, Watercolor — all free to use.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: ImageIcon,
    title: "8 Professional Tools",
    description: "Remove BG, Watermark, Smart Crop, Convert & Compress, and more — all tools included.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    title: "Studio Editor",
    description: "Full-featured canvas editor with brushes, text, shapes, filters, and layers.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Crown,
    title: "12 AI Models",
    description: "Access all models including Flux Pro, Stable Diffusion XL, Anime V4, and more.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Commercial Use OK",
    description: "All generated images are suitable for Shutterstock, Adobe Stock, and other stock platforms.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const faqItems = [
  {
    q: "Apakah semua fitur benar-benar gratis?",
    a: "Ya! Semua fitur PixelForge 100% gratis. Tidak ada paket premium, tidak ada kredit, tidak ada batasan. Generate sebanyak yang kamu mau.",
  },
  {
    q: "Apakah gambar bisa di-upload ke Shutterstock/Adobe Stock?",
    a: "Ya! Semua gambar yang dihasilkan menggunakan AI models kami berkualitas tinggi (1024x1024+) dan suitable untuk komersial use. Kamu bisa upload ke Shutterstock, Adobe Stock, dan platform stock lainnya.",
  },
  {
    q: "Apakah ada batasan generate?",
    a: "Tidak ada batasan! Generate gambar sebanyak yang kamu mau, 24/7, tanpa limit.",
  },
  {
    q: "Model mana yang terbaik untuk anime?",
    a: "Untuk karakter anime, gunakan model 'Anime V4' atau 'Anime XL'. Pilih style 'Anime' di Generate page untuk hasil terbaik.",
  },
];

export default function Promo() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-studio-1/5 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-4 border-green-500/30 text-green-500 bg-green-500/5">
              <Unlock className="w-3 h-3 mr-1" /> 100% Free Forever
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Semua Fitur{" "}
              <span className="text-gradient">Gratis</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Tidak ada paket premium, tidak ada kredit, tidak ada batasan.
              Semua AI models, tools, dan fitur tersedia gratis untuk semua pengguna.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Unlock, text: "All Free" },
                { icon: Infinity, text: "Unlimited" },
                { icon: Shield, text: "Commercial Use" },
                { icon: Zap, text: "No Limits" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Badge key={item.text} variant="secondary" className="gap-1.5 px-4 py-2 text-sm">
                    <Icon className="w-4 h-4 text-green-500" /> {item.text}
                  </Badge>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate">
                <Button size="lg" className="gap-2 text-base px-10 h-12 glow">
                  <Sparkles className="w-5 h-5" />
                  Start Generating Free
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
              <Gift className="w-3 h-3 mr-1" /> Free Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Yang Kamu Dapatkan{" "}
              <span className="text-gradient">Secara Gratis</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua fitur di bawah ini tersedia tanpa biaya, tanpa batasan, untuk semua pengguna.
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
                    <div className="mt-4">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 gap-1">
                        <Check className="w-3 h-3" /> Free Forever
                      </Badge>
                    </div>
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
                  Semua gambar yang dihasilkan PixelForge berkualitas tinggi dan siap untuk di-upload ke platform stock photography.
                </p>
                <div className="space-y-3">
                  {[
                    "Resolusi 1024x1024+ (high quality)",
                    "Format JPEG untuk kompatibilitas maksimal",
                    "Tidak ada watermark di gambar",
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

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Card className="glass-card p-10 border-primary/20 bg-gradient-to-br from-studio-1/5 via-studio-4/5 to-transparent">
            <Sparkles className="w-12 h-12 text-primary/60 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Siap Mulai?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Mulai generate gambar AI sekarang — gratis, tanpa batasan, untuk semua kebutuhanmu.
            </p>
            <Link to="/generate">
              <Button size="lg" className="gap-2 text-base px-10 h-12 glow">
                <Sparkles className="w-5 h-5" />
                Generate Sekarang
              </Button>
            </Link>
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
