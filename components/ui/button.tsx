import clsx from 'clsx';
import { ButtonProps } from '@/types';

const variantClasses: Record<string, string> = {
  light: 'bg-white text-appBlack border border-border',
  dark: 'bg-appBlack text-white border border-appBlack',
  primary: 'bg-primary text-white border border-primary disabled:border-none disabled:bg-border100 disabled:text-foreground100',
};

const sizeClassesMap: Record<string, string> = {
  small: 'py-2.5 px-4',
  medium: 'py-3.5 px-5',
  large: 'py-4.5 px-6',
};

const Button = ({
  variant = 'light',
  className = '',
  icon,
  iconPosition = 'left',
  size = 'small',
  children,
  isLoading = false,
  ...props
}: ButtonProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDisabled = (props as any).disabled || isLoading;

  return (
    <button
      className={clsx(
        'rounded-lg font-medium shadow-sm shadow-[#0A0D120D] flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:cursor-not-allowed hover:opacity-90',
        variantClasses[variant],
        sizeClassesMap[size],
        className
      )}
      {...props}
      disabled={isDisabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center" aria-hidden="true">
          <svg
            className="w-4 h-4 animate-spin text-current"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : (
        icon &&
        iconPosition === "left" && (
          <span className="flex items-center">{icon}</span>
        )
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && !isLoading && (
        <span className="flex items-center">{icon}</span>
      )}
    </button>
  );
};

export default Button;
