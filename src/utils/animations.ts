import type { Variants, Transition } from 'framer-motion';

// Animation timing constants
export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

// Easing curves
export const EASING = {
  easeOut: [0.33, 1, 0.68, 1],
  easeIn: [0.32, 0, 0.67, 0],
  easeInOut: [0.65, 0, 0.35, 1],
  spring: [0.34, 1.56, 0.64, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
} as const;

// Common transitions
export const transitions: Record<string, Transition> = {
  fast: {
    duration: ANIMATION_DURATION.fast,
    ease: EASING.easeOut,
  },
  normal: {
    duration: ANIMATION_DURATION.normal,
    ease: EASING.easeOut,
  },
  slow: {
    duration: ANIMATION_DURATION.slow,
    ease: EASING.easeOut,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  gentleSpring: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
};

// Panel animation variants
export const panelVariants: Variants = {
  hidden: {
    x: 20,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

// Node animation variants
export const nodeVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: '0 8px 32px rgba(0, 122, 255, 0.15)',
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
  selected: {
    scale: 1,
    y: 0,
    boxShadow: '0 0 0 2px rgba(0, 122, 255, 0.3), 0 8px 32px rgba(0, 122, 255, 0.2)',
    transition: transitions.normal,
  },
  dragging: {
    scale: 1.05,
    rotate: 2,
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
    transition: transitions.fast,
  },
};

// Button animation variants
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: transitions.fast,
  },
};

// Sidebar animation variants
export const sidebarVariants: Variants = {
  closed: {
    width: 0,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeIn,
    },
  },
  open: {
    width: 320,
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

// Error banner animation variants
export const errorBannerVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast,
      ease: EASING.easeIn,
    },
  },
};

// Loading animation variants
export const loadingVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: transitions.fast,
  },
};

// Stagger animation for lists
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.normal,
  },
};

// Edge drawing animation
export const edgeVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 0.8,
        ease: EASING.easeOut,
      },
      opacity: {
        duration: 0.3,
        ease: EASING.easeOut,
      },
    },
  },
};

// Utility function to get reduced motion variants
export const getReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        transition: {
          duration: 0.01,
        },
      };
    } else {
      reducedVariants[key] = variant;
    }
  });
  
  return reducedVariants;
};

// Hook to check for reduced motion preference
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
