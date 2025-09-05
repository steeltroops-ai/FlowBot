import { Position } from 'reactflow';
import type { FlowNode, TextNodeData } from '../types/flow';
import { generateId } from './idUtils';

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
  data: Record<string, any> = {}
): FlowNode {
  switch (type) {
    case 'textNode':
      return createTextNode(position, data.text);
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

/**
 * Get default node configuration for a given type
 */
export function getDefaultNodeData(type: string): Record<string, any> {
  switch (type) {
    case 'textNode':
      return {
        text: 'Enter your message...',
        placeholder: 'Enter your message...',
      };
    default:
      return {};
  }
}

/**
 * Validate node data structure
 */
export function validateNodeData(type: string, data: any): boolean {
  switch (type) {
    case 'textNode':
      return typeof data === 'object' && typeof data.text === 'string';
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
