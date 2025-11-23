import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark' | 'primary';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

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
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium shadow-sm shadow-[#0A0D120D] flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:cursor-not-allowed hover:opacity-90',
        variantClasses[variant],
        sizeClassesMap[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
    </button>
  );
};

export default Button;
