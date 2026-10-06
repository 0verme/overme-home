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
const O_RING =
  "M128 56 168 79v144l-40 23-40-23V79l40-23ZM128 91l-20 12v96l20 12 20-12v-96l-20-12Z"
const V_SHAPE = "M188 56h20l20 122 20-122h20l-31 190h-18L188 56Z"
const E_SHAPE = "M288 56h80v20h-60v66h48v18h-48v66h60v20h-80Z"
const R_SHAPE =
  "M388 56h60l20 20v58l-20 20 20 92h-22l-18-92h-20v92h-20V56ZM408 76h30l10 10v38l-10 10h-30Z"

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
        whileTap={reducedMotion ? undefined : "pressed"}
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
          <path d={O_RING} transform="translate(18 -10)" />
          <path d={V_SHAPE} transform="translate(18 -10)" />
          <path d={E_SHAPE} transform="translate(18 -10)" />
          <path d={R_SHAPE} transform="translate(18 -10)" />
          <path d="M128 56 146 46M168 79 186 69M168 223 186 213M128 246 146 236M88 223 106 213M88 79 106 69M128 91 146 81M148 103 166 93M148 199 166 189M128 211 146 201M108 199 126 189M108 103 126 93" />
          <path d="M188 56 206 46M208 56 226 46M228 178 246 168M248 56 266 46M268 56 286 46M237 246 255 236M219 246 237 236" />
          <path d="M288 56 306 46M368 56 386 46M368 76 386 66M356 142 374 132M356 160 374 150M368 226 386 216M368 246 386 236M288 246 306 236" />
          <path d="M388 56 406 46M448 56 466 46M468 76 486 66M468 134 486 124M448 154 466 144M468 246 486 236M446 246 464 236M408 246 426 236M388 246 406 236" />
        </g>

        <g stroke="var(--line)" strokeWidth="1.25" strokeLinejoin="round">
          <g fill="var(--surface)">
            <path d="M128 56 168 79l18-10-40-23Z" />
            <path d="m168 79 18-10v144l-18 10Z" />
            <path d="m168 223 18-10-40 23-18 10Z" />
            <path d="m108 103 18-10v96l-18 10Z" />

            <path d="m188 56 18-10h20l-18 10Z" />
            <path d="m248 56 18-10h20l-18 10Z" />
            <path d="m268 56 18-10-31 190-18 10Z" />
            <path d="m208 56 18-10 20 122-18 10Z" />

            <path d="m288 56 18-10h80l-18 10Z" />
            <path d="m368 56 18-10v20l-18 10Z" />
            <path d="m308 142 18-10h48l-18 10Z" />
            <path d="m356 142 18-10v18l-18 10Z" />
            <path d="m308 226 18-10h60l-18 10Z" />
            <path d="m368 226 18-10v20l-18 10Z" />

            <path d="m388 56 18-10h60l-18 10Z" />
            <path d="m448 56 18-10 20 20-18 10Z" />
            <path d="m468 76 18-10v58l-18 10Z" />
            <path d="m448 154 18-10 20 92-18 10Z" />
            <path d="m446 246 18-10h22l-18 10Z" />
            <path d="m408 76 18-10v58l-18 10Z" />
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
              d={O_RING}
              fill="var(--surface)"
              fillRule="evenodd"
              stroke="var(--line)"
            />
            <path
              d="M128 56 168 79 148 103 128 91Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="M128 56 168 79 148 103 128 91Z"
              fill={`url(#${id}-light)`}
              stroke="none"
            />

            <path d={V_SHAPE} fill="var(--surface)" stroke="var(--line)" />
            <path
              d="m268 56 18-10-31 190-18 10Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m188 56 20 0 10 22-20 0Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m188 56 20 0 10 22-20 0Z"
              fill={`url(#${id}-light)`}
              stroke="none"
            />

            <path d={E_SHAPE} fill="var(--surface)" stroke="var(--line)" />
            <path
              d="m308 142 18-10h48l-18 10Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m368 56 18-10v20l-18 10Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m368 56 18-10v20l-18 10Z"
              fill={`url(#${id}-light)`}
              stroke="none"
            />

            <path
              d={R_SHAPE}
              fill="var(--surface)"
              fillRule="evenodd"
              stroke="var(--line)"
            />
            <path
              d="m448 56 18-10 20 20-18 10Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m448 154 18-10 20 92-18 10Z"
              fill={`url(#${id}-hatch)`}
              stroke="none"
            />
            <path
              d="m448 154 18-10 20 92-18 10Z"
              fill={`url(#${id}-light)`}
              stroke="none"
            />
          </motion.g>
        </g>

        <g fill="var(--foreground)" opacity="0.55">
          <circle cx="128" cy="56" r="2" />
          <circle cx="168" cy="79" r="2" />
          <circle cx="168" cy="223" r="2" />
          <circle cx="88" cy="79" r="2" />

          <circle cx="188" cy="56" r="2" />
          <circle cx="268" cy="56" r="2" />
          <circle cx="237" cy="246" r="2" />
          <circle cx="219" cy="246" r="2" />

          <circle cx="288" cy="56" r="2" />
          <circle cx="368" cy="56" r="2" />
          <circle cx="356" cy="142" r="2" />
          <circle cx="368" cy="246" r="2" />
          <circle cx="288" cy="246" r="2" />

          <circle cx="388" cy="56" r="2" />
          <circle cx="468" cy="76" r="2" />
          <circle cx="468" cy="246" r="2" />
          <circle cx="446" cy="246" r="2" />
          <circle cx="388" cy="246" r="2" />
        </g>
      </motion.svg>
    </div>
  )
}
