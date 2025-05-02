import { BackgroundBeams } from "@/components/ui/background-beams";
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-68px)] w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Welcome to the todo app!
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem iusto voluptates quia repellendus asperiores facilis et eaque corrupti nemo quasi, quod neque, accusamus libero sit eius vero autem nulla doloribus?
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
