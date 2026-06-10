import * as React from "react"
import { Tooltip } from "recharts"
import { cn } from "@/lib/utils"

// ── ChartContainer ──────────────────────────────────────────────
export function ChartContainer({ config, className, children }) {
  // Inject CSS vars for chart colors into a style tag
  const cssVars = Object.entries(config || {}).reduce((acc, [key, val]) => {
    if (val.color) acc[`--color-${key}`] = val.color
    return acc
  }, {})

  return (
    <div className={cn("relative", className)} style={cssVars}>
      {children}
    </div>
  )
}

// ── ChartTooltip ────────────────────────────────────────────────
export function ChartTooltip({ content, ...props }) {
  return <Tooltip content={content} {...props} />
}

// ── ChartTooltipContent ─────────────────────────────────────────
export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  nameKey,
  labelFormatter,
}) {
  if (!active || !payload?.length) return null

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div className={cn(
      "rounded-xl border border-border/50 bg-background px-3 py-2.5 shadow-xl text-xs",
      className
    )}>
      {formattedLabel && (
        <p className="mb-1.5 font-semibold text-foreground">{formattedLabel}</p>
      )}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.fill || item.color }}
          />
          <span className="text-muted-foreground">{item.name || nameKey}:</span>
          <span className="font-bold text-foreground ml-auto pl-3">{item.value}</span>
        </div>
      ))}
    </div>
  )
}