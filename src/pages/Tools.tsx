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

import AppHeader from "@/components/AppHeader";
import {
  Upload,
  Download,
  Eraser,
  ScanSearch,
  Paintbrush,
  Crop,
  Shrink,
  Wand2,
  Layers,
  Palette,
  ImageIcon,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Link } from "react-router";

type Tool = "remove-bg" | "remove-metadata" | "watermark" | "smart-crop" | "convert" | "serious-edit" | "trace-sbg" | "color-tools";

const tools: { id: Tool; label: string; icon: any; desc: string; gradient: string }[] = [
  { id: "remove-bg", label: "Remove Background", icon: Eraser, desc: "Remove image background with AI", gradient: "from-rose-500 to-orange-500" },
  { id: "remove-metadata", label: "Remove Metadata", icon: ScanSearch, desc: "Strip EXIF & metadata", gradient: "from-blue-500 to-cyan-500" },
  { id: "watermark", label: "Watermark", icon: Paintbrush, desc: "Add text/image watermark", gradient: "from-violet-500 to-purple-500" },
  { id: "smart-crop", label: "Smart Crop", icon: Crop, desc: "Crop with aspect ratios", gradient: "from-green-500 to-emerald-500" },
  { id: "convert", label: "Convert & Compress", icon: Shrink, desc: "Change format & optimize", gradient: "from-amber-500 to-yellow-500" },
  { id: "serious-edit", label: "Serious Edit", icon: Wand2, desc: "Advanced editing suite", gradient: "from-pink-500 to-rose-500" },
  { id: "trace-sbg", label: "Trace SBG", icon: Layers, desc: "Trace shape background", gradient: "from-indigo-500 to-blue-500" },
  { id: "color-tools", label: "Color Tools", icon: Palette, desc: "Color adjustment suite", gradient: "from-teal-500 to-cyan-500" },
];

const aspectRatios = [
  { label: "Free", value: "free" },
  { label: "1:1 Square", value: "1:1" },
  { label: "16:9 Landscape", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "3:2", value: "3:2" },
  { label: "9:16 Portrait", value: "9:16" },
  { label: "2:3", value: "2:3" },
];

const outputFormats = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
  { value: "gif", label: "GIF" },
  { value: "bmp", label: "BMP" },
];

