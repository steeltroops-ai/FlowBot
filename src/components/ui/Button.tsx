import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import {
  buttonVariants as animationVariants,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 shadow-elevation-2 shadow-primary-500/25',
        secondary:
          'bg-glass-white-80 text-surface-700 hover:bg-glass-white-90 border border-glass-white-30 backdrop-blur-lg hover:-translate-y-0.5 hover:shadow-glass-md transition-all duration-150 ease-out-cubic',
        ghost:
          'hover:bg-glass-white-10 text-surface-600 hover:text-surface-700 transition-all duration-150 ease-out-cubic',
        danger:
          'bg-interactive-danger-500 text-white hover:bg-interactive-danger-600 shadow-elevation-2 shadow-interactive-danger-500/25',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      children,
      disabled,
      onClick,
      type,
      ...props
    },
    ref
  ) => {
    // Extract HTML button props to avoid conflicts with Framer Motion
    const {
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onAnimationStart: _onAnimationStart,
      onAnimationEnd: _onAnimationEnd,
      onAnimationIteration: _onAnimationIteration,
      ...motionProps
    } = props;

    // Suppress unused variable warnings for extracted props
    void _onDrag;
    void _onDragStart;
    void _onDragEnd;
    void _onAnimationStart;
    void _onAnimationEnd;
    void _onAnimationIteration;

    const reducedMotion = useReducedMotion();
    const variants = reducedMotion
      ? getReducedMotionVariants(animationVariants)
      : animationVariants;

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        onClick={onClick}
        type={type}
        variants={variants}
        initial="idle"
        whileHover={!reducedMotion ? 'hover' : undefined}
        whileTap={!reducedMotion ? 'tap' : undefined}
        {...motionProps}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
