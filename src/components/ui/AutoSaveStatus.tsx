import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, Check, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import useFlowStore from '../../store/flowStore';

interface AutoSaveStatusProps {
  className?: string;
}

const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ className }) => {
  const { autoSaveEnabled, isModified, lastAutoSave, lastSaved } =
    useFlowStore();

  const getStatusInfo = () => {
    if (!autoSaveEnabled) {
      return {
        icon: CloudOff,
        text: 'Auto-save off',
        color: 'text-secondary-500',
        bgColor: 'bg-secondary-100/50',
      };
    }

    if (!isModified && (lastSaved || lastAutoSave)) {
      return {
        icon: Check,
        text: 'Saved',
        color: 'text-interactive-success',
        bgColor: 'bg-interactive-success-50/50',
      };
    }

    if (isModified) {
      return {
        icon: Clock,
        text: 'Saving...',
        color: 'text-primary-600',
        bgColor: 'bg-primary-100/50',
      };
    }

    return {
      icon: Cloud,
      text: 'Auto-save on',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100/50',
    };
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium',
          statusInfo.bgColor,
          statusInfo.color,
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={`Auto-save status: ${statusInfo.text}`}
      >
        <motion.div
          animate={
            isModified && autoSaveEnabled ? { rotate: 360 } : { rotate: 0 }
          }
          transition={{
            duration: 2,
            repeat: isModified && autoSaveEnabled ? Infinity : 0,
            ease: 'linear',
          }}
        >
          <IconComponent className="w-3 h-3" />
        </motion.div>

        <span>{statusInfo.text}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoSaveStatus;
