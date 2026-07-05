import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import {
  Cuboid,
  Sparkles,
  Star,
  Download,
  Heart,
  Search,
  Filter,
  Grid3x3,
  LayoutGrid,
  Loader2,
  Unlock,
  Zap,
  Shield,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  "All",
  "Photorealistic",
  "Anime",
  "Illustration",
  "3D Art",
  "Pixel Art",
  "Concept Art",
  "Portrait",
  "Landscape",
];

const models = [
  {
    name: "Flux Pro",
    creator: "Black Forest Labs",
    category: "Photorealistic",
    rating: 4.9,
    downloads: "850K",
    tags: ["Fast", "High Quality", "Popular"],
    description: "State-of-the-art photorealistic image generation with incredible detail and accuracy.",
  },
  {
    name: "Stable Diffusion XL",
    creator: "Stability AI",
    category: "Illustration",
    rating: 4.8,
    downloads: "2.1M",
    tags: ["Versatile", "Community", "Open Source"],
    description: "The most popular open-source model for creative and artistic image generation.",
  },
  {
    name: "Anime V4",
    creator: "Anime Team",
    category: "Anime",
    rating: 4.7,
    downloads: "1.3M",
    tags: ["Anime", "Manga", "Characters"],
    description: "Specialized for high-quality anime character art with crisp line work and vibrant colors.",
  },
  {
    name: "Realistic Vision",
    creator: "RV Team",
    category: "Photorealistic",
    rating: 4.8,
    downloads: "980K",
    tags: ["Realistic", "Portraits", "Photography"],
    description: "Ultra-realistic human portraits and photography-style image generation.",
  },
  {
    name: "DreamShaper",
    creator: "DreamStudio",
    category: "Illustration",
    rating: 4.6,
    downloads: "750K",
    tags: ["Artistic", "Creative", "Fantasy"],
    description: "Perfect for fantasy art, dreamy landscapes, and creative illustrations.",
  },
  {
    name: "3D Render Pro",
    creator: "3D Team",
    category: "3D Art",
    rating: 4.5,
    downloads: "420K",
    tags: ["3D", "Render", "Realistic"],
    description: "Professional 3D rendered images with octane render quality and cinematic lighting.",
  },
  {
    name: "Pixel Art Generator",
    creator: "Pixel Team",
    category: "Pixel Art",
    rating: 4.4,
    downloads: "310K",
    tags: ["Pixel", "Retro", "Game"],
    description: "Classic pixel art style for retro game assets and nostalgic designs.",
  },
  {
    name: "Midjourney Style",
    creator: "Style Team",
    category: "Concept Art",
    rating: 4.9,
    downloads: "1.1M",
    tags: ["Artistic", "Dreamy", "Cinematic"],
    description: "Cinematic concept art with dramatic lighting and epic compositions.",
  },
  {
    name: "Portrait Master",
    creator: "Face Team",
    category: "Portrait",
    rating: 4.7,
    downloads: "560K",
    tags: ["Portraits", "Faces", "Realistic"],
    description: "Master-level portrait generation with perfect facial features and expressions.",
  },
  {
    name: "Landscape Pro",
    creator: "Nature Team",
    category: "Landscape",
    rating: 4.6,
    downloads: "490K",
    tags: ["Nature", "Scenery", "Epic"],
    description: "Breathtaking nature landscapes with stunning natural lighting and atmosphere.",
  },
  {
    name: "Anime XL",
    creator: "Anime Studio",
    category: "Anime",
    rating: 4.8,
    downloads: "890K",
    tags: ["Anime", "HD", "Characters"],
    description: "High-definition anime characters with detailed art style and expressive features.",
  },
  {
    name: "Cyberpunk City",
    creator: "Cyber Team",
    category: "Concept Art",
    rating: 4.5,
    downloads: "340K",
    tags: ["Cyberpunk", "Sci-Fi", "Urban"],
    description: "Neon-lit cyberpunk cityscapes with futuristic technology and atmosphere.",
  },
];

