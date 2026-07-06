import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/components/AppHeader";
import {
  ChevronDown,
  Search,
  Sparkles,
  ImageIcon,
  Palette,
  Cuboid,
  HelpCircle,
  Users,
} from "lucide-react";

const faqCategories = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "generation", label: "AI Generation", icon: Sparkles },
  { id: "tools", label: "Image Tools", icon: Palette },
  { id: "studio", label: "Studio Editor", icon: ImageIcon },
  { id: "models", label: "Models", icon: Cuboid },
  { id: "billing", label: "Billing & Promo", icon: Sparkles },
  { id: "account", label: "Account", icon: Users },
  { id: "technical", label: "Technical", icon: HelpCircle },
];

const faqItems: { category: string; q: string; a: string | string[] }[] = [
  // General
  {
    category: "general",
    q: "Apa itu PixelForge?",
    a: "PixelForge adalah platform all-in-one untuk membuat dan mengedit gambar menggunakan AI. Kami menyediakan AI image generation, berbagai tools editing (remove background, watermark, smart crop, dan banyak lagi), studio editor profesional, serta akses ke berbagai model AI untuk menghasilkan gambar berkualitas tinggi.",
  },
  {
    category: "general",
    q: "Apakah PixelForge gratis?",
    a: "Ya! PixelForge memiliki free tier yang bisa kamu gunakan tanpa kartu kredit. Setiap pengguna mendapatkan kredit gratis setiap bulan untuk AI generation dan akses ke semua tools dasar. Untuk kebutuhan lebih besar, kami punya paket promo dan premium dengan kredit tambahan & fitur eksklusif.",
  },
  {
    category: "general",
    q: "Apakah hasil gambar saya aman?",
    a: "Kami sangat menjaga privasi pengguna. Semua gambar yang kamu buat bersifat pribadi dan tidak akan dibagikan tanpa izinmu. Kami menggunakan enkripsi untuk penyimpanan dan tidak menggunakan gambar kamu untuk melatih model AI tanpa persetujuan eksplisit.",
  },
  {
    category: "general",
    q: "Format gambar apa saja yang didukung?",
    a: "PixelForge mendukung berbagai format gambar: PNG, JPEG, WebP, AVIF, GIF, BMP, dan SVG (untuk output tertentu). Untuk AI generation, hasil output tersedia dalam format PNG dan WebP dengan kualitas tinggi.",
  },

  // AI Generation
  {
    category: "generation",
    q: "Bagaimana cara generate gambar dengan AI?",
    a: "Caranya mudah! Cukup buka halaman Generate, masukkan prompt (deskripsi gambar yang kamu inginkan), pilih style yang diinginkan (Photorealistic, Anime, Oil Painting, dll), lalu klik tombol Generate. AI akan memproses prompt kamu dan menghasilkan gambar dalam beberapa detik.",
  },
  {
    category: "generation",
    q: "Apa itu negative prompt?",
    a: "Negative prompt adalah deskripsi tentang hal-hal yang TIDAK ingin kamu lihat di gambar hasil generate. Misalnya, jika kamu ingin gambar pemandangan tanpa awan, kamu bisa menambahkan negative prompt \"clouds, cloudy sky\". Ini membantu AI menghasilkan gambar yang lebih sesuai dengan keinginanmu.",
  },
  {
    category: "generation",
    q: "Berapa lama waktu generate gambar?",
    a: "Waktu generate bervariasi tergantung kompleksitas prompt dan model yang digunakan. Rata-rata, gambar sederhana selesai dalam 2-5 detik, sementara gambar yang lebih kompleks bisa memakan waktu 10-20 detik. Dengan paket premium, kamu mendapat prioritas akses yang lebih cepat.",
  },
  {
    category: "generation",
    q: "Apakah saya bisa menggunakan gambar untuk komersial?",
    a: "Ya, gambar yang dihasilkan menggunakan PixelForge dapat digunakan untuk keperluan komersial, termasuk konten media sosial, website, materi marketing, produk digital, dan lainnya. Lihat syarat & ketentuan kami untuk detail lebih lanjut tentang lisensi.",
  },
  {
    category: "generation",
    q: "Mengapa hasil generate tidak sesuai prompt?",
    a: "Beberapa tips untuk hasil yang lebih baik: (1) Gunakan deskripsi yang detail dan spesifik, (2) Sebutkan gaya/style yang diinginkan, (3) Gunakan kata kunci seperti \"photorealistic\", \"cinematic lighting\", \"high detail\", (4) Coba variasikan prompt, (5) Gunakan negative prompt untuk menghindari elemen yang tidak diinginkan.",
  },

  // Tools
  {
    category: "tools",
    q: "Apa saja tools yang tersedia?",
    a: [
      "Kami menyediakan 8 tools utama:",
      "• Remove Background — Hapus latar belakang dengan AI",
      "• Remove Metadata — Bersihkan data EXIF & metadata",
      "• Watermark — Tambahkan watermark teks atau logo",
      "• Smart Crop — Crop cerdas dengan preset rasio",
      "• Convert & Compress — Ubah format & optimasi ukuran",
      "• Serious Edit — Editing tingkat lanjut",
      "• Trace SBG — Trace shape background",
      "• Color Tools — Penyesuaian warna (brightness, contrast, saturation)",
    ],
  },
  {
    category: "tools",
    q: "Bagaimana cara menghapus background?",
    a: "Buka halaman Tools, pilih Remove Background, upload gambar yang ingin dihapus background-nya, lalu klik tombol \"Remove Background\". AI akan secara otomatis mendeteksi dan menghapus background dengan presisi tinggi. Kamu bisa langsung mendownload hasilnya dalam format PNG dengan transparansi.",
  },
  {
    category: "tools",
    q: "Apa itu Remove Metadata?",
    a: "Setiap foto yang diambil dengan kamera atau smartphone menyimpan data EXIF (Exchangeable Image File Format) termasuk informasi seperti merk kamera, tanggal, lokasi GPS, dan pengaturan exposure. Tools Remove Metadata membersihkan semua data ini dari gambar kamu, melindungi privasi saat membagikan foto online.",
  },
  {
    category: "tools",
    q: "Format apa saja yang didukung untuk konversi?",
    a: "Tools Convert & Compress mendukung konversi antar format: PNG, JPEG, WebP, AVIF, GIF, dan BMP. Kamu juga bisa mengatur tingkat kompresi (quality) untuk mengoptimalkan ukuran file tanpa mengorbankan kualitas secara signifikan.",
  },

  // Studio
  {
    category: "studio",
    q: "Apa itu Studio Editor?",
    a: "Studio adalah editor gambar berbasis canvas yang memungkinkan kamu mengedit gambar secara profesional langsung di browser. Fiturnya termasuk: brush tool, eraser, shape tools (rectangle, circle, line), text overlay, filter efek (grayscale, sepia, invert, blur, brightness, contrast), zoom, grid overlay, dan masih banyak lagi.",
  },
  {
    category: "studio",
    q: "Apakah studio editor mendukung layers?",
    a: "Ya! Studio editor kami mendukung multiple layers yang memungkinkan kamu bekerja dengan elemen terpisah. Kamu bisa menambahkan text layers, shape layers, dan image layers. Setiap layer bisa diatur opacity-nya, dihapus, atau di-reorder sesuai kebutuhan.",
  },
  {
    category: "studio",
    q: "Bisakah saya menambahkan teks ke gambar?",
    a: "Tentu! Di Studio editor, pilih tool Text, masukkan teks yang diinginkan, pilih warna, lalu klik \"Add Text\". Teks akan muncul di canvas dan bisa dipindahkan sesuai posisi yang diinginkan. Cocok untuk membuat quote graphics, banner, atau poster sederhana.",
  },
  {
    category: "studio",
    q: "Filter apa saja yang tersedia?",
    a: "Studio editor menyediakan berbagai filter: Original (tanpa filter), Grayscale (hitam putih), Sepia (efek vintage), Invert (membalikkan warna), Blur (efek kabur), Brightness (kecerahan), dan Contrast (kontras). Setiap filter bisa dikombinasikan dengan adjustment slider untuk hasil yang optimal.",
  },

  // Models
  {
    category: "models",
    q: "Apa itu AI Models?",
    a: "AI Models adalah berbagai model kecerdasan buatan yang sudah dilatih untuk menghasilkan gambar dengan gaya dan karakteristik tertentu. PixelForge memberikan akses ke berbagai model populer seperti Flux Pro, Stable Diffusion XL, Realistic Vision, Anime V4, dan masih banyak lagi.",
  },
  {
    category: "models",
    q: "Apa perbedaan antara model Free dan Premium?",
    a: "Model Free dapat digunakan oleh semua pengguna tanpa biaya tambahan, dengan hasil yang tetap berkualitas tinggi. Model Premium menawarkan kualitas lebih tinggi, resolusi lebih besar, detail lebih tajam, dan fitur eksklusif seperti negative prompt yang lebih kompleks dan prioritas akses.",
  },
  {
    category: "models",
    q: "Bagaimana cara menggunakan model tertentu?",
    a: "Buka halaman Models, cari model yang kamu inginkan (bisa search atau filter berdasarkan kategori), klik model tersebut untuk memilihnya, lalu masukkan prompt kamu di panel generate yang muncul. Kamu juga bisa menandai model favorit dengan mengklik icon Heart.",
  },

  // Billing
  {
    category: "billing",
    q: "Apa saja paket promo yang tersedia?",
    a: [
      "Kami menawarkan beberapa paket promo untuk AI generation:",
      "🎉 **Free Pack** — GRATIS! 50 kredit/bulan + akses semua tools dasar",
      "🔥 **Starter Pack** — Rp 29.000/bulan — 500 kredit + prioritas generasi",
      "⚡ **Pro Pack** — Rp 79.000/bulan — 2.000 kredit + model premium + tanpa watermark",
      "🚀 **Unlimited Pack** — Rp 199.000/bulan — UNLIMITED generasi + semua fitur premium",
      "🎨 **Bulk Pack** — Rp 499.000 — 10.000 kredit (sekali beli, tidak kadaluarsa)",
      "Lihat halaman Promo untuk detail lengkap dan promo spesial!",
    ],
  },
  {
    category: "billing",
    q: "Apakah ada paket unlimited?",
    a: "Ya! Paket Unlimited memungkinkan kamu melakukan generate gambar tanpa batas setiap bulannya. Cocok untuk content creator, designer, dan bisnis yang membutuhkan produksi gambar dalam jumlah besar. Termasuk akses ke semua model premium dan fitur eksklusif.",
  },
  {
    category: "billing",
    q: "Bagaimana cara menggunakan kode promo?",
    a: "Saat checkout di halaman Promo, masukkan kode promo pada kolom yang tersedia lalu klik \"Apply\". Diskon akan langsung diterapkan ke total harga. Pastikan kode promo masih berlaku dan belum kadaluarsa.",
  },
  {
    category: "billing",
    q: "Apakah kredit bisa digunakan kapan saja?",
    a: "Kredit dari paket bulanan akan di-reset setiap periode. Namun, kredit dari Bulk Pack tidak memiliki masa kadaluarsa — kamu bisa menggunakannya kapan saja. Kredit yang tidak terpakai dari paket bulanan TIDAK bisa dibawa ke bulan berikutnya.",
  },

  // Account
  {
    category: "account",
    q: "Bagaimana cara membuat akun?",
    a: "Klik tombol \"Sign In\" di pojok kanan atas, masukkan alamat email kamu, lalu kami akan mengirimkan kode OTP (One-Time Password) ke email tersebut. Masukkan kode yang diterima untuk login. Alternatifnya, kamu bisa menggunakan opsi \"Continue as Guest\" untuk mencoba tanpa registrasi.",
  },
  {
    category: "account",
    q: "Bagaimana cara menghapus akun?",
    a: "Untuk menghapus akun, silakan hubungi tim support kami melalui email support@pixelforge.ai atau melalui form kontak. Kami akan memproses penghapusan akun beserta semua data terkait dalam waktu 1x24 jam.",
  },
  {
    category: "account",
    q: "Apa yang terjadi jika saya login sebagai Guest?",
    a: "Saat login sebagai Guest, kamu bisa mencoba fitur-fitur PixelForge secara terbatas. Namun, hasil generate dan editan tidak akan tersimpan secara permanen. Untuk menyimpan karya dan mendapatkan akses penuh, disarankan untuk mendaftar menggunakan email.",
  },

  // Technical
  {
    category: "technical",
    q: "Browser apa saja yang didukung?",
    a: "PixelForge mendukung semua browser modern: Google Chrome (v90+), Mozilla Firefox (v88+), Safari (v14+), Microsoft Edge (v90+), dan Opera (v76+). Untuk pengalaman terbaik, kami merekomendasikan menggunakan Google Chrome atau Firefox versi terbaru.",
  },
  {
    category: "technical",
    q: "Apakah ada aplikasi mobile?",
    a: "Saat ini PixelForge tersedia sebagai web app yang responsif dan bisa diakses dari perangkat mobile melalui browser. Kami sedang mengembangkan aplikasi mobile native untuk iOS dan Android — pantau terus pengumuman kami!",
  },
  {
    category: "technical",
    q: "Mengapa gambar tidak muncul atau error?",
    a: "Beberapa solusi: (1) Refresh halaman dan coba lagi, (2) Pastikan koneksi internet stabil, (3) Clear cache browser, (4) Coba gunakan browser lain, (5) Pastikan kamu tidak menggunakan VPN yang memblokir akses. Jika masalah berlanjut, hubungi support kami.",
  },
  {
    category: "technical",
    q: "Apakah data saya dienkripsi?",
    a: "Ya! Semua data yang dikirim dan disimpan di PixelForge menggunakan enkripsi SSL/TLS 256-bit. Kami juga menerapkan best practice keamanan untuk melindungi data pengguna, termasuk enkripsi at-rest untuk penyimpanan database.",
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const filtered = faqItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(item.a)
        ? item.a.join(" ").toLowerCase().includes(searchQuery.toLowerCase())
        : item.a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero FAQ */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-studio-1/5 via-studio-2/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              <HelpCircle className="w-3 h-3 mr-1" /> FAQ
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Temukan jawaban untuk pertanyaan yang paling sering diajukan tentang PixelForge.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base glass-card border-border/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  Categories
                </div>
                {faqCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  const count = faqItems.filter((f) => f.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left">{cat.label}</span>
                      <span className="text-xs text-muted-foreground/60">{count}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* FAQ Items */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">Tidak ada hasil</p>
                  <p className="text-sm text-muted-foreground/60">Coba kata kunci atau kategori lain</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> pertanyaan
                  </p>
                  {filtered.map((item, i) => {
                    const globalIndex = faqItems.indexOf(item);
                    const isOpen = expandedItems.has(globalIndex);
                    return (
                      <motion.div
                        key={globalIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Card
                          className={`glass-card overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary/30 ${
                            isOpen ? "border-primary/30" : ""
                          }`}
                          onClick={() => toggleItem(globalIndex)}
                        >
                          <div className="flex items-start gap-4 p-5">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm sm:text-base pr-8">
                                {item.q}
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 shrink-0 mt-0.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(globalIndex);
                              }}
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </div>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-0">
                                  <div className="w-full h-px bg-border/50 mb-4" />
                                  <div className="text-sm text-muted-foreground leading-relaxed space-y-1.5">
                                    {Array.isArray(item.a) ? (
                                      item.a.map((line, li) => (
                                        <p key={li} className={line.startsWith("•") ? "pl-4" : line.startsWith("🎉") || line.startsWith("🔥") || line.startsWith("⚡") || line.startsWith("🚀") || line.startsWith("🎨") ? "font-medium text-foreground/80" : ""}>
                                          {line}
                                        </p>
                                      ))
                                    ) : (
                                      <p>{item.a}</p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
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
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/promo" className="hover:text-foreground transition-colors">Promo</Link>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