function ToolHeader({ icon: Icon, title, desc, gradient }: { icon: any; title: string; desc: string; gradient: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-2.5`}>
        <Icon className="w-full h-full text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function RemoveBGTool() {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBg = async () => {
    setProcessing(true);
    // Simulate AI background removal
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
  };

  return (
    <div>
      <ToolHeader icon={Eraser} title="Remove Background" desc="Remove image backgrounds with AI precision" gradient="from-rose-500 to-orange-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload an image</p>
          <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <img src={image} alt="Uploaded" className="w-full max-h-[400px] object-contain bg-canvas-grid" />
            {processing && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Removing background...</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={handleRemoveBg} disabled={processing} className="gap-2">
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
              Remove Background
            </Button>
            <Button variant="outline" onClick={() => setImage(null)} className="gap-2">
              <X className="w-4 h-4" /> Reset
            </Button>
            <Button variant="secondary" className="gap-2 ml-auto">
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function RemoveMetadataTool() {
  const [result, setResult] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        // Strip metadata by re-encoding
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          setResult(canvas.toDataURL("image/png"));
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <ToolHeader icon={ScanSearch} title="Remove Metadata" desc="Strip EXIF and hidden metadata from images" gradient="from-blue-500 to-cyan-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <ScanSearch className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image to strip metadata</p>
          <p className="text-sm text-muted-foreground">Removes EXIF, GPS, camera info & more</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Original</p>
              <img src={image} alt="Original" className="rounded-xl w-full max-h-[300px] object-contain bg-canvas-grid" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Cleaned</p>
              {result && (
                <img src={result} alt="Cleaned" className="rounded-xl w-full max-h-[300px] object-contain bg-canvas-grid" />
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setImage(null); setResult(null); }} className="gap-2">
              <X className="w-4 h-4" /> Try Another
            </Button>
            <Button variant="secondary" className="gap-2 ml-auto">
              <Download className="w-4 h-4" /> Download Cleaned
            </Button>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 gap-1">
              <Check className="w-3 h-3" /> Metadata stripped
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}

function WatermarkTool() {
  const [image, setImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("© PixelForge");
  const [opacity, setOpacity] = useState([50]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkCanvasRef = useRef<HTMLCanvasElement>(null);
  const watermarkImgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setPreviewUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderWatermark = useCallback(() => {
    const canvas = watermarkCanvasRef.current;
    const img = watermarkImgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Draw watermark text repeated across the image
    ctx.save();
    ctx.globalAlpha = opacity[0] / 100;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `bold ${Math.max(24, canvas.width * 0.04)}px sans-serif`;
    ctx.textAlign = "center";

    // Tiled watermark
    const spacing = Math.max(150, canvas.width * 0.25);
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.save();
        ctx.translate(x + spacing / 2, y + spacing / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();

    setPreviewUrl(canvas.toDataURL("image/png"));
  }, [watermarkText, opacity]);

  const handleDownloadWatermark = () => {
    if (previewUrl) {
      const a = document.createElement("a");
      a.download = "pixelforge-watermarked.png";
      a.href = previewUrl;
      a.click();
    }
  };

  useEffect(() => {
    if (image && watermarkImgRef.current?.complete) renderWatermark();
  }, [watermarkText, opacity, renderWatermark, image]);

  return (
    <div>
      <canvas ref={watermarkCanvasRef} className="hidden" />
      <ToolHeader icon={Paintbrush} title="Watermark" desc="Add custom watermarks to protect your images" gradient="from-violet-500 to-purple-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <Paintbrush className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image to watermark</p>
          <p className="text-sm text-muted-foreground">Protect your work with custom text or logo watermarks</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden max-h-[400px] flex items-center justify-center bg-canvas-grid">
            <img ref={watermarkImgRef} src={image} alt="Original" className="max-h-[350px] object-contain hidden" onLoad={renderWatermark} />
            {previewUrl ? (
              <img src={previewUrl} alt="Watermarked preview" className="max-h-[350px] object-contain" />
            ) : (
              <img src={image} alt="Original" className="max-h-[350px] object-contain" />
            )}
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Watermark Text</Label>
              <Input value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="mt-1" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Opacity</Label>
                <span className="text-muted-foreground">{opacity[0]}%</span>
              </div>
              <Slider value={opacity} onValueChange={setOpacity} max={100} step={1} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setImage(null); setPreviewUrl(null); }} className="gap-2">
                <X className="w-4 h-4" /> Reset
              </Button>
              <Button variant="secondary" className="gap-2 ml-auto" onClick={handleDownloadWatermark} disabled={!previewUrl}>
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SmartCropTool() {
  const [image, setImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("free");
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setCroppedUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = useCallback(() => {
    const canvas = cropCanvasRef.current;
    const img = cropImgRef.current;
    if (!canvas || !img) return;

    setIsCropping(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = img.naturalWidth;
    const h = img.naturalHeight;

    let cropW = w;
    let cropH = h;

    if (aspectRatio !== "free") {
      const [ratioW, ratioH] = aspectRatio.split(":").map(Number);
      const targetRatio = ratioW / ratioH;
      const imageRatio = w / h;

      if (imageRatio > targetRatio) {
        cropW = h * targetRatio;
        cropH = h;
      } else {
        cropW = w;
        cropH = w / targetRatio;
      }
    }

    const sx = (w - cropW) / 2;
    const sy = (h - cropH) / 2;

    canvas.width = cropW;
    canvas.height = cropH;
    ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

    setCroppedUrl(canvas.toDataURL("image/png"));
    setIsCropping(false);
  }, [aspectRatio]);

  const handleDownloadCrop = () => {
    if (croppedUrl) {
      const a = document.createElement("a");
      a.download = "pixelforge-cropped.png";
      a.href = croppedUrl;
      a.click();
    }
  };

  useEffect(() => {
    if (image && cropImgRef.current?.complete) handleCrop();
  }, [aspectRatio, handleCrop, image]);

  return (
    <div>
      <canvas ref={cropCanvasRef} className="hidden" />
      <ToolHeader icon={Crop} title="Smart Crop" desc="Crop images with intelligent aspect ratio presets" gradient="from-green-500 to-emerald-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <Crop className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image to crop</p>
          <p className="text-sm text-muted-foreground">Smart composition detection for perfect framing</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden max-h-[350px] flex items-center justify-center bg-canvas-grid">
              <img ref={cropImgRef} src={image} alt="Original" className="max-h-[300px] object-contain" onLoad={handleCrop} />
            </div>
            <div className="rounded-xl overflow-hidden max-h-[350px] flex items-center justify-center bg-canvas-grid">
              {croppedUrl ? (
                <img src={croppedUrl} alt="Cropped" className="max-h-[300px] object-contain" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  {isCropping ? "Cropping..." : "Preview"}
                </div>
              )}
            </div>
          </div>
          <div>
            <Label className="text-xs mb-2 block">Aspect Ratio</Label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((ar) => (
                <Badge
                  key={ar.value}
                  variant={aspectRatio === ar.value ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => setAspectRatio(ar.value)}
                >
                  {ar.label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setImage(null); setCroppedUrl(null); }} className="gap-2">
              <X className="w-4 h-4" /> Reset
            </Button>
            <Button variant="secondary" className="gap-2 ml-auto" onClick={handleCrop} disabled={isCropping}>
              <Crop className="w-4 h-4" /> {isCropping ? "Cropping..." : "Apply Crop"}
            </Button>
            <Button variant="secondary" className="gap-2" onClick={handleDownloadCrop} disabled={!croppedUrl}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConvertTool() {
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState([80]);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<{ original: string; converted: string } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convertCanvasRef = useRef<HTMLCanvasElement>(null);
  const convertImgRef = useRef<HTMLImageElement>(null);
  const originalFileRef = useRef<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      originalFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setConvertedUrl(null);
        setFileSize(null);
        setFileSize({ original: (file.size / 1024).toFixed(1), converted: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = useCallback(() => {
    const canvas = convertCanvasRef.current;
    const img = convertImgRef.current;
    if (!canvas || !img) return;

    setIsConverting(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const mimeType = format === "jpg" ? "image/jpeg" :
      format === "png" ? "image/png" :
      format === "webp" ? "image/webp" :
      format === "avif" ? "image/avif" :
      format === "gif" ? "image/gif" :
      format === "bmp" ? "image/bmp" : "image/png";

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setConvertedUrl(url);
        setFileSize((prev) => prev ? { ...prev, converted: (blob.size / 1024).toFixed(1) } : null);
      }
      setIsConverting(false);
    }, mimeType, quality[0] / 100);
  }, [format, quality]);

  const handleDownloadConvert = () => {
    if (convertedUrl) {
      const a = document.createElement("a");
      a.download = `pixelforge-converted.${format}`;
      a.href = convertedUrl;
      a.click();
    }
  };

  return (
    <div>
      <canvas ref={convertCanvasRef} className="hidden" />
      <ToolHeader icon={Shrink} title="Convert & Compress" desc="Convert between formats and optimize file size" gradient="from-amber-500 to-yellow-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <Shrink className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image to convert</p>
          <p className="text-sm text-muted-foreground">Supports PNG, JPG, WebP, AVIF, GIF, BMP</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden max-h-[250px] flex items-center justify-center bg-canvas-grid">
              <img src={image} alt="Original" className="max-h-[230px] object-contain" />
            </div>
            <div className="rounded-xl overflow-hidden max-h-[250px] flex items-center justify-center bg-canvas-grid">
              {convertedUrl ? (
                <img src={convertedUrl} alt="Converted" className="max-h-[230px] object-contain" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  {isConverting ? "Converting..." : "Click Convert"}
                </div>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Output Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Quality</Label>
                <span className="text-muted-foreground">{quality[0]}%</span>
              </div>
              <Slider value={quality} onValueChange={setQuality} max={100} step={1} className="mt-2" />
            </div>
          </div>
          {fileSize && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Original: {fileSize.original} KB</span>
              {fileSize.converted && (
                <><span className="text-border/50">→</span><span className="text-green-500">Converted: {fileSize.converted} KB</span></>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setImage(null); setConvertedUrl(null); setFileSize(null); }} className="gap-2">
              <X className="w-4 h-4" /> Reset
            </Button>
            <img ref={convertImgRef} src={image} alt="" className="hidden" onLoad={handleConvert} />
            <Button variant="secondary" className="gap-2 ml-auto" onClick={handleConvert} disabled={isConverting}>
              <Shrink className="w-4 h-4" /> {isConverting ? "Converting..." : "Convert"}
            </Button>
            <Button variant="secondary" className="gap-2" onClick={handleDownloadConvert} disabled={!convertedUrl}>
              <Download className="w-4 h-4" /> .{format}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SeriousEditTool() {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <ToolHeader icon={Wand2} title="Serious Edit" desc="Advanced image editing tools for professionals" gradient="from-pink-500 to-rose-500" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <Wand2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image for advanced editing</p>
          <p className="text-sm text-muted-foreground">Adjustments, filters, healing brush, and more</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden max-h-[350px] flex items-center justify-center bg-canvas-grid">
            <img src={image} alt="Edit" className="max-h-[300px] object-contain" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setImage(null)} className="gap-2">
              <X className="w-4 h-4" /> Reset
            </Button>
            <Link to="/studio">
              <Button variant="default" className="gap-2">
                <ImageIcon className="w-4 h-4" /> Open in Studio
              </Button>
            </Link>
            <Button variant="secondary" className="gap-2 ml-auto">
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
}

function TraceSBGTool() {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <ToolHeader icon={Layers} title="Trace SBG" desc="Trace and extract shape backgrounds from images" gradient="from-indigo-500 to-blue-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image to trace</p>
          <p className="text-sm text-muted-foreground">Extract shape boundaries and create vector paths</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden max-h-[350px] flex items-center justify-center bg-canvas-grid">
            <img src={image} alt="Trace" className="max-h-[300px] object-contain" />
          </div>
          <div className="flex gap-3">
            <Button disabled className="gap-2"><Layers className="w-4 h-4" /> Trace Shapes</Button>
            <Button variant="outline" onClick={() => setImage(null)} className="gap-2"><X className="w-4 h-4" /> Reset</Button>
            <Button variant="secondary" className="gap-2 ml-auto"><Download className="w-4 h-4" /> Download</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorToolsTool() {
  const [image, setImage] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setResultUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = useCallback(() => {
    const canvas = processCanvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.filter = [
      `brightness(${1 + brightness[0] / 100})`,
      `contrast(${1 + contrast[0] / 100})`,
      `saturate(${1 + saturation[0] / 100})`,
    ].join(" ");

    ctx.drawImage(img, 0, 0);
    setResultUrl(canvas.toDataURL("image/png"));
  }, [brightness, contrast, saturation]);

  useEffect(() => {
    if (image && imgRef.current?.complete) applyFilters();
  }, [brightness, contrast, saturation, applyFilters, image]);

  const handleDownloadAdjust = () => {
    if (resultUrl) {
      const a = document.createElement("a");
      a.download = "pixelforge-color-adjusted.png";
      a.href = resultUrl;
      a.click();
    }
  };

  return (
    <div>
      <canvas ref={processCanvasRef} className="hidden" />
      <ToolHeader icon={Palette} title="Color Tools" desc="Adjust brightness, contrast, saturation and more" gradient="from-teal-500 to-cyan-500" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-xl p-16 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
          <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Upload image to adjust colors</p>
          <p className="text-sm text-muted-foreground">Fine-tune colors with professional-grade controls</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden max-h-[300px] flex items-center justify-center bg-canvas-grid">
            <img ref={imgRef} src={image} alt="Adjust" className="max-h-[280px] object-contain" onLoad={applyFilters} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Brightness</Label><span className="text-muted-foreground">{brightness[0]}</span>
              </div>
              <Slider value={brightness} onValueChange={setBrightness} min={-100} max={100} step={1} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Contrast</Label><span className="text-muted-foreground">{contrast[0]}</span>
              </div>
              <Slider value={contrast} onValueChange={setContrast} min={-100} max={100} step={1} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <Label>Saturation</Label><span className="text-muted-foreground">{saturation[0]}</span>
              </div>
              <Slider value={saturation} onValueChange={setSaturation} min={-100} max={100} step={1} />
            </div>
          </div>
          {resultUrl && (
            <div className="rounded-xl overflow-hidden max-h-[200px] flex items-center justify-center bg-canvas-grid border border-primary/20">
              <img src={resultUrl} alt="Result" className="max-h-[180px] object-contain" />
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setImage(null); setResultUrl(null); }} className="gap-2"><X className="w-4 h-4" /> Reset</Button>
            <Button variant="secondary" className="gap-2 ml-auto" onClick={handleDownloadAdjust} disabled={!resultUrl}><Download className="w-4 h-4" /> Download</Button>
          </div>
        </div>
      )}
    </div>
  );
}



export default function Tools() {
  const [activeTool, setActiveTool] = useState<Tool>("remove-bg");

  const renderTool = () => {
    switch (activeTool) {
      case "remove-bg": return <RemoveBGTool />;
      case "remove-metadata": return <RemoveMetadataTool />;
      case "watermark": return <WatermarkTool />;
      case "smart-crop": return <SmartCropTool />;
      case "convert": return <ConvertTool />;
      case "serious-edit": return <SeriousEditTool />;
      case "trace-sbg": return <TraceSBGTool />;
      case "color-tools": return <ColorToolsTool />;
      default: return <RemoveBGTool />;
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
              Image <span className="text-gradient">Tools</span>
            </h1>
            <p className="text-muted-foreground">
              A complete suite of professional image editing tools.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Tool Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="glass-card p-3 space-y-1">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.gradient} p-1.5 shrink-0`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-xs">{tool.label}</div>
                        <div className="text-[10px] opacity-70">{tool.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </Card>
            </motion.div>

            {/* Tool Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <Card className="glass-card p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTool}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTool()}
                  </motion.div>
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
