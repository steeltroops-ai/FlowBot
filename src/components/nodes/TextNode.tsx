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

  return (
    <motion.div
      variants={variants}
      initial="idle"
      animate={dragging ? 'dragging' : selected ? 'selected' : 'idle'}
      whileHover={!reducedMotion ? 'hover' : undefined}
      whileTap={!reducedMotion ? 'tap' : undefined}
      className={cn(
        'relative bg-surface-elevated backdrop-blur-md border border-surface-border rounded-2xl min-w-[200px] max-w-[280px] shadow-node-default transition-all duration-200',
        selected &&
          'border-primary-500/60 bg-primary-50/95 shadow-node-selected',
        dragging && 'shadow-node-dragging scale-105'
      )}
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
        className="w-3 h-3 bg-secondary-400 border-2 border-surface-elevated hover:bg-primary-500 hover:scale-110 transition-all duration-200 shadow-elevation-1"
        style={{ left: -6 }}
        aria-label="Connection input - drag from another node to connect"
      />

      {/* Node Content */}
      <div className="p-4">
        {/* Node Header */}
        <div className="flex items-center space-x-3 mb-4 drag-handle cursor-move">
          <div className="w-8 h-8 bg-primary-100/80 rounded-xl flex items-center justify-center shadow-elevation-1">
            <MessageSquare className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-sm font-medium text-secondary-700 tracking-tight">
            Text Message
          </span>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <p
            className={cn(
              'text-sm leading-relaxed break-words font-normal',
              isEmpty ? 'text-secondary-400 italic' : 'text-secondary-700'
            )}
          >
            {displayText}
          </p>

          {/* Character count for long messages */}
          {data.text && data.text.length > 100 && (
            <div className="text-xs text-secondary-400 pt-2 mt-2 border-t border-surface-divider">
              {data.text.length} characters
            </div>
          )}
        </div>
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-secondary-400 border-2 border-surface-elevated hover:bg-primary-500 hover:scale-110 transition-all duration-200 shadow-elevation-1"
        style={{ right: -6 }}
        aria-label="Connection output - drag to another node to connect"
      />

      {/* Selection Indicator */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 rounded-full border-2 border-surface-elevated shadow-elevation-3"
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
