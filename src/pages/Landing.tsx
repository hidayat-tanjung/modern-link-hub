import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  Check,
  Users,
  Zap,
  Shield,
  Layers,
  Paintbrush,
  Film,
  Star,
  Rocket,
  Heart,
  Lightbulb,
} from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";

// ── Animated Counter ──────────────────────────────────────────────

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const displayValue = useTransform(springValue, (latest) => {
    if (value.includes("M")) return `${Math.floor(latest / 10000) / 100}M+`;
    if (value.includes("K")) return `${Math.floor(latest / 100) / 10}K+`;
    const hasPlus = value.endsWith("+");
    return hasPlus ? `${Math.floor(latest)}+` : `${Math.floor(latest)}`;
  });

  useEffect(() => {
    if (isInView) motionValue.set(num);
  }, [isInView, num, motionValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

// ── Floating Orb ───────────────────────────────────────────────────

function FloatingOrb({ className, size, color, delay }: { className?: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ width: size, height: size, background: color }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -40, 20, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ── Floating Particles ────────────────────────────────────────────

function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ── Features ───────────────────────────────────────────────────────

const features = [
  {
    icon: Sparkles,
    title: "AI Image Generation",
    description: "Generate stunning images from text prompts using cutting-edge AI models. From photorealistic to artistic styles.",
    gradient: "from-studio-1 to-studio-2",
    color: "bg-studio-1/10",
  },
  {
    icon: Eraser,
    title: "Remove Background",
    description: "Remove backgrounds instantly with AI-powered precision. Perfect for product photos, portraits, and more.",
    gradient: "from-studio-2 to-studio-3",
    color: "bg-studio-2/10",
  },
  {
    icon: Film,
    title: "Animated Icons & MP4",
    description: "Create stunning animated icons and motion graphics with particles, trails, and multi-layer effects. Export as WebM/MP4.",
    gradient: "from-studio-3 to-studio-4",
    color: "bg-studio-3/10",
  },
  {
    icon: Brush,
    title: "Image Editor & Studio",
    description: "Full-featured studio editor with filters, adjustments, drawing tools, and complete creative control over your images.",
    gradient: "from-studio-4 to-studio-5",
    color: "bg-studio-4/10",
  },
  {
    icon: Shield,
    title: "Auto Metadata for Stock",
    description: "Every generated image gets automatic descriptions, categories, and stock tags — ready for Shutterstock & Adobe Stock.",
    gradient: "from-studio-5 to-studio-1",
    color: "bg-studio-5/10",
  },
  {
    icon: Palette,
    title: "Convert & Color Tools",
    description: "Convert between formats, compress images, adjust colors, add watermarks — all the tools you need in one place.",
    gradient: "from-studio-1 to-studio-3",
    color: "bg-studio-1/10",
  },
];

const toolsList = [
  { icon: Eraser, label: "Remove BG", desc: "AI background removal", gradient: "from-rose-500 to-orange-500" },
  { icon: ScanSearch, label: "Remove Metadata", desc: "Strip EXIF data", gradient: "from-blue-500 to-cyan-500" },
  { icon: Paintbrush, label: "Watermark", desc: "Add custom watermarks", gradient: "from-violet-500 to-purple-500" },
  { icon: Crop, label: "Smart Crop", desc: "AI-powered cropping", gradient: "from-green-500 to-emerald-500" },
  { icon: Shrink, label: "Convert & Compress", desc: "Format & size optimization", gradient: "from-amber-500 to-yellow-500" },
  { icon: Wand2, label: "Serious Edit", desc: "Advanced editing suite", gradient: "from-pink-500 to-rose-500" },
  { icon: Film, label: "Animate", desc: "Animated icons & MP4", gradient: "from-violet-500 to-pink-500" },
  { icon: Layers, label: "Trace SBG", desc: "Shape background trace", gradient: "from-indigo-500 to-blue-500" },
  { icon: Palette, label: "Color Tools", desc: "Color adjustment suite", gradient: "from-teal-500 to-cyan-500" },
];

const stats = [
  { label: "Images Generated", value: "2.4M+", icon: Zap },
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Tools Available", value: "25+", icon: Layers },
  { label: "Stock Platforms", value: "4+", icon: Shield },
];

const steps = [
  { icon: Lightbulb, title: "Describe", desc: "Type what you want to see — from simple icons to detailed scenes." },
  { icon: Zap, title: "Generate", desc: "Our AI brings your vision to life in seconds with stunning quality." },
  { icon: Wand2, title: "Enhance", desc: "Edit, animate, watermark, or convert — all the tools are at your fingertips." },
  { icon: Rocket, title: "Export", desc: "Download in any format or publish directly to stock platforms." },
];

const testimonials = [
  { quote: "PixelForge completely changed my workflow. I can create stock images in minutes instead of hours.", author: "Sarah Chen", role: "Digital Artist" },
  { quote: "The animated icon feature is incredible. Perfect for my UI/UX projects.", author: "Marcus Johnson", role: "UI Designer" },
  { quote: "Free and unlimited AI generation? It's almost too good to be true. Absolutely love it.", author: "Priya Patel", role: "Content Creator" },
];

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ─── HERO SECTION ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating orbs */}
        <FloatingOrb size={500} color="oklch(0.68 0.24 258 / 0.12)" delay={0} className="-top-1/4 -left-1/4" />
        <FloatingOrb size={400} color="oklch(0.62 0.16 220 / 0.10)" delay={1.5} className="-bottom-1/4 -right-1/4" />
        <FloatingOrb size={350} color="oklch(0.52 0.20 260 / 0.08)" delay={3} className="top-1/3 right-0" />

        {/* Particle field */}
        <ParticleField />

        {/* Fade overlay at bottom */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Powered by Advanced AI
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-gradient">Create & Edit</span>
            <br />
            <span className="text-foreground/90">Images with AI</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            The all-in-one creative studio. Generate images from text, remove backgrounds,
            edit professionally, and transform your visuals — all powered by AI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/generate">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="gap-2 text-base px-8 h-12 glow">
                  <Sparkles className="w-5 h-5" />
                  Start Creating
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/tools">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                  <Palette className="w-5 h-5" />
                  Explore Tools
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Feature Pills with stagger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
          >
            {[
              "AI Generation",
              "Animated Icons",
              "Remove BG",
              "Image Editor",
              "Smart Crop",
              "Watermark",
              "Convert",
              "Studio",
            ].map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 text-xs bg-secondary/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      <WaveDivider />

      {/* ─── STATS SECTION ─── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-studio-1/3 via-transparent to-studio-4/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-6 sm:p-8 text-center group hover:border-primary/30 hover:glow transition-all duration-500">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-studio-1/20 to-studio-4/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              From idea to image in{" "}
              <span className="text-gradient">4 simple steps</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No complex software, no learning curve. Just describe, generate, and create.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-300 h-full relative overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-20 h-20 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-studio-1/20 to-studio-4/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-primary/20 mb-2">0{i + 1}</div>
                      <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-studio-1/3 via-transparent to-studio-4/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="text-gradient">create & edit</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From AI-powered generation to professional editing tools — PixelForge has everything
              you need to bring your creative vision to life.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <Link to={feature.title.includes("Animated") ? "/animate" : "/generate"}>
                    <Card className="glass-card p-6 group hover:border-primary/30 hover:glow transition-all duration-300 h-full cursor-pointer">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Try it now <ArrowRight className="w-3 h-3" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TOOLS SHOWCASE ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-studio-1/5 via-transparent to-studio-4/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              All Tools
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Professional <span className="text-gradient">Image Tools</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete suite of image editing tools at your fingertips. No downloads, no complex software.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {toolsList.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                >
                  <Link to="/tools">
                    <Card className="glass-card p-4 text-center group hover:border-primary/30 hover:glow transition-all duration-300 cursor-pointer h-full">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} p-2 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-xs font-semibold mb-0.5">{tool.label}</h3>
                      <p className="text-[10px] text-muted-foreground">{tool.desc}</p>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by{" "}
              <span className="text-gradient">creators worldwide</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card p-6 h-full group hover:border-primary/30 transition-all duration-300">
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-studio-1 text-studio-1" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-studio-1 to-studio-3 flex items-center justify-center text-white text-xs font-bold">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FREE & UNLIMITED ─── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card p-8 sm:p-12 border-primary/20 bg-gradient-to-br from-primary/8 via-transparent to-transparent relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="outline" className="mb-4 border-green-500/30 text-green-500 bg-green-500/5">
                    <Sparkles className="w-3 h-3 mr-1" /> Free & Unlimited
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">All Features, Totally Free</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    No quotas, no limits, no credit card. Every feature is completely free and unlimited for all users.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Unlimited AI image generation",
                      "Unlimited animated icons & MP4 export",
                      "All style presets available (Anime, Photorealistic, etc.)",
                      "Auto description, categories & stock tags included",
                      "Commercial use ready (Shutterstock, Adobe Stock)",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Sparkles, label: "Unlimited", desc: "No quotas, no limits", color: "text-primary" },
                    { icon: Film, label: "Animated Icons", desc: "MP4/WebM export", color: "text-purple-500" },
                    { icon: Shield, label: "Commercial Use", desc: "Ready for stock", color: "text-green-500" },
                    { icon: ImageIcon, label: "AI Quality", desc: "Flux model", color: "text-blue-500" },
                  ].map((item, i) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Card className="glass-card p-4 text-center hover:border-primary/30 transition-all duration-300">
                          <ItemIcon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 relative overflow-hidden">
        <FloatingOrb size={600} color="oklch(0.68 0.24 258 / 0.06)" delay={0} className="-top-1/3 -left-1/3" />
        <FloatingOrb size={400} color="oklch(0.62 0.16 220 / 0.05)" delay={2} className="-bottom-1/4 -right-1/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-studio-1/8 via-studio-4/5 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              Get Started
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
              Ready to{" "}
              <span className="text-gradient">create something amazing</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of creators using PixelForge to generate, edit, and transform their images.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="gap-2 text-base px-10 h-12 glow-lg">
                    <Sparkles className="w-5 h-5" />
                    Start Creating Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/tools">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="gap-2 text-base px-10 h-12">
                    <Wand2 className="w-5 h-5" />
                    Browse All Tools
                  </Button>
                </motion.div>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground"
            >
              {["No credit card", "Free & unlimited", "Commercial use OK", "8K+ ready"].map(
                (item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </motion.span>
                ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/50 py-8 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-studio-1 to-studio-3 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">PixelForge</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="text-xs text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/generate" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Generate</Link>
            <Link to="/tools" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Tools</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with <Heart className="w-3 h-3 inline text-red-500" /> — Powered by cutting-edge AI
          </p>
        </div>
      </footer>
    </div>
  );
}
