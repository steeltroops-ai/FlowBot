import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, Check, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import useFlowStore from '../../store/flowStore';

interface AutoSaveStatusProps {
  className?: string;
}

const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ className }) => {
  const { 
    autoSaveEnabled, 
    isModified, 
    lastAutoSave, 
    lastSaved 
  } = useFlowStore();

  const getStatusInfo = () => {
    if (!autoSaveEnabled) {
      return {
        icon: CloudOff,
        text: 'Auto-save disabled',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100/50',
      };
    }

    if (!isModified && (lastSaved || lastAutoSave)) {
      return {
        icon: Check,
        text: 'All changes saved',
        color: 'text-green-600',
        bgColor: 'bg-green-100/50',
      };
    }

    if (isModified) {
      return {
        icon: Clock,
        text: 'Saving changes...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100/50',
      };
    }

    return {
      icon: Cloud,
      text: 'Auto-save enabled',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100/50',
    };
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  const formatLastSaved = () => {
    const timestamp = lastAutoSave || lastSaved;
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const lastSavedText = formatLastSaved();

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
          animate={isModified && autoSaveEnabled ? { rotate: 360 } : { rotate: 0 }}
          transition={{ 
            duration: 2, 
            repeat: isModified && autoSaveEnabled ? Infinity : 0,
            ease: 'linear'
          }}
        >
          <IconComponent className="w-3 h-3" />
        </motion.div>
        
        <div className="flex flex-col">
          <span>{statusInfo.text}</span>
          {lastSavedText && (
            <span className="text-xs opacity-75">
              Last saved {lastSavedText}
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutoSaveStatus;
