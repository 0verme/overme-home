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

export function NeutralIsometricPlaceholder() {
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
            <stop stopColor="var(--foreground)" stopOpacity="0.12" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </motion.radialGradient>
        </defs>

        <g stroke="var(--grid)" strokeWidth="1" strokeDasharray="3 5">
          <path d="M-25 206 278 31l303 175" />
          <path d="M-25 148 278 323l303-175" />
          <path d="M278 0v354M0 177h556" />
          <path d="m62 354 494-285M0 285 494 0" />
        </g>

        <g stroke="var(--line)" strokeWidth="1.25" strokeLinejoin="round">
          <g fill="var(--surface)">
            <path d="m126 139 70-40 70 40-70 40-70-40Z" />
            <path d="M126 139v76l70 40v-76l-70-40Z" />
            <path d="M266 139v76l-70 40v-76l70-40Z" />
            <path d="m290 139 70-40 70 40-70 40-70-40Z" />
            <path d="M290 139v76l70 40v-76l-70-40Z" />
            <path d="M430 139v76l-70 40v-76l70-40Z" />
          </g>
          <g fill={`url(#${id}-hatch)`} opacity="0.8">
            <path d="m126 139 70-40 70 40-70 40-70-40Z" />
            <path d="m290 139 70-40 70 40-70 40-70-40Z" />
          </g>
        </g>

        <motion.g
          variants={{ rest: { y: 0 }, pressed: { y: 6 } }}
          transition={{
            type: "spring",
            mass: 0.5,
            damping: 18,
            stiffness: 200,
          }}
          stroke="var(--line)"
          strokeWidth="1.25"
          strokeLinejoin="round"
        >
          <path
            d="m278 42 106 61-106 61-106-61 106-61Z"
            fill="var(--surface)"
          />
          <path d="M172 103v122l106 61V164L172 103Z" fill="var(--surface)" />
          <path d="M384 103v122l-106 61V164l106-61Z" fill="var(--surface)" />
          <path
            d="m278 42 106 61-106 61-106-61 106-61Z"
            fill={`url(#${id}-hatch)`}
          />
          <path
            d="m278 42 106 61-106 61-106-61 106-61Z"
            fill={`url(#${id}-light)`}
          />
          <path d="M172 103h212M278 42v122m-106-61 106 61 106-61" />
          <path
            d="M172 164h212M225 134v122m106-122v122"
            strokeDasharray="2 4"
          />
          <path d="M172 225h212" />
        </motion.g>

        <g fill="var(--foreground)" opacity="0.55">
          <circle cx="278" cy="42" r="2" />
          <circle cx="384" cy="103" r="2" />
          <circle cx="172" cy="103" r="2" />
          <circle cx="278" cy="286" r="2" />
        </g>
      </motion.svg>
    </div>
  )
}
