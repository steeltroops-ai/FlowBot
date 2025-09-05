import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ValidationError } from '../../types/ui';

interface ErrorBannerProps {
  errors: ValidationError[];
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  errors,
  isVisible,
  onClose,
  className,
}) => {
  if (errors.length === 0) return null;

  const primaryError = errors[0];
  const hasMultipleErrors = errors.length > 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className={cn(
            'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4',
            className
          )}
        >
          <div className="bg-red-50/90 backdrop-blur-xl border border-red-200/50 rounded-2xl shadow-lg shadow-red-500/10 p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">
                  {primaryError.message}
                </p>
                {hasMultipleErrors && (
                  <p className="text-xs text-red-600 mt-1">
                    +{errors.length - 1} more error
                    {errors.length - 1 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-red-100/50 transition-colors"
                aria-label="Close error banner"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorBanner;
