export function SiteFooterInteractiveLogotype() {
  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div className="overflow-hidden py-3">
        <p
          className="text-center font-heading text-[clamp(3.5rem,14vw,9rem)] leading-none font-semibold -tracking-widest text-foreground/60"
          aria-label="0verme"
        >
          0verme
        </p>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
