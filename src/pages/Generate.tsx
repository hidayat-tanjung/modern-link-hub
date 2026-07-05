import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
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
  Shield,
  FileText,
  Tag,
  Clock,
  Crown,
} from "lucide-react";

// ── Auto-generate metadata from prompt ──────────────────────────────
function generateMetadata(prompt: string, style: string) {
  const p = prompt.toLowerCase();

  // Category detection
  const categories: string[] = [];
  if (/portrait|face|person|woman|man|girl|boy|selfie|headshot/i.test(p)) categories.push("Portrait");
  if (/landscape|mountain|forest|ocean|sea|river|lake|sunset|sunrise|sky/i.test(p)) categories.push("Landscape");
  if (/animal|cat|dog|bird|horse|tiger|lion|wolf|fish|dragon/i.test(p)) categories.push("Animals");
  if (/city|street|building|architecture|house|skyscraper|urban/i.test(p)) categories.push("Architecture");
  if (/flower|plant|tree|garden|leaf|nature|botanical/i.test(p)) categories.push("Nature");
  if (/car|vehicle|plane|ship|train|motorcycle|truck/i.test(p)) categories.push("Transportation");
  if (/food|pizza|sushi|cake|coffee|fruit|dish|meal|cook/i.test(p)) categories.push("Food & Drink");
  if (/space|galaxy|star|planet|moon|nebula|universe/i.test(p)) categories.push("Science & Space");
  if (/fantasy|dragon|magic|sword|castle|fairy|elf|monster/i.test(p)) categories.push("Fantasy");
  if (/abstract|pattern|geometric|minimalist|design|logo/i.test(p)) categories.push("Abstract");
  if (/anime|manga|chibi|otaku|kawaii/i.test(p) || style === "anime") categories.push("Anime & Manga");
  if (/product|bottle|box|package|brand/i.test(p)) categories.push("Product");
  if (/fashion|dress|clothing|shoes|accessor|model|style/i.test(p)) categories.push("Fashion");
  if (categories.length === 0) categories.push("General");

  // Shutterstock-style description
  const styleDesc =
    style === "photorealistic" ? "Photorealistic" :
    style === "anime" ? "Anime style illustration" :
    style === "oil-painting" ? "Oil painting artwork" :
    style === "3d-render" ? "3D rendered image" :
    style === "pixel-art" ? "Pixel art design" :
    style === "watercolor" ? "Watercolor painting" :
    "AI-generated artwork";

  const description = `${styleDesc}: ${prompt}. High-quality, detailed digital image suitable for commercial use, print, and web applications.`;

  // Shutterstock categories (top-level)
  const stockCategories = [
    "Creative > Digital Arts",
    "Creative > Illustration",
  ];
  if (categories.includes("Portrait")) stockCategories.unshift("People > Portraits");
  if (categories.includes("Landscape")) stockCategories.unshift("Nature > Landscapes");
  if (categories.includes("Animals")) stockCategories.unshift("Animals > Wildlife");
  if (categories.includes("Architecture")) stockCategories.unshift("Architecture > Buildings");
  if (categories.includes("Fantasy")) stockCategories.unshift("Creative > Fantasy");
  if (categories.includes("Abstract")) stockCategories.unshift("Creative > Abstract");

  return { categories, description, stockCategories: stockCategories.slice(0, 3) };
}

// ── Style presets ──────────────────────────────────────────────────
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

const styleKeywords: Record<string, string> = {
  photorealistic: "photorealistic, highly detailed, 8k",
  anime: "anime style, clear sharp lines, detailed character design, clean linework, vibrant colors, studio ghibli",
  "oil-painting": "oil painting style, masterpiece, detailed brushwork",
  "3d-render": "3d render, octane render, cinematic lighting, highly detailed, sharp focus",
  "pixel-art": "pixel art, retro game style, 16-bit",
  watercolor: "watercolor painting, soft colors, artistic",
};

// ── Constants ─────────────────────────────────────────────────────
const QUOTA_LIMIT = 5;

