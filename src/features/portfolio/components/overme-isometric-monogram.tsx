"use client"

import { useId } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

const VIEWBOX_WIDTH = 556
const VIEWBOX_HEIGHT = 354
const ZERO_RING =
  "M185 45 247 80v127l-62 37-62-37V80l62-35Zm0 51-30 17v61l30 18 30-18v-61l-30-17Z"
const V_SHAPE = "M287 66h27l35 106 35-106h27l-50 192h-28L287 66Z"

export function OvermeIsometricMonogram() {
  const id = useId().replace(/:/g, "")
  const reducedMotion = useReducedMotion()
  const pointerX = useSpring(useMotionValue(VIEWBOX_WIDTH / 2), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })
  const pointerY = useSpring(useMotionValue(VIEWBOX_HEIGHT / 2), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  return (
    <div
      className="w-full"
      onMouseMove={(event) => {
        if (reducedMotion) return

        const bounds = event.currentTarget.getBoundingClientRect()
        pointerX.set(
          ((event.clientX - bounds.left) / bounds.width) * VIEWBOX_WIDTH
        )
        pointerY.set(
          ((event.clientY - bounds.top) / bounds.height) * VIEWBOX_HEIGHT
        )
      }}
      onMouseLeave={() => {
        pointerX.set(VIEWBOX_WIDTH / 2)
        pointerY.set(VIEWBOX_HEIGHT / 2)
      }}
    >
      <motion.svg
        className="block h-auto w-full touch-manipulation overflow-visible [--grid:color-mix(in_oklab,var(--foreground)_8%,transparent)] [--line:color-mix(in_oklab,var(--foreground)_24%,var(--background))] [--surface:var(--background)]"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
        pointerEvents="all"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        initial="rest"
        whileTap="pressed"
      >
        <defs>
          <pattern
            id={`${id}-hatch`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-1 1 1-1M0 10 10 0M9 11l2-2"
              stroke="var(--grid)"
              strokeWidth="1"
            />
          </pattern>
          <motion.radialGradient
            id={`${id}-light`}
            cx={pointerX}
            cy={pointerY}
            r="190"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--foreground)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </motion.radialGradient>
        </defs>

        <g stroke="var(--grid)" strokeWidth="1" strokeDasharray="3 5">
          <path d="M-25 206 278 31l303 175" />
          <path d="M-25 148 278 323l303-175" />
          <path d="M278 0v354M0 177h556" />
          <path d="m62 354 494-285M0 285 494 0" />
        </g>

        <g
          stroke="var(--grid)"
          strokeWidth="1.25"
          strokeLinejoin="round"
          strokeDasharray="3 4"
        >
          <path d={ZERO_RING} transform="translate(22 -12)" />
          <path d={V_SHAPE} transform="translate(22 -12)" />
          <path d="M185 45 207 33M247 80 269 68M247 207 269 195M185 244 207 232M123 207 145 195M123 80 145 68M185 96 207 84M215 113 237 101M215 174 237 162M185 192 207 180M155 174 177 162M155 113 177 101" />
          <path d="M287 66 309 54M314 66 336 54M349 172 371 160M384 66 406 54M411 66 433 54M361 258 383 246M333 258 355 246" />
        </g>

        <g stroke="var(--line)" strokeWidth="1.25" strokeLinejoin="round">
          <g fill="var(--surface)">
            <path d="M185 45 247 80l22-12-62-35Z" />
            <path d="m247 80 22-12v127l-22 12Z" />
            <path d="m247 207 22-12-62 37-22 12Z" />
            <path d="m215 113 22-12v61l-22 12Z" />
            <path d="m287 66 22-12 46 192-22 12Z" />
            <path d="m411 66 22-12-50 192-22 12Z" />
            <path d="m314 66 22-12 35 106-22 12Z" />
            <path d="m349 172 22-12 35-106-22 12Z" />
          </g>

          <motion.g
            variants={{ rest: { y: 0 }, pressed: { y: 6 } }}
            transition={{
              type: "spring",
              mass: 0.5,
              damping: 18,
              stiffness: 200,
            }}
          >
            <path
              d={ZERO_RING}
              fill="var(--surface)"
              fillRule="evenodd"
              stroke="var(--line)"
            />
            <path
              d="M185 45 247 80 215 113 185 96Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="M185 45 247 80 215 113 185 96Z"
              fill={`url(#${id}-light)`}
              stroke="none"
            />

            <path d={V_SHAPE} fill="var(--surface)" stroke="var(--line)" />
            <path
              d="M247 80 269 68v127l-22 12ZM411 66 433 54 383 246 361 258Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m287 66 27 0 12 27-30 0Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m287 66 27 0 12 27-30 0Z"
              fill={`url(#${id}-light)`}
              stroke="none"
            />
            <path
              d="m384 66 27 0-7 27h-30Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
          </motion.g>
        </g>

        <g fill="var(--foreground)" opacity="0.55">
          <circle cx="185" cy="45" r="2" />
          <circle cx="247" cy="80" r="2" />
          <circle cx="247" cy="207" r="2" />
          <circle cx="123" cy="80" r="2" />
          <circle cx="287" cy="66" r="2" />
          <circle cx="411" cy="66" r="2" />
          <circle cx="361" cy="258" r="2" />
          <circle cx="333" cy="258" r="2" />
        </g>
      </motion.svg>
    </div>
  )
}
