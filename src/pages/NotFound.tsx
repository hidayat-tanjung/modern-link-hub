import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-studio-1/5 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-studio-4/5 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-studio-1/20 to-studio-4/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-gradient">404</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg" className="gap-2 px-8">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-studio-1 to-studio-3 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-semibold text-xs">PixelForge</span>
        </div>
      </footer>
    </motion.div>
  );
}
