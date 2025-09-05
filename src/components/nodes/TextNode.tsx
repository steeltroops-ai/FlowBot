import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import type { TextNodeData } from '../../types/flow';
import { cn } from '../../utils/cn';

const TextNode: React.FC<NodeProps<TextNodeData>> = ({
  id,
  data,
  selected,
  dragging,
}) => {
  const displayText = data.text || data.placeholder || 'Enter your message...';
  const isEmpty = !data.text || data.text.trim().length === 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'relative bg-white/80 backdrop-blur-md border-2 rounded-2xl shadow-lg shadow-black/10 min-w-48 max-w-64',
        selected
          ? 'border-blue-500 shadow-xl shadow-blue-500/20'
          : 'border-white/30 hover:border-white/50',
        dragging && 'shadow-2xl shadow-black/20'
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
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
        style={{ left: -6 }}
        aria-label="Connection input - drag from another node to connect"
      />

      {/* Node Content */}
      <div className="p-4">
        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-3 drag-handle cursor-move">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-600">
            Text Message
          </span>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          <p
            className={cn(
              'text-sm leading-relaxed break-words',
              isEmpty ? 'text-gray-400 italic' : 'text-gray-900'
            )}
          >
            {displayText}
          </p>

          {/* Character count for long messages */}
          {data.text && data.text.length > 100 && (
            <div className="text-xs text-gray-400 pt-1 border-t border-gray-200/50">
              {data.text.length} characters
            </div>
          )}
        </div>
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
        style={{ right: -6 }}
        aria-label="Connection output - drag to another node to connect"
      />

      {/* Selection Indicator */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
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
