import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import AppHeader from "@/components/AppHeader";
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

    try {
      const styleLabel = stylePresets.find((s) => s.value === selectedStyle)?.label || "Custom";
      const seed = Math.floor(Math.random() * 100000);
      const styleKeywords: Record<string, string> = {
        photorealistic: "photorealistic, highly detailed, 8k",
        anime: "anime style, clear sharp lines, detailed character design, clean linework, vibrant colors, studio ghibli",
        "oil-painting": "oil painting style, masterpiece, detailed brushwork",
        "3d-render": "3d render, octane render, cinematic lighting, highly detailed, sharp focus",
        "pixel-art": "pixel art, retro game style, 16-bit",
        watercolor: "watercolor painting, soft colors, artistic",
      };
      const styleKeyword = styleKeywords[selectedStyle] || "";
      const fullPrompt = styleKeyword ? `${prompt}, ${styleKeyword}` : prompt;

      // Use Pollinations.ai for free AI image generation
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

      // Preload the image to ensure it's loaded before showing
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
      });

      const newResult = {
        id: Date.now(),
        prompt: prompt,
        style: styleLabel,
        url: imageUrl,
      };
      setResults((prev) => [newResult, ...prev]);
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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

  const handleRegenerate = async (result: typeof results[0]) => {
    const newSeed = Math.floor(Math.random() * 100000);
    const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.prompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${newSeed}`;
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
                            {result.url ? (
                              <img
                                src={result.url}
                                alt={result.prompt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                              </div>
                            )}
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
