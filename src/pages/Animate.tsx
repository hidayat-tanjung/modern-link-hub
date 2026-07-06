import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Loader2,
  Download,
  Film,
  Play,
  Pause,
  RotateCw,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Tag,
  Shield,
  Timer,
  Layers,
  ArrowRight,
  Palette,
  ImageIcon,
  Wand2,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { toast } from "sonner";

// ── Animation Types ──────────────────────────────────────────────

type AnimType = "bounce" | "rotate" | "pulse" | "float" | "wobble" | "morph" | "slide" | "fade";

const animStyles: { id: AnimType; label: string; icon: any; desc: string }[] = [
  { id: "bounce", label: "Bounce", icon: RotateCw, desc: "Bouncing up & down smoothly" },
  { id: "rotate", label: "Rotate", icon: RotateCw, desc: "360° spinning rotation" },
  { id: "pulse", label: "Pulse", icon: Sparkles, desc: "Scaling pulse effect" },
  { id: "float", label: "Float", icon: Film, desc: "Gentle floating motion" },
  { id: "wobble", label: "Wobble", icon: Wand2, desc: "Side-to-side wobble" },
  { id: "morph", label: "Morph", icon: Layers, desc: "Smooth shape morphing" },
  { id: "slide", label: "Slide", icon: ArrowRight, desc: "Sliding across frame" },
  { id: "fade", label: "Fade", icon: ImageIcon, desc: "Gentle fade in/out" },
];

// ── Color Palettes ───────────────────────────────────────────────

const colorPalettes = [
  { name: "Ocean Blue", colors: ["#0ea5e9", "#3b82f6", "#6366f1", "#06b6d4"] },
  { name: "Sunset", colors: ["#f43f5e", "#f97316", "#eab308", "#a855f7"] },
  { name: "Forest", colors: ["#10b981", "#22c55e", "#14b8a6", "#059669"] },
  { name: "Cyberpunk", colors: ["#f472b6", "#a855f7", "#6366f1", "#06b6d4"] },
  { name: "Neon", colors: ["#22d3ee", "#a855f7", "#34d399", "#fbbf24"] },
  { name: "Minimal", colors: ["#ffffff", "#94a3b8", "#64748b", "#334155"] },
];

// ── Canvas Sizes ─────────────────────────────────────────────────

const canvasSizes = [
  { label: "Icon (512×512)", value: 512, desc: "Perfect for app icons" },
  { label: "Square (1024×1024)", value: 1024, desc: "Standard for stock sites" },
  { label: "HD (1920×1080)", value: 1080, desc: "1080p video" },
];

// ── Metadata Generator ───────────────────────────────────────────

function generateStockMetadata(prompt: string, animType: string) {
  const p = prompt.toLowerCase();

  const categories: string[] = [];
  if (/icon|logo|symbol|emblem|mark|badge/i.test(p)) categories.push("Icons & Logos");
  if (/anima|motion|spinning|rotating|bouncing/i.test(p) || animType) categories.push("Motion Graphics");
  if (/abstract|pattern|geometric|shape|circle|square|triangle/i.test(p)) categories.push("Abstract");
  if (/anima|character|mascot|cute|fun/i.test(p)) categories.push("Characters & Mascots");
  if (/interface|ui|ux|app|button|control/i.test(p)) categories.push("UI & Interface");
  if (/business|finance|tech|data|chart|graph/i.test(p)) categories.push("Business & Technology");
  if (/nature|leaf|tree|flower|animal|bird/i.test(p)) categories.push("Nature & Animals");
  if (/food|drink|coffee|pizza|burger|sushi/i.test(p)) categories.push("Food & Drink");
  if (categories.length === 0) categories.push("Motion Graphics");

  const animName = animStyles.find((a) => a.id === animType)?.label || "Animated";
  const description = `Animated ${animName.toLowerCase()} icon: ${prompt}. Smooth looping motion graphic with transparent background. Perfect for digital interfaces, presentations, social media, and web design. High-quality MP4 format ready for commercial use on Shutterstock, Adobe Stock, and other stock platforms.`;

  const stockCategories = [
    "Motion Graphics > Icons",
    "Design > Graphic Design",
  ];
  if (categories.includes("Abstract")) stockCategories.push("Creative > Abstract");
  if (categories.includes("Business & Technology")) stockCategories.unshift("Business > Technology");
  if (categories.includes("Nature & Animals")) stockCategories.push("Nature > Animals");

  const tags = [
    "animated icon", "motion graphics", "loop", "animation",
    ...categories.map((c) => c.toLowerCase()),
    prompt.split(" ").filter((w) => w.length > 2).slice(0, 5),
  ].flat().filter(Boolean);

  return { categories, description, stockCategories: stockCategories.slice(0, 3), tags: [...new Set(tags)].slice(0, 15) };
}

