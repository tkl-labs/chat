import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'outline';
type Size = 'default' | 'sm' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) => {
  let base = 'flex items-center justify-center gap-2 rounded-md font-medium transition-colors ';
  let sizeStyle = '';
  let variantStyle = '';
  let disabledStyle = '';

  // Size
  switch (size) {
    case 'sm':
      sizeStyle = 'py-2 px-3 text-sm ';
      break;
    case 'lg':
      sizeStyle = 'py-4 px-6 text-lg ';
      break;
    default:
      sizeStyle = 'py-3 px-4 ';
  }

  // Variant
  switch (variant) {
    case 'outline':
      variantStyle =
        'border border-[var(--border-color)] hover:border-transparent hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)] ';
      break;
    default:
      variantStyle =
        'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 ';
  }

  // Disabled
  if (disabled) {
    disabledStyle =
      'opacity-50 cursor-not-allowed pointer-events-none ';
  } else {
    base += 'cursor-pointer ';
  }

  return (
    <button
      className={`${base}${sizeStyle}${variantStyle}${disabledStyle}${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
