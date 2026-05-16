import { IconProps } from "@/types";

export const LogoutIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
    <path d="M21 4v16" />
  </svg>
);