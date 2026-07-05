import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/components/AppHeader";
import {
  Upload,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  PaintBucket,
  Type,
  Eraser,
  Brush,
  Circle,
  Square,
  Minus,
  Sparkles,
  Save,
  Trash2,
  Image as ImageIcon,
  Layers,
  Crop,
  Filter,
  Sliders,
  Wand2,
  Grid3x3,
  MousePointer2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ToolType = "select" | "brush" | "eraser" | "text" | "shape" | "crop" | "fill";
type ShapeType = "rect" | "circle" | "line";
type FilterType = "none" | "grayscale" | "sepia" | "invert" | "blur" | "brightness" | "contrast";

const filters: { id: FilterType; label: string }[] = [
  { id: "none", label: "Original" },
  { id: "grayscale", label: "Grayscale" },
  { id: "sepia", label: "Sepia" },
  { id: "invert", label: "Invert" },
  { id: "blur", label: "Blur" },
  { id: "brightness", label: "Brightness" },
  { id: "contrast", label: "Contrast" },
];

const filterStyles: Record<string, string> = {
  grayscale: "grayscale(100%)",
  sepia: "sepia(80%)",
  invert: "invert(100%)",
  blur: "blur(3px)",
  brightness: "brightness(1.3)",
  contrast: "contrast(1.5)",
};

export default function Studio() {
  const [image, setImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const [brushSize, setBrushSize] = useState([5]);
  const [opacity, setOpacity] = useState([100]);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [textInput, setTextInput] = useState("Add Text");
  const [textColor, setTextColor] = useState("#ffffff");
  const [shapeColor, setShapeColor] = useState("#6366f1");
  const [texts, setTexts] = useState<{ id: number; content: string; x: number; y: number; color: string }[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setImage(src);
        setHistory([src]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = useCallback(() => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = activeFilter === "none" ? "none" : filterStyles[activeFilter] || "none";
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";
    };
    img.src = image;
  }, [image, activeFilter]);

  useEffect(() => {
    if (image) applyFilter();
  }, [image, applyFilter]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "brush" || activeTool === "eraser") {
      isDrawing.current = true;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        lastPos.current = {
          x: (e.clientX - rect.left) * (canvasRef.current!.width / rect.width),
          y: (e.clientY - rect.top) * (canvasRef.current!.height / rect.height),
        };
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = activeTool === "eraser" ? "transparent" : "#6366f1";
    ctx.lineWidth = brushSize[0];
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";

    lastPos.current = { x, y };
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const addText = () => {
    setTexts((prev) => [
      ...prev,
      { id: Date.now(), content: textInput, x: 100, y: 100, color: textColor },
    ]);
  };

  const addShape = (type: ShapeType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = shapeColor;
    ctx.strokeStyle = shapeColor;
    ctx.lineWidth = 3;

    switch (type) {
      case "rect":
        ctx.fillRect(100, 100, 200, 150);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(250, 200, 100, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(100, 200);
        ctx.lineTo(400, 200);
        ctx.stroke();
        break;
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "pixelforge-edited.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-16">
        {/* Toolbar */}
        <div className="glass border-b border-border/50 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5" /> Open
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled={!image}>
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={downloadImage} disabled={!image}>
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled>
              <Undo2 className="w-3.5 h-3.5" /> Undo
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled>
              <Redo2 className="w-3.5 h-3.5" /> Redo
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant={activeTool === "select" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTool("select")}
              className="text-xs"
            >
              <MousePointer2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={activeTool === "brush" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTool("brush")}
              className="text-xs"
            >
              <Brush className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={activeTool === "eraser" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTool("eraser")}
              className="text-xs"
            >
              <Eraser className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={activeTool === "text" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTool("text")}
              className="text-xs"
            >
              <Type className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={activeTool === "shape" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTool("shape")}
              className="text-xs"
            >
              <Circle className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={activeTool === "fill" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTool("fill")}
              className="text-xs"
            >
              <PaintBucket className="w-3.5 h-3.5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={() => setShowGrid(!showGrid)} className={`text-xs ${showGrid ? "text-primary" : ""}`}>
              <Grid3x3 className="w-3.5 h-3.5" />
            </Button>
            <div className="flex items-center gap-1 ml-auto">
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))} disabled={zoom <= 25}>
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(400, zoom + 25))} disabled={zoom >= 400}>
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-8rem)]">
          {/* Left Panel - Tools */}
          <div className="w-60 lg:w-72 border-r border-border/50 p-4 overflow-y-auto hidden md:block">
            <Tabs defaultValue="adjust" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="adjust" className="text-xs flex-1"><Sliders className="w-3 h-3 mr-1" /> Adjust</TabsTrigger>
                <TabsTrigger value="filter" className="text-xs flex-1"><Filter className="w-3 h-3 mr-1" /> Filter</TabsTrigger>
                <TabsTrigger value="layers" className="text-xs flex-1"><Layers className="w-3 h-3 mr-1" /> Text</TabsTrigger>
              </TabsList>

              <TabsContent value="adjust" className="space-y-4 mt-0">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <Label>Brush Size</Label>
                    <span className="text-muted-foreground">{brushSize[0]}px</span>
                  </div>
                  <Slider value={brushSize} onValueChange={setBrushSize} min={1} max={100} step={1} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <Label>Opacity</Label>
                    <span className="text-muted-foreground">{opacity[0]}%</span>
                  </div>
                  <Slider value={opacity} onValueChange={setOpacity} max={100} step={1} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-xs">Shape Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={shapeColor}
                      onChange={(e) => setShapeColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => addShape("rect")}>
                      <Square className="w-3 h-3 mr-1" /> Rect
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => addShape("circle")}>
                      <Circle className="w-3 h-3 mr-1" /> Circle
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => addShape("line")}>
                      <Minus className="w-3 h-3 mr-1" /> Line
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="filter" className="mt-0">
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((f) => (
                    <Button
                      key={f.id}
                      variant={activeFilter === f.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setActiveFilter(f.id)}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="layers" className="mt-0 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Text content"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="text-xs h-8"
                  />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer shrink-0"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={addText}>
                  <Type className="w-3 h-3 mr-1" /> Add Text
                </Button>
                {texts.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {texts.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-2 rounded bg-secondary/50 text-xs">
                        <span className="truncate">{t.content}</span>
                        <Button variant="ghost" size="icon" className="w-5 h-5">
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-[#1a1a2e] overflow-auto">
            {!image ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-studio-1/20 to-studio-4/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-10 h-10 text-primary/50" />
                </div>
                <p className="text-lg font-medium text-muted-foreground mb-1">Open an image to start editing</p>
                <p className="text-sm text-muted-foreground/60">Drag & drop or click to browse</p>
                <Button variant="outline" size="sm" className="mt-4 gap-2">
                  <Upload className="w-4 h-4" /> Browse Files
                </Button>
              </div>
            ) : (
              <div
                className="relative"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center center",
                }}
              >
                {showGrid && (
                  <div className="absolute inset-0 canvas-grid pointer-events-none z-10" />
                )}
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[calc(100vh-8rem)] cursor-crosshair shadow-2xl rounded-sm"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />

                {/* Text overlays */}
                {texts.map((t) => (
                  <div
                    key={t.id}
                    className="absolute cursor-move"
                    style={{ left: t.x, top: t.y, color: t.color }}
                  >
                    {t.content}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Info */}
          <div className="w-56 border-l border-border/50 p-4 hidden xl:block overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-2 block">Layer Info</Label>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>No layers</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs mb-2 block">Canvas</Label>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Width: {canvasRef.current?.width || 0}px</p>
                  <p>Height: {canvasRef.current?.height || 0}px</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs mb-2 block">Tools</Label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                    <RotateCw className="w-3 h-3" /> Rotate 90°
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                    <Crop className="w-3 h-3" /> Crop
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                    <Sparkles className="w-3 h-3" /> AI Enhance
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