export default function Generate() {
  const { user } = useAuth();
  const recordGeneration = useMutation(api.generations.record);
  const quotaStatus = useQuery(api.quotas.status);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [negativeText, setNegativeText] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [results, setResults] = useState<
    {
      id: number;
      prompt: string;
      style: string;
      styleValue: string;
      url: string;
      metadata: ReturnType<typeof generateMetadata>;
    }[]
  >([]);

  const isAdmin = user?.role === "admin" || quotaStatus?.isAdmin;
  const remaining = quotaStatus?.remaining ?? 0;
  const resetIn = quotaStatus?.resetAt ? Math.max(0, quotaStatus.resetAt - Date.now()) : 0;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Quota enforcement (skip for admin)
    if (!isAdmin && remaining <= 0) {
      const hoursLeft = resetIn > 0 ? Math.ceil(resetIn / (1000 * 60 * 60)) : 72;
      toast.error(`Quota habis! Reset dalam ~${hoursLeft} jam. Admin bisa generate tanpa batas.`);
      return;
    }

    setIsGenerating(true);

    try {
      const styleLabel = stylePresets.find((s) => s.value === selectedStyle)?.label || "Custom";
      const seed = Math.floor(Math.random() * 100000);
      const styleKeyword = styleKeywords[selectedStyle] || "";
      const negPart = negativeText.trim() ? `, avoid: ${negativeText}` : "";
      const fullPrompt = `${prompt}, ${styleKeyword}${negPart}`;

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
      });

      const metadata = generateMetadata(prompt, selectedStyle);
      
      // Persist to Convex and consume quota server-side (fire-and-forget)
      recordGeneration({
        prompt,
        style: styleLabel,
        styleValue: selectedStyle,
        imageUrl,
        metadata,
      }).catch(() => {});

      setResults((prev) => [
        { id: Date.now(), prompt, style: styleLabel, styleValue: selectedStyle, url: imageUrl, metadata },
        ...prev,
      ]);
    } catch {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyField = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.download = `pixelforge-${filename.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    link.href = url;
    link.click();
  };

  const handleRegenerate = async (result: (typeof results)[0]) => {
    const newSeed = Math.floor(Math.random() * 100000);
    const styleKeyword = styleKeywords[result.styleValue] || "";
    const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${result.prompt}, ${styleKeyword}`)}?width=1024&height=1024&model=flux&nologo=true&seed=${newSeed}`;
    setResults((prev) => prev.map((r) => (r.id === result.id ? { ...r, url: "" } : r)));
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = newUrl;
      });
      setResults((prev) => prev.map((r) => (r.id === result.id ? { ...r, url: newUrl } : r)));
    } catch {
      toast.error("Failed to regenerate. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                AI <span className="text-gradient">Image Generation</span>
              </h1>
              {isAdmin ? (
                <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <Crown className="w-3 h-3" /> Admin
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                  <Clock className="w-3 h-3" /> {remaining} / {QUOTA_LIMIT} generates · Resets in {Math.ceil(resetIn / (1000 * 60 * 60))}h
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Describe what you want to see, and let AI bring it to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-5"
            >
              <Card className="glass-card p-5 space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Prompt
                </Label>
                <div className="relative">
                  <textarea
                    placeholder="A majestic dragon flying over a medieval castle..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
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
                    placeholder="Things to avoid..."
                    value={negativeText}
                    onChange={(e) => setNegativeText(e.target.value)}
                    className="text-sm"
                  />
                )}

                <Button
                  className="w-full gap-2 glow"
                  disabled={!prompt.trim() || isGenerating || (!isAdmin && remaining <= 0)}
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
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" /> Style
                </Label>
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
                <div className="space-y-8">
                  {isGenerating && results.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-studio-1 to-studio-3 flex items-center justify-center mx-auto mb-4 animate-pulse">
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        layout
                      >
                        <Card className="glass-card overflow-hidden group">
                          {/* Image */}
                          <div className="aspect-square relative overflow-hidden bg-secondary/20">
                            {result.url ? (
                              <img
                                src={result.url}
                                alt={result.prompt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                              </div>
                            )}

                            {/* Hover actions */}
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

                            {/* Resolution badge */}
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="text-[10px] bg-black/50 backdrop-blur-sm border-white/10 text-white/90">
                                1024×1024 · Stock Ready
                              </Badge>
                            </div>
                          </div>

                          {/* Metadata Panel */}
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate flex-1">{result.prompt}</p>
                              <Badge variant="secondary" className="text-[10px] ml-2 shrink-0">
                                {result.style}
                              </Badge>
                            </div>

                            {/* Auto-generated metadata */}
                            <div className="space-y-2.5 pt-2 border-t border-border/30">
                              {/* Description */}
                              <div className="flex items-start gap-2">
                                <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Auto Description</p>
                                  <p className="text-xs text-foreground/80 leading-relaxed">{result.metadata.description}</p>
                                  <button
                                    onClick={() => handleCopyField(result.metadata.description, `desc-${result.id}`)}
                                    className="text-[10px] text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                                  >
                                    {copiedField === `desc-${result.id}` ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                                    {copiedField === `desc-${result.id}` ? "Copied" : "Copy description"}
                                  </button>
                                </div>
                              </div>

                              {/* Categories */}
                              <div className="flex items-start gap-2">
                                <Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Categories</p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.metadata.categories.map((cat) => (
                                      <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0">
                                        {cat}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Stock platforms */}
                              <div className="flex items-start gap-2">
                                <Shield className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Stock Platforms</p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.metadata.stockCategories.map((cat) => (
                                      <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0 bg-green-500/5 text-green-500 border-green-500/20">
                                        {cat}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
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
