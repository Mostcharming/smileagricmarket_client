import clsx from 'clsx';

interface TypographyProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'heading' | 'intro' | 'subheading' | 'base' | 'normal' | 'small';
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  heading: 'text-3xl md:text-5xl font-bold',
  intro: 'text-2xl md:text-3xl font-bold',
  subheading: 'text-lg md:text-2xl font-semibold',
  base: 'text-sm md:text-base',
  normal: 'text-xs md:text-sm',
  small: 'text-xs',
};

const Typography = ({
  variant = 'base',
  className = '',
  children,
  ...rest
}: TypographyProps) => {
  return (
    <span className={clsx('text-foreground', variantStyles[variant], className)} {...rest}>
      {children}
    </span>
  );
};

export default Typography; 