import { Position } from 'reactflow';
import type { FlowNode, TextNodeData } from '../types/flow';
import { generateId } from './idUtils';
import { getNodeTypeConfig } from '../config/nodeRegistry';

/**
 * Create a new text node with default properties
 */
export function createTextNode(
  position: { x: number; y: number },
  text: string = 'Enter your message...'
): FlowNode {
  return {
    id: generateId(),
    type: 'textNode',
    position,
    data: {
      text,
      placeholder: 'Enter your message...',
    } as TextNodeData,
    dragHandle: '.drag-handle',
    style: {
      width: 200,
      minHeight: 80,
    },
  };
}

/**
 * Create a node at a specific position with custom data
 */
export function createNodeAtPosition(
  type: string,
  position: { x: number; y: number },
  data: Record<string, unknown> = {}
): FlowNode {
  const nodeConfig = getNodeTypeConfig(type);

  if (!nodeConfig) {
    throw new Error(`Unknown node type: ${type}`);
  }

  // For textNode, use the specialized function
  if (type === 'textNode') {
    return createTextNode(
      position,
      typeof data.text === 'string' ? data.text : undefined
    );
  }

  // For all other node types, create a generic node
  return {
    id: generateId(),
    type: type,
    position,
    data: {
      ...nodeConfig.defaultData,
      ...data,
      type: type,
    },
    dragHandle: '.drag-handle',
    style: {
      width: 180,
      minHeight: 90,
    },
  };
}

/**
 * Get default node configuration for a given type
 */
export function getDefaultNodeData(type: string): Record<string, unknown> {
  const nodeConfig = getNodeTypeConfig(type);
  return nodeConfig?.defaultData || {};
}

/**
 * Validate node data structure
 */
export function validateNodeData(type: string, data: unknown): boolean {
  switch (type) {
    case 'textNode':
      return (
        typeof data === 'object' &&
        data !== null &&
        'text' in data &&
        typeof (data as { text: unknown }).text === 'string'
      );
    default:
      return true;
  }
}

/**
 * Get node handle positions based on type
 */
export function getNodeHandles(type: string) {
  switch (type) {
    case 'textNode':
      return {
        source: Position.Right,
        target: Position.Left,
      };
    default:
      return {
        source: Position.Right,
        target: Position.Left,
      };
  }
}
