export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      {...props}
    >
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <path
        d="M32 10c11 0 19 8 19 19v6c0 11-8 19-19 19S13 46 13 35v-6c0-11 8-19 19-19Z"
        stroke="var(--background)"
        strokeWidth="6"
      />
      <path
        d="m25 42 14-20"
        stroke="var(--background)"
        strokeLinecap="round"
        strokeWidth="5"
      />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="14" fill="#09090b"/><path d="M32 10c11 0 19 8 19 19v6c0 11-8 19-19 19S13 46 13 35v-6c0-11 8-19 19-19Z" stroke="#fafafa" stroke-width="6"/><path d="m25 42 14-20" stroke="#fafafa" stroke-linecap="round" stroke-width="5"/></svg>`
}
