"use client"

import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"

const prizes = [
  { id: 1, name: "Patek Philippe Watch", color: "oklch(0.25 0.05 160)" },
  { id: 2, name: "Adham & Lolo", color: "oklch(0.72 0.15 45)" },
  { id: 3, name: "Mercedes G Class", color: "oklch(0.35 0.05 160)" },
  { id: 4, name: "Le Petite Chef Dinner", color: "oklch(0.82 0.12 50)" },
]

export default function SpinningWheel() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner(null)

    setRotation(0)

    setTimeout(() => {
      // Each segment is exactly 90 degrees (360/4)
      // Segment layout: 0-90°, 90-180°, 180-270°, 270-360°
      // "Adham & Lolo" is at index 1, which is 90-180 degrees
      // We want the pointer (at top, 0°) to land at the center of that segment (135°)
      // So we rotate to: 360 - 135 = 225 degrees (plus full rotations)
      const targetAngle = 225
      const spins = 5
      const totalRotation = spins * 360 + targetAngle

      setRotation(totalRotation)
    }, 50)

    setTimeout(() => {
      setIsSpinning(false)
      setWinner("Adham & Lolo")
    }, 4050)
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-serif text-balance text-black">You&apos;ve correctly identified the murderer!</h1>
        <p className="text-black text-base">Spin the wheel to reveal your gift!</p>
      </div>

      <div className="relative w-full aspect-square max-w-[500px] rounded-full overflow-hidden shadow-2xl">
        {/* Wheel */}
        <div
          className="absolute inset-0 ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: rotation === 0 ? "none" : "transform 4000ms cubic-bezier(0.17, 0.67, 0.12, 0.99)",
          }}
        >
          {prizes.map((prize, index) => {
            const angle = 90 * index
            return (
              <div
                key={prize.id}
                className="absolute inset-0 origin-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)",
                  backgroundColor: prize.color,
                }}
              >
                <div
                  className="absolute left-[62%] top-[25%] w-24"
                  style={{
                    transform: `rotate(45deg)`,
                    transformOrigin: "center",
                  }}
                >
                  <p className="text-white font-semibold text-xs md:text-sm leading-tight text-center text-balance">
                    {prize.name}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-card border-4 border-primary shadow-lg z-10" />

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-accent drop-shadow-lg" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="w-full max-w-xs text-base font-semibold text-white px-6 py-3 rounded-lg border-2 border-gray-300"
          style={{ backgroundColor: '#3b82f6' }}
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
        </button>

        {winner && (
          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-xl md:text-2xl font-serif text-black">🎉 Congratulations! 🎉</div>
            <div className="text-lg md:text-xl font-semibold text-black">You won: {winner}</div>
          </div>
        )}
      </div>
    </div>
  )
}
