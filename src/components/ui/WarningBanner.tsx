import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  errorBannerVariants,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';
import type { ValidationError } from '../../types/ui';

interface WarningBannerProps {
  warnings: ValidationError[];
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

const WarningBanner: React.FC<WarningBannerProps> = ({
  warnings,
  isVisible,
  onClose,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion
    ? getReducedMotionVariants(errorBannerVariants)
    : errorBannerVariants;

  if (warnings.length === 0) return null;

  const primaryWarning = warnings[0];
  const hasMultipleWarnings = warnings.length > 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-full mx-4',
            className
          )}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="bg-amber-50/95 backdrop-blur-xl border border-amber-200/50 rounded-2xl shadow-lg shadow-amber-500/10 p-4">
            <div className="flex items-start space-x-3">
              {/* Warning Icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
              </div>

              {/* Warning Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-amber-900">
                    {hasMultipleWarnings
                      ? 'Flow Suggestions'
                      : 'Flow Suggestion'}
                  </h3>
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-amber-100/50 transition-colors"
                    aria-label="Dismiss warning"
                  >
                    <X className="w-4 h-4 text-amber-600" />
                  </button>
                </div>

                <p className="text-sm text-amber-800 leading-relaxed">
                  {primaryWarning.message}
                </p>

                {hasMultipleWarnings && (
                  <div className="mt-2">
                    <button
                      className="text-xs text-amber-700 hover:text-amber-900 font-medium underline"
                      onClick={() => {
                        // Could expand to show all warnings
                        console.log('All warnings:', warnings);
                      }}
                    >
                      +{warnings.length - 1} more suggestion
                      {warnings.length - 1 !== 1 ? 's' : ''}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar for auto-dismiss */}
            <motion.div
              className="mt-3 h-1 bg-amber-200/30 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-amber-400/60 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningBanner;
