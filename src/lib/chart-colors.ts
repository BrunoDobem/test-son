/** Paleta de gráficos — identidade Sony + Som Livre */
export const CHART = {
  blue: "#0057FF",
  purple: "#7A3FFF",
  cyan: "#00D9FF",
  gray: "#9CA3AF",
  grayLight: "#E5E7EB",
  grayDark: "#6B7280",
  success: "#059669",
  danger: "#DC2626",
  grid: "#E5E7EB",
  axis: "#9CA3AF",
  tooltip: {
    background: "#FFFFFF",
    border: "#E5E7EB",
    label: "#6B7280",
  },
} as const;

export const tooltipStyle = {
  background: CHART.tooltip.background,
  border: `1px solid ${CHART.tooltip.border}`,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};
