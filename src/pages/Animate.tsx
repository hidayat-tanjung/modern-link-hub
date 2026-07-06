import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  Star,
  Zap,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { toast } from "sonner";
import { addToGallery } from "./Gallery";

// ── Animation Types ──────────────────────────────────────────────

type AnimType = "bounce" | "rotate" | "pulse" | "float" | "wobble" | "morph" | "slide" | "fade" | "orbit" | "wave" | "spiral" | "explode";

const animStyles: { id: AnimType; label: string; icon: any; desc: string }[] = [
  { id: "bounce", label: "Bounce", icon: RotateCw, desc: "Bouncing up & down" },
  { id: "rotate", label: "Rotate", icon: RotateCw, desc: "360° spinning" },
  { id: "pulse", label: "Pulse", icon: Sparkles, desc: "Pulsing scale effect" },
  { id: "float", label: "Float", icon: Film, desc: "Gentle floating motion" },
  { id: "wobble", label: "Wobble", icon: Wand2, desc: "Side-to-side wobble" },
  { id: "morph", label: "Morph", icon: Layers, desc: "Smooth shape morphing" },
  { id: "slide", label: "Slide", icon: ArrowRight, desc: "Sliding across frame" },
  { id: "fade", label: "Fade", icon: ImageIcon, desc: "Gentle fade in/out" },
  { id: "orbit", label: "Orbit", icon: Star, desc: "Orbital rotation" },
  { id: "wave", label: "Wave", icon: Zap, desc: "Undulating wave motion" },
  { id: "spiral", label: "Spiral", icon: Layers, desc: "Spiral path motion" },
  { id: "explode", label: "Explode", icon: Sparkles, desc: "Exploding particles" },
];

// ── Color Palettes ───────────────────────────────────────────────

const colorPalettes = [
  { name: "Ocean Blue", colors: ["#0ea5e9", "#3b82f6", "#6366f1", "#06b6d4", "#38bdf8"] },
  { name: "Sunset", colors: ["#f43f5e", "#f97316", "#eab308", "#a855f7", "#fb923c"] },
  { name: "Forest", colors: ["#10b981", "#22c55e", "#14b8a6", "#059669", "#34d399"] },
  { name: "Cyberpunk", colors: ["#f472b6", "#a855f7", "#6366f1", "#06b6d4", "#c084fc"] },
  { name: "Neon", colors: ["#22d3ee", "#a855f7", "#34d399", "#fbbf24", "#f472b6"] },
  { name: "Minimal", colors: ["#ffffff", "#94a3b8", "#64748b", "#334155", "#cbd5e1"] },
  { name: "Fire", colors: ["#ef4444", "#f97316", "#eab308", "#dc2626", "#fb923c"] },
  { name: "Galaxy", colors: ["#6366f1", "#a855f7", "#ec4899", "#8b5cf6", "#d946ef"] },
];

// ── Canvas Sizes ─────────────────────────────────────────────────

const canvasSizes = [
  { label: "Icon (512×512)", value: 512, desc: "Perfect for app icons" },
  { label: "Square (1024×1024)", value: 1024, desc: "Standard for stock sites" },
  { label: "HD (1920×1080)", value: 1080, desc: "1080p video" },
];

// ── Render Quality ───────────────────────────────────────────────

const qualityOptions = [
  { label: "Normal", value: 1, desc: "1x - standard" },
  { label: "High", value: 2, desc: "2x - crisp" },
  { label: "Ultra", value: 3, desc: "3x - max detail" },
];

// ── Effects ──────────────────────────────────────────────────────

type EffectType = "none" | "particles" | "trail" | "glow" | "sparkle" | "rainbow";

const effects: { id: EffectType; label: string; desc: string }[] = [
  { id: "none", label: "None", desc: "No effects" },
  { id: "particles", label: "Particles", desc: "Floating particle system" },
  { id: "trail", label: "Motion Trail", desc: "Trailing afterimage effect" },
  { id: "glow", label: "Glow", desc: "Radiant glow effect" },
  { id: "sparkle", label: "Sparkle", desc: "Sparkling stars around shape" },
  { id: "rainbow", label: "Rainbow", desc: "Rainbow color cycling" },
];

