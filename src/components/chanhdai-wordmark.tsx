export function ChanhDaiWordmark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 72"
      role="img"
      aria-label="0verme"
      {...props}
    >
      <text
        x="0"
        y="58"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        fontSize="56"
        fontWeight="700"
        letterSpacing="-3"
      >
        0verme
      </text>
    </svg>
  )
}

export function getWordmarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 72"><text x="0" y="58" fill="#09090b" font-family="system-ui,sans-serif" font-size="56" font-weight="700" letter-spacing="-3">0verme</text></svg>`
}
