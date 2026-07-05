import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import AppHeader from "@/components/AppHeader";
import {
  Sparkles,
  Loader2,
  Download,
  ImageIcon,
  Palette,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  Sliders,
} from "lucide-react";

function CuboidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function hslToString(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generatePlaceholderImage(prompt: string, style: string, seed: number): string {
  const canvas = document.createElement("canvas");
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Color schemes per style
  const schemes: Record<string, { bg1: number[]; bg2: number[]; accent: number[]; glow: number[] }> = {
    photorealistic: { bg1: [220, 30, 15], bg2: [260, 25, 10], accent: [200, 60, 50], glow: [210, 50, 30] },
    anime: { bg1: [330, 40, 20], bg2: [280, 35, 12], accent: [340, 80, 65], glow: [320, 60, 35] },
    "oil-painting": { bg1: [30, 25, 18], bg2: [15, 30, 10], accent: [25, 70, 55], glow: [35, 50, 30] },
    "3d-render": { bg1: [240, 20, 12], bg2: [200, 25, 8], accent: [220, 70, 55], glow: [230, 50, 25] },
    "pixel-art": { bg1: [170, 35, 15], bg2: [140, 30, 10], accent: [160, 70, 50], glow: [155, 50, 25] },
    watercolor: { bg1: [10, 25, 20], bg2: [350, 20, 12], accent: [5, 65, 60], glow: [355, 45, 30] },
  };

  const scheme = schemes[style] || schemes.photorealistic;

  // Gradient background
  const grad = ctx.createRadialGradient(size * 0.3, size * 0.3, 50, size * 0.5, size * 0.5, size * 0.8);
  grad.addColorStop(0, hslToString(scheme.bg1[0], scheme.bg1[1], scheme.bg1[2]));
  grad.addColorStop(0.6, hslToString(scheme.bg2[0], scheme.bg2[1], scheme.bg2[2]));
  grad.addColorStop(1, hslToString(scheme.bg2[0], scheme.bg2[1], 5));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Draw decorative blobs
  const rng = (min: number, max: number) => min + ((seed * 9301 + 49297 * (seed % 10)) % (max - min));
  const blobCount = 3 + (seed % 5);
  for (let i = 0; i < blobCount; i++) {
    const cx = (rng(i * 100, size - 100) + i * 50) % size;
    const cy = (rng(i * 200, size - 100) + i * 80) % size;
    const r = 60 + ((seed * (i + 1) * 7) % 120);
    const alpha = 0.08 + ((seed * (i + 1) * 3) % 10) * 0.02;
    const blobGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    blobGrad.addColorStop(0, `hsla(${scheme.accent[0] + i * 20}, ${scheme.accent[1]}%, ${scheme.accent[2]}%, ${alpha})`);
    blobGrad.addColorStop(1, `hsla(${scheme.accent[0] + i * 20}, ${scheme.accent[1]}%, ${scheme.accent[2]}%, 0)`);
    ctx.fillStyle = blobGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle grid overlay
  ctx.strokeStyle = `hsla(${scheme.accent[0]}, ${scheme.accent[1]}%, ${scheme.accent[2]}%, 0.04)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Glow effect
  const glowGrad = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.6);
  glowGrad.addColorStop(0, `hsla(${scheme.glow[0]}, ${scheme.glow[1]}%, ${scheme.glow[2]}%, 0.15)`);
  glowGrad.addColorStop(1, `hsla(${scheme.glow[0]}, ${scheme.glow[1]}%, ${scheme.glow[2]}%, 0)`);
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, size, size);

  // Bottom info bar
  ctx.fillStyle = `hsla(0, 0%, 0%, 0.4)`;
  ctx.fillRect(0, size - 60, size, 60);
  const barGrad = ctx.createLinearGradient(0, size - 60, 0, size);
  barGrad.addColorStop(0, "transparent");
  barGrad.addColorStop(0.3, `hsla(0, 0%, 0%, 0.5)`);
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, size - 60, size, 60);

  // Prompt text on the image
  ctx.fillStyle = `hsla(0, 0%, 100%, 0.85)`;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Word wrap the prompt
  const words = prompt.split(" ");
  const maxWidth = size - 40;
  let lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const test = currentLine ? currentLine + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Show max 2 lines then truncate
  if (lines.length > 2) {
    lines = [lines[0], lines[1] + "..."];
  }

  const textY = size - 32;
  lines.forEach((line, i) => {
    const y = textY + (i - (lines.length - 1) / 2) * 20;
    ctx.fillText(line, size / 2, y);
  });

  // Style badge
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = `hsla(${scheme.accent[0]}, ${scheme.accent[1]}%, ${scheme.accent[2]}%, 0.9)`;
  ctx.textAlign = "right";
  ctx.fillText(style.toUpperCase(), size - 16, 24);

  return canvas.toDataURL("image/jpeg", 0.92);
}

const stylePresets = [
  { label: "Photorealistic", value: "photorealistic", icon: ImageIcon },
  { label: "Anime", value: "anime", icon: Palette },
  { label: "Oil Painting", value: "oil-painting", icon: Wand2 },
  { label: "3D Render", value: "3d-render", icon: CuboidIcon },
  { label: "Pixel Art", value: "pixel-art", icon: GridIcon },
  { label: "Watercolor", value: "watercolor", icon: DropletIcon },
];

const samplePrompts = [
  "A serene mountain lake at sunset, photorealistic",
  "Cyberpunk city street with neon lights, anime style",
  "Majestic dragon flying over medieval castle, oil painting",
  "Futuristic sports car on highway, 3D render",
  "Cute pixel art character with sword and shield",
];

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [results, setResults] = useState<{ id: number; prompt: string; style: string; url: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate actual image using Canvas
    const styleLabel = stylePresets.find((s) => s.value === selectedStyle)?.label || "Custom";
    const imageUrl = generatePlaceholderImage(prompt, selectedStyle, Date.now());

    const newResult = {
      id: Date.now(),
      prompt: prompt,
      style: styleLabel,
      url: imageUrl,
    };
    setResults((prev) => [newResult, ...prev]);
    setIsGenerating(false);
  };

  const handleCopyPrompt = (promptText: string, id: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = `pixelforge-${filename.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const handleRegenerate = (result: typeof results[0]) => {
    const newUrl = generatePlaceholderImage(result.prompt, selectedStyle, Date.now() + 1);
    setResults((prev) => prev.map((r) => (r.id === result.id ? { ...r, url: newUrl } : r)));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              AI <span className="text-gradient">Image Generation</span>
            </h1>
            <p className="text-muted-foreground">
              Describe what you want to see, and let AI bring it to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="glass-card p-5 space-y-4">
                <Label className="text-sm font-semibold">Prompt</Label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    placeholder="A majestic dragon flying over a medieval castle..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => setNegativePrompt(!negativePrompt)}
                  >
                    <Sliders className="w-3 h-3" />
                    Negative prompt
                  </Button>
                </div>

                {negativePrompt && (
                  <Input
                    placeholder="Things to avoid in the image..."
                    className="text-sm"
                  />
                )}

                <Button
                  className="w-full gap-2 glow"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </Button>
              </Card>

              <Card className="glass-card p-5 space-y-4">
                <Label className="text-sm font-semibold">Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {stylePresets.map((style) => {
                    const Icon = style.icon;
                    const isSelected = selectedStyle === style.value;
                    return (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg text-xs transition-all ${
                          isSelected
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card className="glass-card p-5 space-y-3">
                <Label className="text-sm font-semibold">Try these prompts</Label>
                <div className="space-y-2">
                  {samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(p)}
                      className="w-full text-left text-xs p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground leading-relaxed"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {results.length === 0 && !isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-xl border-2 border-dashed border-border/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-studio-1/20 to-studio-4/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                    No generations yet
                  </h3>
                  <p className="text-sm text-muted-foreground/60 text-center max-w-sm">
                    Enter a prompt on the left and click Generate to create your first AI image.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {isGenerating && results.length === 0 && (
                    <div className="sm:col-span-2 flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-studio-1 to-studio-4 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <p className="text-sm text-muted-foreground">Creating your image...</p>
                      </div>
                    </div>
                  )}
                  <AnimatePresence>
                    {results.map((result, i) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        layout
                      >
                        <Card className="glass-card overflow-hidden group">
                          <div className="aspect-square relative overflow-hidden">
                            <img
                              src={result.url}
                              alt={result.prompt}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="w-10 h-10"
                                onClick={() => handleDownload(result.url, result.prompt)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="w-10 h-10"
                                onClick={() => handleRegenerate(result)}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="w-10 h-10"
                                onClick={() => handleCopyPrompt(result.prompt, result.id)}
                              >
                                {copiedId === result.id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-medium truncate">{result.prompt}</p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {result.style}
                            </Badge>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