// ── Metadata Generator ───────────────────────────────────────────

function generateStockMetadata(prompt: string, animType: string, effect: string) {
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
  if (/space|star|planet|galaxy|nebula|cosmic/i.test(p)) categories.push("Space & Astronomy");
  if (/particle|sparkle|trail|glow|rainbow|effect/i.test(p) || effect !== "none") categories.push("Special Effects");
  if (categories.length === 0) categories.push("Motion Graphics");

  const animName = animStyles.find((a) => a.id === animType)?.label || "Animated";
  const effectName = effects.find((e) => e.id === effect)?.label.toLowerCase() || "";
  const effectDesc = effect !== "none" ? ` with ${effectName} effects` : "";
  const description = `Animated ${animName.toLowerCase()} icon${effectDesc}: ${prompt}. Smooth looping motion graphic with transparent background. Perfect for digital interfaces, presentations, social media, and web design. High-quality MP4 format ready for commercial use on Shutterstock, Adobe Stock, and other stock platforms.`;

  const stockCategories = [
    "Motion Graphics > Icons",
    "Design > Graphic Design",
  ];
  if (categories.includes("Abstract")) stockCategories.push("Creative > Abstract");
  if (categories.includes("Business & Technology")) stockCategories.unshift("Business > Technology");
  if (categories.includes("Nature & Animals")) stockCategories.push("Nature > Animals");
  if (categories.includes("Space & Astronomy")) stockCategories.push("Science > Space");
  if (categories.includes("Special Effects")) stockCategories.push("Creative > Special Effects");

  const tags = [
    "animated icon", "motion graphics", "loop", "animation",
    effect !== "none" ? effectName : "",
    ...categories.map((c) => c.toLowerCase()),
    ...prompt.split(" ").filter((w) => w.length > 2).slice(0, 5),
  ].flat().filter(Boolean);

  return { categories, description, stockCategories: stockCategories.slice(0, 3), tags: [...new Set(tags)].slice(0, 18) };
}

// ── Frame & Particle Systems ─────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface FrameState {
  x: number; y: number; scale: number; rotation: number; opacity: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number;
  color: string; life: number; maxLife: number; alpha: number;
}

function computeFrame(animType: AnimType, progress: number): FrameState {
  const t = progress;
  switch (animType) {
    case "bounce":
      return { x: 0, y: -Math.abs(Math.sin(t * Math.PI * 2)) * 80, scale: 1, rotation: 0, opacity: 1 };
    case "rotate":
      return { x: 0, y: 0, scale: 1, rotation: t * 360, opacity: 1 };
    case "pulse":
      return { x: 0, y: 0, scale: 1 + Math.sin(t * Math.PI * 2) * 0.2, rotation: 0, opacity: 1 };
    case "float":
      return { x: Math.sin(t * Math.PI * 2) * 40, y: Math.cos(t * Math.PI * 2) * 25, scale: 1, rotation: 0, opacity: 1 };
    case "wobble":
      return { x: 0, y: 0, scale: 1, rotation: Math.sin(t * Math.PI * 2) * 15, opacity: 1 };
    case "morph":
      const s = 1 + Math.sin(t * Math.PI * 2) * 0.25;
      return { x: 0, y: 0, scale: s, rotation: 0, opacity: 1 };
    case "slide":
      const slideX = lerp(250, -250, t);
      return { x: slideX, y: 0, scale: 1, rotation: 0, opacity: 1 - Math.abs(slideX) / 500 };
    case "fade":
      return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0.3 + Math.sin(t * Math.PI * 2) * 0.7 };
    case "orbit":
      const orbitR = 120;
      return { x: Math.cos(t * Math.PI * 2) * orbitR, y: Math.sin(t * Math.PI * 2) * orbitR, scale: 1, rotation: t * 360, opacity: 1 };
    case "wave":
      return { x: 0, y: Math.sin(t * Math.PI * 4) * 60, scale: 1 + Math.sin(t * Math.PI * 3) * 0.1, rotation: Math.sin(t * Math.PI * 2) * 8, opacity: 1 };
    case "spiral":
      const angle = t * Math.PI * 4;
      const radius = lerp(0, 180, t);
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, scale: 1, rotation: angle * 20, opacity: 1 };
    case "explode":
      const ep = Math.sin(t * Math.PI);
      return { x: 0, y: 0, scale: 1 + ep * 0.5, rotation: t * 180, opacity: 1 - ep * 0.3 };
    default:
      return { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 };
  }
}

