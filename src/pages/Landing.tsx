import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  Sliders,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Image Generation",
    description: "Generate stunning images from text prompts using cutting-edge AI models. From photorealistic to artistic styles.",
    gradient: "from-studio-1 to-studio-2",
  },
  {
    icon: Eraser,
    title: "Remove Background",
    description: "Remove backgrounds instantly with AI-powered precision. Perfect for product photos, portraits, and more.",
    gradient: "from-studio-2 to-studio-3",
  },
  {
    icon: Brush,
    title: "Image Editor",
    description: "Full-featured studio editor with filters, adjustments, text overlay, and drawing tools for complete creative control.",
    gradient: "from-studio-3 to-studio-4",
  },
  {
    icon: Brush,
    title: "Watermark & Branding",
    description: "Add custom watermarks, logos, and text overlays to protect and brand your images in seconds.",
    gradient: "from-studio-4 to-studio-5",
  },
  {
    icon: Crop,
    title: "Smart Crop & Resize",
    description: "Intelligent cropping with aspect ratio presets. Smart composition detection for perfect framing every time.",
    gradient: "from-studio-5 to-studio-1",
  },
  {
    icon: Shrink,
    title: "Convert & Compress",
    description: "Convert between formats (PNG, JPG, WebP, AVIF) and compress without quality loss. Optimize for web and print.",
    gradient: "from-studio-1 to-studio-3",
  },
];

const toolsList = [
  { icon: Eraser, label: "Remove BG", desc: "AI background removal" },
  { icon: ScanSearch, label: "Remove Metadata", desc: "Strip EXIF data" },
  { icon: Paintbrush, label: "Watermark", desc: "Add custom watermarks" },
  { icon: Crop, label: "Smart Crop", desc: "AI-powered cropping" },
  { icon: Shrink, label: "Convert & Compress", desc: "Format & size optimization" },
  { icon: Wand2, label: "Serious Edit", desc: "Advanced editing" },
  { icon: Layers, label: "Trace SBG", desc: "Shape background trace" },
  { icon: Palette, label: "Color Tools", desc: "Color adjustment suite" },
];

const stats = [
  { label: "Images Generated", value: "2.4M+", icon: Zap },
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Tools Available", value: "25+", icon: Layers },
  { label: "Uptime", value: "99.9%", icon: Shield },
];

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-studio-1/5 via-transparent to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-studio-1/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-studio-4/10 rounded-full blur-[128px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-studio-2/5 rounded-full blur-[150px] animate-pulse delay-500" />
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs border-primary/30 bg-primary/5 text-primary">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Powered by Advanced AI
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-gradient">Create & Edit</span>
            <br />
            <span className="text-foreground">Images with AI</span>
          </motion.h1>

          {/* Description */}
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
              <Button size="lg" className="gap-2 text-base px-8 h-12 glow">
                <Sparkles className="w-5 h-5" />
                Start Creating
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/tools">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                <Palette className="w-5 h-5" />
                Explore Tools
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
          >
            {["AI Generation", "Remove BG", "Image Editor", "Smart Crop", "Watermark", "Convert", "Studio", "Models"].map(
              (tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1.5 text-xs bg-secondary/50 backdrop-blur-sm border-border/50"
                >
                  {tag}
                </Badge>
              ),
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-6 text-center group hover:border-primary/30 transition-colors">
                    <Icon className="w-6 h-6 mx-auto mb-3 text-primary/70 group-hover:text-primary transition-colors" />
                    <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 h-full">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
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

      {/* Tools Showcase */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-studio-1/5 via-transparent to-studio-4/5" />
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {toolsList.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link to="/tools">
                    <Card className="glass-card p-5 text-center group hover:border-primary/30 hover:glow transition-all duration-300 cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1">{tool.label}</h3>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-studio-1/10 via-studio-4/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              Get Started
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Ready to{" "}
              <span className="text-gradient">create something amazing</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of creators using PixelForge to generate, edit, and transform their images.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generate">
                <Button size="lg" className="gap-2 text-base px-10 h-12 glow-lg">
                  <Sparkles className="w-5 h-5" />
                  Start Creating Free
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="gap-2 text-base px-10 h-12">
                  <Users className="w-5 h-5" />
                  Sign Up Free
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
              {["No credit card", "Free tier included", "Unlimited generations", "All tools free"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-primary" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </motion.div>
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
          <p className="text-xs text-muted-foreground">
            Built with ❤️ — Powered by cutting-edge AI
          </p>
        </div>
      </footer>
    </div>
  );
}