// ── Frame Renderer ───────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface FrameState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

function computeFrame(animType: AnimType, progress: number): FrameState {
  const t = progress; // 0..1
  switch (animType) {
    case "bounce":
      return { x: 0, y: -Math.abs(Math.sin(t * Math.PI * 2)) * 60, scale: 1, rotation: 0, opacity: 1 };
    case "rotate":
      return { x: 0, y: 0, scale: 1, rotation: t * 360, opacity: 1 };
    case "pulse":
      return { x: 0, y: 0, scale: 1 + Math.sin(t * Math.PI * 2) * 0.15, rotation: 0, opacity: 1 };
    case "float":
      return { x: Math.sin(t * Math.PI * 2) * 30, y: Math.cos(t * Math.PI * 2) * 20, scale: 1, rotation: 0, opacity: 1 };
    case "wobble":
      return { x: 0, y: 0, scale: 1, rotation: Math.sin(t * Math.PI * 2) * 10, opacity: 1 };
    case "morph":
      const s = 1 + Math.sin(t * Math.PI * 2) * 0.2;
      return { x: 0, y: 0, scale: s, rotation: 0, opacity: 1 };
    case "slide":
      const slideX = lerp(200, -200, t);
      return { x: slideX, y: 0, scale: 1, rotation: 0, opacity: 1 - Math.abs(slideX) / 400 };
    case "fade":
      return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0.5 + Math.sin(t * Math.PI * 2) * 0.5 };
    default:
      return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 };
  }
}

// ── Shape Drawing ────────────────────────────────────────────────

type ShapeType = "circle" | "square" | "triangle" | "star" | "heart" | "diamond";

function drawShape(ctx: CanvasRenderingContext2D, shape: ShapeType, size: number) {
  const s = size / 2;
  ctx.beginPath();
  switch (shape) {
    case "circle":
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      break;
    case "square":
      ctx.rect(-s, -s, size, size);
      break;
    case "triangle":
      ctx.moveTo(0, -s);
      ctx.lineTo(-s, s);
      ctx.lineTo(s, s);
      ctx.closePath();
      break;
    case "star":
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(angle) * s;
        const py = Math.sin(angle) * s;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "heart":
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.3, -s, -s, 0, -s * 0.1);
      ctx.bezierCurveTo(s, -s, s, -s * 0.3, 0, s * 0.3);
      break;
    case "diamond":
      ctx.moveTo(0, -s);
      ctx.lineTo(s, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s, 0);
      ctx.closePath();
      break;
  }
}

// ── Main Component ───────────────────────────────────────────────