// ── Shape Drawing ────────────────────────────────────────────────

type ShapeType = "circle" | "square" | "triangle" | "star" | "heart" | "diamond" | "hexagon" | "ring";

function drawShape(ctx: CanvasRenderingContext2D, shape: ShapeType, size: number) {
  const s = size / 2;
  ctx.beginPath();
  switch (shape) {
    case "circle":
      ctx.arc(0, 0, s, 0, Math.PI * 2); break;
    case "square":
      ctx.rect(-s, -s, size, size); break;
    case "triangle":
      ctx.moveTo(0, -s); ctx.lineTo(-s, s); ctx.lineTo(s, s); ctx.closePath(); break;
    case "star":
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? s : s * 0.4;
        i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r) : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath(); break;
    case "heart":
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.3, -s, -s, 0, -s * 0.1);
      ctx.bezierCurveTo(s, -s, s, -s * 0.3, 0, s * 0.3); break;
    case "diamond":
      ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0); ctx.closePath(); break;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 2;
        i === 0 ? ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s) : ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      }
      ctx.closePath(); break;
    case "ring":
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.moveTo(s * 0.6, 0);
      ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2, true);
      ctx.closePath(); break;
  }
}

// ── Particle System ──────────────────────────────────────────────

function createParticles(count: number, colors: string[], size: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    particles.push({
      x: (Math.random() - 0.5) * size * 0.8,
      y: (Math.random() - 0.5) * size * 0.8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random(),
      maxLife: 0.5 + Math.random() * 1.5,
      alpha: 0.5 + Math.random() * 0.5,
    });
  }
  return particles;
}

// ── Trail Buffer ─────────────────────────────────────────────────

let trailBuffer: { x: number; y: number }[] = [];
const TRAIL_LENGTH = 12;

// ── Main Component ───────────────────────────────────────────────

