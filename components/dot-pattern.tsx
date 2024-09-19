import React from 'react'

interface DotPatternProps {
  width?: number
  height?: number
  dotSize?: number
  dotColor?: string
  backgroundColor?: string
  gap?: number
}

export function DotPattern({
  dotSize = 2,
  dotColor = '#1E1234',
  backgroundColor = '#05000D',
  gap = 20,
}: DotPatternProps = {}) {
  const patternSize = gap + dotSize
  
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" aria-hidden="true">
      <svg
        className="w-full h-full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            <rect width={patternSize} height={patternSize} fill={backgroundColor} />
            <circle cx={dotSize / 2} cy={dotSize / 2} r={dotSize / 2} fill={dotColor} />
          </pattern>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fadeGradient)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" mask="url(#fadeMask)" />
      </svg>
    </div>
  )
}