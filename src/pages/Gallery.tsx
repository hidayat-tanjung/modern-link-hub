import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AppHeader from "@/components/AppHeader";
import {
  Sparkles,
  Film,
  ImageIcon,
  Download,
  Trash2,
  Search,
  Grid3x3,
  LayoutGrid,
  Clock,
  Star,
  Loader2,
  Eye,
  Play,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router";

// ── Local Gallery Storage ───────────────────────────────────────

interface GalleryItem {
  id: string;
  type: "image" | "animation";
  prompt: string;
  style?: string;
  url: string;
  previewUrl?: string;
  thumbnail?: string;
  timestamp: number;
  metadata?: {
    categories: string[];
    description: string;
    stockCategories: string[];
    tags?: string[];
  };
}

const GALLERY_KEY = "pixelforge_gallery";

function loadGallery(): GalleryItem[] {
  try {
    const stored = localStorage.getItem(GALLERY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveGallery(items: GalleryItem[]) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
}

// Expose a helper so Generate & Animate pages can save to gallery
export function addToGallery(item: Omit<GalleryItem, "id" | "timestamp">) {
  const gallery = loadGallery();
  gallery.unshift({ ...item, id: crypto.randomUUID(), timestamp: Date.now() });
  saveGallery(gallery);
}

// ── Component ───────────────────────────────────────────────────

const typeIcons: Record<string, any> = {
  image: ImageIcon,
  animation: Film,
};

const typeColors: Record<string, string> = {
  image: "from-studio-1 to-studio-2",
  animation: "from-violet-500 to-purple-500",
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "animation">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortNewest, setSortNewest] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setItems(loadGallery());
  }, []);

  const filtered = items
    .filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
      if (search && !item.prompt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => sortNewest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveGallery(updated);
    if (selectedItem?.id === id) setPreviewOpen(false);
  };

  const handleClearAll = () => {
    if (confirm("Clear all gallery items?")) {
      setItems([]);
      saveGallery([]);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-gradient">Gallery</span>
              </h1>
              {items.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {items.length} items
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              Your creations — images & animations saved locally.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
          >
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all" className="text-xs gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" /> All
                </TabsTrigger>
                <TabsTrigger value="image" className="text-xs gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Images
                </TabsTrigger>
                <TabsTrigger value="animation" className="text-xs gap-1.5">
                  <Film className="w-3.5 h-3.5" /> Animations
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-full sm:w-48"
                />
              </div>

              {/* Sort toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setSortNewest(!sortNewest)}
                title={sortNewest ? "Newest first" : "Oldest first"}
              >
                <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${sortNewest ? "" : "rotate-180"}`} />
              </Button>

              {/* View toggle */}
              <div className="flex gap-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </Button>
              </div>

              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-red-500 hover:text-red-500 hover:bg-red-500/10"
                  onClick={handleClearAll}
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </motion.div>

          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 rounded-xl border-2 border-dashed border-border/50">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <LayoutGrid className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                Your gallery is empty
              </h3>
              <p className="text-sm text-muted-foreground/60 text-center max-w-sm mb-6">
                Images and animations you create will appear here. Start creating!
              </p>
              <div className="flex gap-3">
                <Link to="/generate">
                  <Button variant="default" className="gap-2">
                    <Sparkles className="w-4 h-4" /> Generate Images
                  </Button>
                </Link>
                <Link to="/animate">
                  <Button variant="outline" className="gap-2">
                    <Film className="w-4 h-4" /> Create Animations
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Filtered empty */}
          {items.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Search className="w-10 h-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No matching items</p>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence>
                {filtered.map((item, i) => {
                  const TypeIcon = typeIcons[item.type];
                  const gradient = typeColors[item.type];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.02 }}
                      layout
                    >
                      <Card
                        className="glass-card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all duration-300"
                        onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-studio-1/5 to-studio-4/5">
                          {item.type === "animation" && item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.prompt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <img
                              src={item.previewUrl || item.url}
                              alt={item.prompt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                          {/* Type badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className={`text-[10px] px-1.5 py-0.5 bg-gradient-to-br ${gradient} text-white border-0`}>
                              <TypeIcon className="w-2.5 h-2.5 mr-1" />
                              {item.type === "animation" ? "MP4" : "PNG"}
                            </Badge>
                          </div>

                          {/* Overlay actions */}
                          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8"
                              onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setPreviewOpen(true); }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item.previewUrl || item.url, `pixelforge-${item.prompt.slice(0, 20)}.${item.type === "animation" ? "webm" : "png"}`);
                              }}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8 text-red-500 hover:text-red-500 hover:bg-red-500/20"
                              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          {/* Play button for animations */}
                          {item.type === "animation" && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Play className="w-5 h-5 text-white ml-0.5" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <p className="text-xs font-medium truncate">{item.prompt}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && filtered.length > 0 && (
            <Card className="glass-card divide-y divide-border/50">
              {filtered.map((item, i) => {
                const TypeIcon = typeIcons[item.type];
                const gradient = typeColors[item.type];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 p-3 hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-studio-1/10 to-studio-4/10 shrink-0">
                      <img
                        src={item.previewUrl || item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.prompt}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className={`text-[10px] px-1.5 py-0 bg-gradient-to-br ${gradient} text-white border-0`}>
                          <TypeIcon className="w-2.5 h-2.5 mr-0.5" />
                          {item.type === "animation" ? "Animation" : "Image"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDate(item.timestamp)}</span>
                        {item.metadata?.categories && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            {item.metadata.categories.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={(e) => { e.stopPropagation(); handleDownload(item.previewUrl || item.url, `pixelforge-${item.prompt.slice(0, 20)}.${item.type === "animation" ? "webm" : "png"}`); }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-red-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </Card>
          )}

          {/* Pagination info */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground">
              <span>
                Showing {filtered.length} of {items.length} items
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" />
                <span>Saved locally</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && (
                <>
                  <Badge className={`bg-gradient-to-br ${typeColors[selectedItem.type]} text-white border-0 text-[10px]`}>
                    {selectedItem.type === "animation" ? "Animation" : "Image"}
                  </Badge>
                  <span className="text-sm font-medium truncate">{selectedItem.prompt}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="rounded-xl overflow-hidden bg-[#0a0a1a] flex items-center justify-center max-h-[60vh]">
                {selectedItem.type === "animation" && selectedItem.url ? (
                  <video
                    src={selectedItem.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                ) : (
                  <img
                    src={selectedItem.previewUrl || selectedItem.url}
                    alt={selectedItem.prompt}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDownload(selectedItem.previewUrl || selectedItem.url, `pixelforge-${selectedItem.prompt.slice(0, 30)}.${selectedItem.type === "animation" ? "webm" : "png"}`)}
                  className="gap-2"
                  size="sm"
                >
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDelete(selectedItem.id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatDate(selectedItem.timestamp)}
                </span>
              </div>

              {/* Metadata */}
              {selectedItem.metadata && (
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Stock Metadata
                  </p>
                  <p className="text-xs text-foreground/80 line-clamp-2">
                    {selectedItem.metadata.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.metadata.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  {selectedItem.metadata.tags && (
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.metadata.tags.slice(0, 8).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
