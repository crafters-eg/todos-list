import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div className="min-h-screen relative w-full bg-neutral-950 flex flex-col items-center justify-center antialiased px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white to-neutral-400 text-transparent bg-clip-text">
          Organize Your Tasks. <br /> Stay Focused.
        </h1>
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed relative z-10">
          Your modern and minimal todo app to keep life in check. Simple, fast, and built for productivity.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
