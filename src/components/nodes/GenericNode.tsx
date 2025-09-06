import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import {
  nodeVariants,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';
import { getNodeTypeConfig } from '../../config/nodeRegistry';

interface GenericNodeProps {
  id: string;
  data: any;
  selected: boolean;
  dragging: boolean;
}

const GenericNode: React.FC<GenericNodeProps> = ({
  id,
  data,
  selected,
  dragging,
}) => {
  const nodeConfig = getNodeTypeConfig(data.type);
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion
    ? getReducedMotionVariants(nodeVariants)
    : nodeVariants;

  if (!nodeConfig) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded-xl">
        <p className="text-red-600 text-sm">Unknown node type: {data.type}</p>
      </div>
    );
  }

  const IconComponent = nodeConfig.icon;
  const displayText = data.text || data.label || nodeConfig.label;
  const isEmpty = !data.text && !data.label;

  // Color scheme mapping for different node types
  const getNodeColorScheme = (nodeType: string) => {
    const colorSchemes = {
      textNode: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        headerColor: 'text-green-700',
      },
      conditionalNode: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        headerColor: 'text-blue-700',
      },
      inputNode: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        headerColor: 'text-purple-700',
      },
      apiNode: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        headerColor: 'text-orange-700',
      },
      webhookNode: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        headerColor: 'text-yellow-700',
      },
      delayNode: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        headerColor: 'text-indigo-700',
      },
      emailActionNode: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        headerColor: 'text-red-700',
      },
      databaseActionNode: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        headerColor: 'text-teal-700',
      },
    };

    return (
      colorSchemes[nodeType as keyof typeof colorSchemes] || {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        headerColor: 'text-gray-700',
      }
    );
  };

  const colorScheme = getNodeColorScheme(data.type);

  // Apply custom styling from settings
  const nodeStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    color: data.textColor || '#1f2937',
    ...(data.customCSS && { style: data.customCSS }),
  };

  const fontSize = data.fontSize || 'medium';
  const textSizeClass =
    {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base',
    }[fontSize as 'small' | 'medium' | 'large'] || 'text-sm';

  const fontWeightClass =
    data.fontWeight === 'bold' ? 'font-bold' : 'font-normal';

  return (
    <motion.div
      variants={variants}
      initial="idle"
      animate={dragging ? 'dragging' : selected ? 'selected' : 'idle'}
      whileHover={!reducedMotion ? 'hover' : undefined}
      whileTap={!reducedMotion ? 'tap' : undefined}
      className={cn(
        'relative backdrop-blur-md border-2 rounded-xl w-[180px] h-[90px] shadow-elevation-2 transition-all duration-75',
        colorScheme.bg,
        colorScheme.border,
        dragging && 'shadow-elevation-4 opacity-90'
      )}
      style={nodeStyle}
      role="button"
      tabIndex={0}
      aria-label={`${nodeConfig.label} node: ${displayText}`}
      aria-selected={selected}
      aria-describedby={`node-${id}-description`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Handle node selection/interaction
        }
      }}
    >
      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-secondary-400 border-2 border-surface-elevated hover:bg-primary-500 transition-colors duration-75"
        style={{ left: -6 }}
        aria-label="Connection input - drag from another node to connect"
      />

      {/* Node Content */}
      <div className="p-3 h-full flex flex-col">
        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-2 drag-handle cursor-move">
          <div
            className={cn(
              'w-5 h-5 rounded-md flex items-center justify-center',
              colorScheme.iconBg
            )}
          >
            <IconComponent className={cn('w-3 h-3', colorScheme.iconColor)} />
          </div>
          <span
            className={cn(
              'text-xs font-medium truncate',
              colorScheme.headerColor
            )}
          >
            {nodeConfig.label}
          </span>
        </div>

        {/* Node Body */}
        <div className="flex-1 flex flex-col justify-center">
          <p
            className={cn(
              'leading-relaxed break-words line-clamp-4',
              textSizeClass,
              fontWeightClass,
              isEmpty ? 'opacity-60 italic' : ''
            )}
            style={{ color: data.textColor || '#1f2937' }}
          >
            {displayText}
          </p>

          {/* Character count for long messages */}
          {data.text && data.text.length > 50 && (
            <div className="text-xs text-secondary-400 mt-1 opacity-75">
              {data.text.length} chars
            </div>
          )}
        </div>
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-secondary-400 border-2 border-surface-elevated hover:bg-primary-500 transition-colors duration-75"
        style={{ right: -6 }}
        aria-label="Connection output - drag to another node to connect"
      />

      {/* Hidden description for screen readers */}
      <div id={`node-${id}-description`} className="sr-only">
        {nodeConfig.label} node containing: {displayText}.
        {isEmpty
          ? 'This node is empty and needs content.'
          : `Content length: ${displayText?.length || 0} characters.`}
        {selected ? ' Currently selected.' : ' Not selected.'}
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(GenericNode);
