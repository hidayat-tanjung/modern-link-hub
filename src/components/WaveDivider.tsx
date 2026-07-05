interface WaveDividerProps {
  className?: string;
  fill?: string;
  flip?: boolean;
}

export function WaveDivider({ className = "", fill = "var(--background)", flip = false }: WaveDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative block w-full h-[60px] sm:h-[80px] md:h-[100px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C120,80 240,100 360,80 C480,60 600,20 720,40 C840,60 960,100 1080,80 C1200,60 1320,20 1440,40 L1440,120 L0,120 Z"
          fill={fill}
        />
        <path
          d="M0,60 C160,100 320,80 480,60 C640,40 800,80 960,60 C1120,40 1280,80 1440,60 L1440,120 L0,120 Z"
          fill={fill}
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