export default function Animate() {
  const [prompt, setPrompt] = useState("");
  const [selectedAnim, setSelectedAnim] = useState<AnimType>("bounce");
  const [selectedShape, setSelectedShape] = useState<ShapeType>("circle");
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
  const [canvasSize, setCanvasSize] = useState(512);
  const [duration, setDuration] = useState([2]);
  const [fps, setFps] = useState([30]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ReturnType<typeof generateStockMetadata> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // ── Render Frame ─────────────────────────────────────────────

  const renderFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Background (transparent for stock sites)
    ctx.clearRect(0, 0, size, size);

    // Grid (subtle)
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    const frame = computeFrame(selectedAnim, progress);
    const cx = size / 2 + frame.x;
    const cy = size / 2 + frame.y;
    const shapeSize = size * 0.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((frame.rotation * Math.PI) / 180);
    ctx.scale(frame.scale, frame.scale);
    ctx.globalAlpha = frame.opacity;

    // Draw gradient main shape
    const gradient = ctx.createLinearGradient(-shapeSize, -shapeSize, shapeSize, shapeSize);
    gradient.addColorStop(0, selectedPalette.colors[0]);
    gradient.addColorStop(0.5, selectedPalette.colors[1]);
    gradient.addColorStop(1, selectedPalette.colors[2]);
    ctx.fillStyle = gradient;

    drawShape(ctx, selectedShape, shapeSize * 2);
    ctx.fill();

    // Glow effect
    ctx.shadowColor = selectedPalette.colors[0];
    ctx.shadowBlur = shapeSize * 0.3;
    drawShape(ctx, selectedShape, shapeSize * 1.5);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Inner highlight
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    drawShape(ctx, selectedShape, shapeSize * 1.2);
    ctx.fill();

    // Text label
    if (prompt) {
      const words = prompt.split(" ").slice(0, 3).join(" ");
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `${shapeSize * 0.15}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(words, 0, shapeSize * 0.9);
    }

    ctx.restore();
  }, [selectedAnim, selectedShape, selectedPalette, prompt]);

  // ── Animation Loop ───────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return;
    const fpsVal = fps[0];
    const durationVal = duration[0];
    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const progress = (elapsed % durationVal) / durationVal;
      renderFrame(progress);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, renderFrame, fps, duration]);

  // Initial render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    if (!isPlaying) renderFrame(0);
  }, [canvasSize, renderFrame, isPlaying]);

  // ── Generate PNG Frame ───────────────────────────────────────

  const handleGenerateFrame = () => {
    renderFrame(0);
    const canvas = canvasRef.current;
    if (canvas) {
      setPreviewUrl(canvas.toDataURL("image/png"));
      const meta = generateStockMetadata(prompt || "animated icon", selectedAnim);
      setMetadata(meta);
      toast.success("Frame generated! Preview ready.");
    }
  };

  // ── Export Video (WebM via MediaRecorder) ────────────────────

  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    try {
      const fpsVal = fps[0];
      const durationVal = duration[0];
      const totalFrames = Math.ceil(fpsVal * durationVal);
      const stream = canvas.captureStream(fpsVal);
      const chunks: Blob[] = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsGenerating(false);

        const meta = generateStockMetadata(prompt || "animated icon", selectedAnim);
        setMetadata(meta);
        toast.success(`Animation exported! ${(blob.size / 1024).toFixed(1)} KB WebM`);
      };

      mediaRecorder.start();

      // Render all frames
      for (let i = 0; i < totalFrames; i++) {
        const progress = i / totalFrames;
        renderFrame(progress);
        await new Promise((r) => setTimeout(r, 1000 / fpsVal));
      }

      mediaRecorder.stop();
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export video. Try a different setting.");
      setIsGenerating(false);
    }
  };

  // ── Download ─────────────────────────────────────────────────

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.download = `pixelforge-animation-${selectedAnim}.webm`;
      a.href = videoUrl;
      a.click();
    } else if (previewUrl) {
      const a = document.createElement("a");
      a.download = `pixelforge-frame-${selectedAnim}.png`;
      a.href = previewUrl;
      a.click();
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Film className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-gradient">Animated</span> Icons
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Create stunning animated icons & motion graphics for Shutterstock, Adobe Stock, and more.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                <Shield className="w-3 h-3" /> Commercial Use
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
                <Film className="w-3 h-3" /> MP4 / WebM
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-purple-500/10 text-purple-500 border-purple-500/20">
                <Sparkles className="w-3 h-3" /> Auto Tags & Description
              </Badge>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-5"
            >
              {/* Prompt */}
              <Card className="glass-card p-5 space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Prompt
                </Label>
                <textarea
                  placeholder="Describe your animated icon... e.g., 'A glowing neon star, cyberpunk style'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                <Button
                  onClick={handleGenerateFrame}
                  disabled={!prompt.trim()}
                  className="w-full gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate Preview
                </Button>
              </Card>

              {/* Animation Style */}
              <Card className="glass-card p-5 space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Film className="w-4 h-4 text-primary" /> Animation Style
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {animStyles.map((anim) => {
                    const isSelected = selectedAnim === anim.id;
                    return (
                      <button
                        key={anim.id}
                        onClick={() => setSelectedAnim(anim.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg text-xs transition-all ${
                          isSelected
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                      >
                        <anim.icon className="w-3.5 h-3.5 shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">{anim.label}</div>
                          <div className="text-[10px] opacity-70">{anim.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Shape & Colors */}
              <Card className="glass-card p-5 space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" /> Shape & Colors
                </Label>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Shape</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(["circle", "square", "triangle", "star", "heart", "diamond"] as ShapeType[]).map((s) => (
                      <Badge
                        key={s}
                        variant={selectedShape === s ? "default" : "outline"}
                        className="cursor-pointer capitalize px-3 py-1.5"
                        onClick={() => setSelectedShape(s)}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Color Palette</p>
                  <div className="flex flex-wrap gap-2">
                    {colorPalettes.map((palette) => (
                      <button
                        key={palette.name}
                        onClick={() => setSelectedPalette(palette)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border ${
                          selectedPalette.name === palette.name
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:border-border/50"
                        }`}
                      >
                        <div className="flex">
                          {palette.colors.slice(0, 3).map((c, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full -ml-1 first:ml-0 border border-white/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Export Settings */}
              <Card className="glass-card p-5 space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" /> Export Settings
                </Label>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Canvas Size</label>
                  <Select value={String(canvasSize)} onValueChange={(v) => setCanvasSize(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {canvasSizes.map((s) => (
                        <SelectItem key={s.value} value={String(s.value)}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <Label>Duration</Label>
                    <span className="text-muted-foreground">{duration[0]}s</span>
                  </div>
                  <Slider value={duration} onValueChange={setDuration} min={1} max={10} step={0.5} />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <Label>Frame Rate</Label>
                    <span className="text-muted-foreground">{fps[0]} FPS</span>
                  </div>
                  <Slider value={fps} onValueChange={setFps} min={12} max={60} step={1} />
                </div>
              </Card>

              {/* Export Button */}
              <Button
                onClick={handleExportVideo}
                disabled={isGenerating || !prompt.trim()}
                className="w-full gap-2 h-12 text-base glow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Rendering animation...
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    Export Animation (WebM)
                  </>
                )}
              </Button>
            </motion.div>

            {/* Right Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Canvas Preview */}
              <Card className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">Preview</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px]">
                      {canvasSize}×{canvasSize}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {selectedAnim}
                    </Badge>
                  </div>
                </div>
                <div className="bg-[#0a0a1a] flex items-center justify-center p-6 relative min-h-[350px]">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ width: Math.min(canvasSize, 400), height: Math.min(canvasSize, 400) }}>
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full"
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="w-12 h-12 rounded-full opacity-80 hover:opacity-100"
                          onClick={() => setIsPlaying(true)}
                        >
                          <Play className="w-5 h-5 ml-0.5" />
                        </Button>
                      </div>
                    )}
                    {isPlaying && (
                      <div className="absolute bottom-2 right-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="w-8 h-8 rounded-full opacity-60 hover:opacity-100"
                          onClick={() => setIsPlaying(false)}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Video & Download */}
              {videoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card overflow-hidden border-green-500/30">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Animation Ready
                      </span>
                      <Button onClick={handleDownload} className="gap-2" size="sm">
                        <Download className="w-4 h-4" /> Download .webm
                      </Button>
                    </div>
                    <div className="bg-[#0a0a1a] flex items-center justify-center p-4">
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="rounded-xl shadow-lg max-h-[300px]"
                        style={{ width: Math.min(canvasSize, 400) }}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Stock Metadata */}
              {metadata && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold">Stock Platform Metadata</h3>
                      <Badge variant="outline" className="text-[10px] ml-auto">
                        Ready for Shutterstock & Adobe Stock
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {/* Description */}
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Description
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed">{metadata.description}</p>
                        <button
                          onClick={() => handleCopy(metadata.description, "desc")}
                          className="text-[10px] text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                        >
                          {copiedField === "desc" ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === "desc" ? "Copied" : "Copy description"}
                        </button>
                      </div>

                      {/* Categories */}
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Categories
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {metadata.categories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stock Categories */}
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Stock Platform Categories
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {metadata.stockCategories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0 bg-green-500/5 text-green-500 border-green-500/20">
                              <Shield className="w-2 h-2 mr-1" />
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" /> Tags
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {metadata.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <button
                          onClick={() => handleCopy(metadata.tags.join(", "), "tags")}
                          className="text-[10px] text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                        >
                          {copiedField === "tags" ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === "tags" ? "Copied" : "Copy all tags"}
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Empty state */}
              {!previewUrl && !videoUrl && (
                <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-border/50">
                  <Film className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                    Create your first animation
                  </h3>
                  <p className="text-sm text-muted-foreground/60 text-center max-w-sm">
                    Enter a prompt, choose a style, and generate a stunning animated icon ready for Shutterstock or Adobe Stock.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