export default function Models() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedModel, setSelectedModel] = useState<typeof models[0] | null>(null);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const filteredModels = models.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.creator.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerate = async () => {
    if (!generatePrompt.trim() || !selectedModel) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const seed = Math.floor(Math.random() * 100000);
      const styleKeywords: Record<string, string> = {
        "Photorealistic": "photorealistic, highly detailed, 8k",
        "Anime": "anime style, detailed anime art, studio ghibli",
        "Illustration": "digital illustration, detailed art",
        "3D Art": "3d render, octane render, cinematic lighting",
        "Pixel Art": "pixel art, retro game style, 16-bit",
        "Concept Art": "cinematic concept art, epic composition",
        "Portrait": "portrait photography, detailed face",
        "Landscape": "landscape photography, stunning scenery",
      };
      const styleKeyword = styleKeywords[selectedModel.category] || "";
      const fullPrompt = styleKeyword ? `${generatePrompt}, ${styleKeyword}` : generatePrompt;

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
      });

      setGeneratedImage(imageUrl);
      toast.success("Image generated successfully!");
    } catch {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
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
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              AI <span className="text-gradient">Models</span>
            </h1>
            <p className="text-muted-foreground">
              Browse and use cutting-edge AI models for image generation. All models are free, unlimited, and ready for commercial use.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="gap-1">
                <Unlock className="w-3 h-3 text-green-500" /> All Free
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Zap className="w-3 h-3 text-amber-500" /> Unlimited
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Shield className="w-3 h-3 text-blue-500" /> Commercial Use OK
              </Badge>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Categories */}
              <Card className="glass-card p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Stats */}
              <Card className="glass-card p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> All Models
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Models</span>
                    <span className="font-semibold">{models.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Free Access</span>
                    <span className="font-semibold text-green-500">{models.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Limits</span>
                    <span className="font-semibold text-green-500">None</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Model Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {/* View toggle */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredModels.length}</span> models — <span className="text-green-500 font-medium">All Free & Unlimited</span>
                </p>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setViewMode("list")}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredModels.map((model, i) => (
                      <motion.div
                        key={model.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03 }}
                        layout
                      >
                        <Card
                          className={`glass-card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all duration-300 ${
                            selectedModel?.name === model.name ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => { setSelectedModel(model); setGeneratedImage(null); }}
                        >
                          {/* Model preview */}
                          <div className="aspect-[4/3] bg-gradient-to-br from-studio-1/10 to-studio-4/10 flex items-center justify-center relative">
                            <div className="text-center">
                              <Cuboid className="w-10 h-10 text-primary/30 mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">{model.category}</p>
                            </div>
                            <Badge
                              variant="secondary"
                              className="absolute top-2 right-2 text-[10px] bg-green-500/10 text-green-500 border-green-500/30"
                            >
                              <Unlock className="w-2.5 h-2.5 mr-1" /> Free
                            </Badge>
                            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button variant="secondary" size="icon" className="w-9 h-9">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button variant="default" size="sm" className="gap-1 text-xs">
                                <Sparkles className="w-3 h-3" /> Use Model
                              </Button>
                            </div>
                          </div>
                          {/* Info */}
                          <div className="p-4">
                            <h3 className="font-semibold text-sm truncate">{model.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{model.creator}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500" /> {model.rating}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" /> {model.downloads}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {model.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredModels.map((model, i) => (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Card
                        className={`glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all ${
                          selectedModel?.name === model.name ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => { setSelectedModel(model); setGeneratedImage(null); }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-studio-1/20 to-studio-4/20 flex items-center justify-center shrink-0">
                          <Cuboid className="w-6 h-6 text-primary/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{model.name}</h3>
                            <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-500">
                              Free
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{model.creator} · {model.category}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{model.rating}</span>
                            <span className="flex items-center gap-1"><Download className="w-3 h-3" />{model.downloads}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs gap-1 shrink-0">
                          <Sparkles className="w-3 h-3" /> Use
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredModels.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">No models found</p>
                  <p className="text-sm text-muted-foreground/60">Try a different search or category</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Selected Model Generate Panel */}
          <AnimatePresence>
            {selectedModel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8"
              >
                <Card className="glass-card p-6 border-primary/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold">{selectedModel.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        by {selectedModel.creator} · {selectedModel.category} · ★ {selectedModel.rating}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedModel.description}</p>
                    </div>
                    <div className="flex gap-2 sm:ml-auto">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 gap-1">
                        <Check className="w-3 h-3" /> Free & Unlimited
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => { setSelectedModel(null); setGeneratedImage(null); }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your prompt for this model..."
                        value={generatePrompt}
                        onChange={(e) => setGeneratePrompt(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={!generatePrompt.trim() || isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Generate</>
                      )}
                    </Button>
                  </div>

                  {/* Generated Image Display */}
                  {generatedImage && (
                    <div className="mt-6">
                      <p className="text-sm font-medium mb-3">Generated Image:</p>
                      <div className="relative rounded-xl overflow-hidden">
                        <img
                          src={generatedImage}
                          alt={generatePrompt}
                          className="w-full max-h-[500px] object-contain bg-black/10 rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        1024x1024 · Commercial use OK · Suitable for Shutterstock & Adobe Stock
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
