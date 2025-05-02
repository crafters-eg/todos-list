import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div className="min-h-screen relative w-full bg-white dark:bg-neutral-950 flex flex-col items-center justify-center antialiased px-4 transition-colors duration-200">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-gray-800 to-black dark:from-white dark:to-neutral-400 text-transparent bg-clip-text transition-all duration-200">
          Tomados: <br /> Organize with Ease
        </h1>
        <p className="text-gray-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed relative z-10 transition-colors duration-200">
          Your modern and minimal task management app. Tomados helps you stay organized, focused, and productive.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
