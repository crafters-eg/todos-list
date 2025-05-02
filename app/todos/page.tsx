import React from 'react'
import { cn } from "@/lib/utils";

const page = () => {
  return (
    <div className="relative flex min-h-[42.3rem] w-full items-center justify-center bg-background text-foreground dark">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <p className="relative z-20 py-8 text-4xl font-bold  sm:text-7xl">
        Todos list page in progress...
      </p>
    </div>
  )
}

export default page