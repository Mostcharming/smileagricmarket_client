import { SelectOptions } from "./shared.types";

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
  variant?: "v1" | "v2";
  className?: string;
  options?: SelectOptions[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  emptyState?: string;
  defaultValue?: string;
  dropdownPosition?: "left" | "right";
  minWidth?: string | number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
  loadMoreLoading?: boolean;
  label?: string;
  labelClassName?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  bottomText?: string;
  bottomClassName?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark' | 'primary';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  isLoading?: boolean;
}