export default function Animate() {
  const [prompt, setPrompt] = useState("");
  const [selectedAnim, setSelectedAnim] = useState<AnimType>("bounce");
  const [selectedShape, setSelectedShape] = useState<ShapeType>("circle");
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
  const [canvasSize, setCanvasSize] = useState(512);
  const [duration, setDuration] = useState([2.5]);
  const [fps, setFps] = useState([30]);
  const [renderScale, setRenderScale] = useState(2);
  const [selectedEffect, setSelectedEffect] = useState<EffectType>("particles");
  const [multiLayer, setMultiLayer] = useState(false);
  const [particleCount, setParticleCount] = useState([30]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ReturnType<typeof generateStockMetadata> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const progressRef = useRef(0);

  // ── Render Frame ─────────────────────────────────────────────

  const renderFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = renderScale;
    const size = canvasSize;
    const physicalSize = canvas.width;
    progressRef.current = progress;

    // Reset transform and clear at physical resolution
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, physicalSize, physicalSize);

    // Scale for HiDPI / high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }

    const frame = computeFrame(selectedAnim, progress);
    const cx = size / 2 + frame.x;
    const cy = size / 2 + frame.y;
    const baseShapeSize = size * 0.3;

    // Track position for trail
    trailRef.current.push({ x: cx, y: cy });
    if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.shift();

    // ── TRAIL EFFECT ──
    if (selectedEffect === "trail" && trailRef.current.length > 2) {
      for (let i = 0; i < trailRef.current.length - 1; i++) {
        const t = i / trailRef.current.length;
        const trailAlpha = t * 0.3;
        const trailScale = t * 0.6;
        ctx.save();
        ctx.globalAlpha = trailAlpha;
        ctx.translate(trailRef.current[i].x, trailRef.current[i].y);
        ctx.scale(trailScale, trailScale);
        const trailGrad = ctx.createLinearGradient(-baseShapeSize, -baseShapeSize, baseShapeSize, baseShapeSize);
        trailGrad.addColorStop(0, selectedPalette.colors[0]);
        trailGrad.addColorStop(1, selectedPalette.colors[2]);
        ctx.fillStyle = trailGrad;
        drawShape(ctx, selectedShape, baseShapeSize * 1.5);
        ctx.fill();
        ctx.restore();
      }
    }

    // ── PARTICLE EFFECT ──
    if (selectedEffect === "particles") {
      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles(particleCount[0], selectedPalette.colors, size);
      }
      const dt = 0.016;
      for (const p of particlesRef.current) {
        p.x += p.vx * dt * 30;
        p.y += p.vy * dt * 30;
        p.life += dt;
        const pulse = Math.sin(p.life * 2 + p.x * 0.01) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = p.alpha * pulse * frame.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x + size / 2, p.y + size / 2, p.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Wrap around
        if (Math.abs(p.x) > size * 0.6) p.vx *= -1;
        if (Math.abs(p.y) > size * 0.6) p.vy *= -1;
      }
    }

    // ── SPARKLE EFFECT ──
    if (selectedEffect === "sparkle") {
      const sparkleCount = 12;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (i / sparkleCount) * Math.PI * 2 + progress * Math.PI * 0.5;
        const dist = baseShapeSize * 1.4 + Math.sin(progress * Math.PI * 2 + i) * 20;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        const sparkleSize = 3 + Math.sin(progress * Math.PI * 4 + i * 2) * 2;
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(progress * Math.PI * 4 + i) * 0.3;
        ctx.fillStyle = selectedPalette.colors[i % selectedPalette.colors.length];
        ctx.beginPath();
        ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ── GLOW EFFECT ──
    if (selectedEffect === "glow") {
      ctx.save();
      ctx.shadowColor = selectedPalette.colors[0];
      ctx.shadowBlur = baseShapeSize * 0.8;
      ctx.fillStyle = "transparent";
      drawShape(ctx, selectedShape, baseShapeSize * 0.5);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ── RAINBOW EFFECT ──
    const hueShift = selectedEffect === "rainbow" ? (progress * 360) : 0;

    // ── MAIN SHAPE ──
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((frame.rotation * Math.PI) / 180);
    ctx.scale(frame.scale, frame.scale);
    ctx.globalAlpha = frame.opacity;

    // Gradient with optional hue shift
    const grad = ctx.createLinearGradient(-baseShapeSize, -baseShapeSize, baseShapeSize, baseShapeSize);
    if (selectedEffect === "rainbow") {
      grad.addColorStop(0, `hsl(${hueShift}, 100%, 60%)`);
      grad.addColorStop(0.5, `hsl(${(hueShift + 120) % 360}, 100%, 60%)`);
      grad.addColorStop(1, `hsl(${(hueShift + 240) % 360}, 100%, 60%)`);
    } else {
      grad.addColorStop(0, selectedPalette.colors[0]);
      grad.addColorStop(0.5, selectedPalette.colors[1]);
      grad.addColorStop(1, selectedPalette.colors[2]);
    }
    ctx.fillStyle = grad;

    drawShape(ctx, selectedShape, baseShapeSize * 2);
    ctx.fill();

    // Glow layer
    if (selectedEffect !== "glow") {
      ctx.shadowColor = selectedPalette.colors[0];
      ctx.shadowBlur = baseShapeSize * 0.3;
    }
    drawShape(ctx, selectedShape, baseShapeSize * 1.5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner highlight
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    drawShape(ctx, selectedShape, baseShapeSize * 1.2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // ── MULTI-LAYER ORBITING SHAPES ──
    if (multiLayer) {
      const layerCount = 3;
      for (let l = 0; l < layerCount; l++) {
        const lOffset = (l + 1) * 0.33;
        const lProgress = (progress + lOffset) % 1;
        const lFrame = computeFrame(selectedAnim, lProgress);
        const lAngle = lProgress * Math.PI * 2 + (l * Math.PI * 2) / layerCount;
        const lRadius = baseShapeSize * 1.5 + l * 30;
        const lx = size / 2 + Math.cos(lAngle) * lRadius;
        const ly = size / 2 + Math.sin(lAngle) * lRadius;
        const lSize = baseShapeSize * (0.3 + l * 0.1);

        ctx.save();
        ctx.globalAlpha = 0.4 + lFrame.opacity * 0.2;
        ctx.translate(lx, ly);
        ctx.rotate((lFrame.rotation * Math.PI) / 180);
        ctx.scale(lFrame.scale * 0.7, lFrame.scale * 0.7);

        const lGrad = ctx.createLinearGradient(-lSize, -lSize, lSize, lSize);
        lGrad.addColorStop(0, selectedPalette.colors[(l + 1) % selectedPalette.colors.length]);
        lGrad.addColorStop(1, selectedPalette.colors[(l + 3) % selectedPalette.colors.length]);
        ctx.fillStyle = lGrad;
        drawShape(ctx, selectedShape, lSize * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ── TEXT LABEL ──
    if (prompt) {
      const words = prompt.split(" ").slice(0, 3).join(" ");
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `${baseShapeSize * 0.12}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(words, size / 2, size - 20);
      ctx.restore();
    }
  }, [selectedAnim, selectedShape, selectedPalette, prompt, selectedEffect, multiLayer, particleCount, canvasSize, renderScale]);

  // ── Animation Loop ───────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return;
    const fpsVal = fps[0];
    const durationVal = duration[0];
    startTimeRef.current = performance.now();
    particlesRef.current = [];
    trailRef.current = [];

    const animate = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const progress = (elapsed % durationVal) / durationVal;
      renderFrame(progress);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, renderFrame, fps, duration]);

  // Initial render - with renderScale for crisp output
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = renderScale;
    // Buffer at higher resolution, CSS w-full handles display size
    canvas.width = canvasSize * scale;
    canvas.height = canvasSize * scale;
    particlesRef.current = [];
    trailRef.current = [];
    if (!isPlaying) renderFrame(0);
  }, [canvasSize, renderFrame, isPlaying, renderScale]);

  // ── Generate Preview ─────────────────────────────────────────

  const handleGenerateFrame = () => {
    particlesRef.current = [];
    trailRef.current = [];
    renderFrame(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      setPreviewUrl(dataUrl);
      const meta = generateStockMetadata(prompt || "animated icon", selectedAnim, selectedEffect);
      setMetadata(meta);
      toast.success("Preview generated!");
    }
  };

  // ── Export Video ─────────────────────────────────────────────

  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    particlesRef.current = [];
    trailRef.current = [];

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

        const meta = generateStockMetadata(prompt || "animated icon", selectedAnim, selectedEffect);
        setMetadata(meta);

        // Save to gallery
        const thumbnail = canvas.toDataURL("image/png");
        addToGallery({
          type: "animation",
          prompt: prompt || "animated icon",
          style: selectedAnim,
          url,
          thumbnail,
          previewUrl: thumbnail,
          metadata: meta,
        });

        toast.success(`Animation exported! ${(blob.size / 1024).toFixed(1)} KB WebM`);
      };

      mediaRecorder.start();

      for (let i = 0; i < totalFrames; i++) {
        const prog = i / totalFrames;
        renderFrame(prog);
        await new Promise((r) => setTimeout(r, 1000 / fpsVal));
      }

      mediaRecorder.stop();
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export video.");
      setIsGenerating(false);
    }
  };

  // ── Download ─────────────────────────────────────────────────

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.download = `pixelforge-${selectedAnim}.webm`;
      a.href = videoUrl;
      a.click();
    } else if (previewUrl) {
      const a = document.createElement("a");
      a.download = `pixelforge-${selectedAnim}.png`;
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
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Film className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-gradient">Animated</span> Icons
              </h1>
            </div>
            <p className="text-muted-foreground">
              Create stunning animated icons with particles, trails, and multi-layer effects.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Controls */}
            <motion.div className="lg:col-span-2 space-y-4">
              {/* Prompt */}
              <Card className="glass-card p-4 space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Prompt
                </Label>
                <textarea
                  placeholder="Describe your animated icon..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex min-h-[65px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleGenerateFrame} disabled={!prompt.trim()} size="sm" className="gap-1.5 flex-1">
                    <Wand2 className="w-3.5 h-3.5" /> Preview
                  </Button>
                  <Button onClick={() => handleDownload()} disabled={!previewUrl && !videoUrl} variant="outline" size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" /> {videoUrl ? "Video" : "PNG"}
                  </Button>
                </div>
              </Card>

              {/* Animation Style */}
              <Card className="glass-card p-4 space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Film className="w-4 h-4 text-primary" /> Style
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {animStyles.map((anim) => {
                    const isSelected = selectedAnim === anim.id;
                    return (
                      <button key={anim.id} onClick={() => setSelectedAnim(anim.id)}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] transition-all ${
                          isSelected
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary/30 text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                      >
                        <anim.icon className="w-3.5 h-3.5" />
                        <span className="font-medium leading-tight">{anim.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Shape & Colors */}
              <Card className="glass-card p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Shape</p>
                    <div className="flex flex-wrap gap-1">
                      {(["circle", "square", "triangle", "star", "heart", "diamond", "hexagon", "ring"] as ShapeType[]).map((s) => (
                        <Badge key={s} variant={selectedShape === s ? "default" : "outline"}
                          className="cursor-pointer capitalize text-[10px] px-1.5 py-0.5"
                          onClick={() => setSelectedShape(s)}
                        >{s === "hexagon" ? "Hex" : s === "diamond" ? "Dia" : s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Palette</p>
                    <div className="flex flex-wrap gap-1.5">
                      {colorPalettes.map((p) => (
                        <button key={p.name} onClick={() => setSelectedPalette(p)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all border ${
                            selectedPalette.name === p.name ? "border-primary bg-primary/10" : "border-transparent hover:border-border/50"
                          }`}
                        >
                          <div className="flex">
                            {p.colors.slice(0, 3).map((c, i) => (
                              <div key={i} className="w-2.5 h-2.5 rounded-full -ml-0.5 first:ml-0 border border-white/10" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Effects Row */}
              <Card className="glass-card p-4">
                <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" /> Effects
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {effects.map((eff) => (
                    <Badge key={eff.id} variant={selectedEffect === eff.id ? "default" : "outline"}
                      className="cursor-pointer text-[10px] px-2 py-1"
                      onClick={() => setSelectedEffect(eff.id)}
                    >{eff.label}</Badge>
                  ))}
                </div>
                {selectedEffect === "particles" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">Particle Count</span>
                      <span className="text-muted-foreground">{particleCount[0]}</span>
                    </div>
                    <Slider value={particleCount} onValueChange={setParticleCount} min={10} max={100} step={5} />
                  </div>
                )}
              </Card>

              {/* Multi-layer toggle + Export settings */}
              <Card className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" /> Multi-Layer
                  </Label>
                  <button
                    onClick={() => setMultiLayer(!multiLayer)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${multiLayer ? "bg-primary" : "bg-secondary"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${multiLayer ? "translate-x-4.5" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] text-muted-foreground block mb-1">Size</label>
                    <Select value={String(canvasSize)} onValueChange={(v) => setCanvasSize(Number(v))}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {canvasSizes.map((s) => (
                          <SelectItem key={s.value} value={String(s.value)} className="text-xs">{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-muted-foreground block mb-1">Quality</label>
                    <div className="flex gap-1">
                      {qualityOptions.map((q) => (
                        <Badge key={q.value} variant={renderScale === q.value ? "default" : "outline"}
                          className="cursor-pointer text-[10px] px-1.5 py-0.5 flex-1 text-center"
                          onClick={() => setRenderScale(q.value)}
                        >{q.label}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Duration</label>
                    <div className="flex items-center gap-1">
                      <Slider value={duration} onValueChange={setDuration} min={1} max={10} step={0.5} className="flex-1" />
                      <span className="text-[10px] text-muted-foreground w-6 text-right">{duration[0]}s</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">FPS</label>
                    <div className="flex items-center gap-1">
                      <Slider value={fps} onValueChange={setFps} min={12} max={60} step={1} className="flex-1" />
                      <span className="text-[10px] text-muted-foreground w-6 text-right">{fps[0]}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleExportVideo}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full gap-2 h-10 text-sm glow"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Rendering...</>
                  ) : (
                    <><Film className="w-4 h-4" /> Export Animation (WebM)</>
                  )}
                </Button>
              </Card>
            </motion.div>

            {/* Right Preview */}
            <motion.div className="lg:col-span-3 space-y-5">
              {/* Canvas Preview */}
              <Card className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">Preview</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">{canvasSize}×{canvasSize}</Badge>
                    <Badge variant="outline" className="text-[10px]">{selectedAnim}</Badge>
                    {selectedEffect !== "none" && (
                      <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-500 border-purple-500/20">
                        {selectedEffect}
                      </Badge>
                    )}
                    {multiLayer && (
                      <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Layers
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="bg-[#0a0a1a] flex items-center justify-center p-4 relative min-h-[320px]">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ width: Math.min(canvasSize, 420), height: Math.min(canvasSize, 420) }}>
                    <canvas ref={canvasRef} className="w-full h-full" />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <Button variant="secondary" size="icon" className="w-12 h-12 rounded-full opacity-80 hover:opacity-100"
                          onClick={() => { particlesRef.current = []; trailRef.current = []; setIsPlaying(true); }}
                        >
                          <Play className="w-5 h-5 ml-0.5" />
                        </Button>
                      </div>
                    )}
                    {isPlaying && (
                      <div className="absolute bottom-2 right-2">
                        <Button variant="secondary" size="icon" className="w-8 h-8 rounded-full opacity-60 hover:opacity-100"
                          onClick={() => setIsPlaying(false)}
                        ><Pause className="w-4 h-4" /></Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Video Result */}
              {videoUrl && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card overflow-hidden border-green-500/30">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" /> Animation Ready
                      </span>
                      <Button onClick={handleDownload} size="sm" className="gap-1.5"><Download className="w-3.5 h-3.5" /> .webm</Button>
                    </div>
                    <div className="bg-[#0a0a1a] flex items-center justify-center p-3">
                      <video src={videoUrl} autoPlay loop muted playsInline
                        className="rounded-xl shadow-lg max-h-[280px]"
                        style={{ width: Math.min(canvasSize, 400) }}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Stock Metadata */}
              {metadata && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold">Stock Metadata</h3>
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Description</p>
                        <p className="text-xs text-foreground/80 leading-relaxed">{metadata.description}</p>
                        <button onClick={() => handleCopy(metadata.description, "desc")}
                          className="text-[10px] text-primary hover:text-primary/80 mt-0.5 flex items-center gap-1">
                          {copiedField === "desc" ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === "desc" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {metadata.stockCategories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0 bg-green-500/5 text-green-500 border-green-500/20">
                            <Shield className="w-2 h-2 mr-0.5" />{cat}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {metadata.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Empty state */}
              {!previewUrl && !videoUrl && (
                <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-border/50">
                  <Film className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-1">Create your animation</h3>
                  <p className="text-sm text-muted-foreground/60 text-center max-w-sm">
                    Enter a prompt, choose effects, and export MP4 icons for Shutterstock & Adobe Stock.
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
