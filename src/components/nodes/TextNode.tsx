import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import type { TextNodeData } from '../../types/flow';
import { cn } from '../../utils/cn';
import {
  nodeVariants,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';

const TextNode: React.FC<NodeProps<TextNodeData>> = ({
  id,
  data,
  selected,
  dragging,
}) => {
  const displayText = data.text || data.placeholder || 'Enter your message...';
  const isEmpty = !data.text || data.text.trim().length === 0;
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion
    ? getReducedMotionVariants(nodeVariants)
    : nodeVariants;

  // Apply custom styling from settings
  const nodeStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    color: data.textColor || '#1f2937',
    ...(data.customCSS && { style: data.customCSS }),
  };

  const textSizeClass = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }[data.fontSize || 'medium'];

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
        'relative backdrop-blur-md border-2 rounded-xl w-[180px] h-[120px] shadow-elevation-2 transition-all duration-75',
        selected && 'border-primary-500 shadow-elevation-3',
        dragging && 'shadow-elevation-4 opacity-90'
      )}
      style={nodeStyle}
      role="button"
      tabIndex={0}
      aria-label={`Text message node: ${displayText}`}
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
          <div className="w-6 h-6 bg-primary-100/80 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-primary-600" />
          </div>
          <span className="text-xs font-medium text-secondary-700 tracking-tight">
            Text Message
          </span>
        </div>

        {/* Message Content */}
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

      {/* Selection Indicator - Simplified */}
      {selected && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border border-surface-elevated"
          aria-hidden="true"
        />
      )}

      {/* Hidden description for screen readers */}
      <div id={`node-${id}-description`} className="sr-only">
        Text message node containing: {displayText}.
        {isEmpty
          ? 'This node is empty and needs content.'
          : `Message length: ${data.text?.length || 0} characters.`}
        {selected ? ' Currently selected.' : ' Not selected.'}
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TextNode);
