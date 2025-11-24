export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export interface SelectOptions {
  label?: string;
  value?: unknown;
  icon?: React.ReactNode;
  color?: string;
}