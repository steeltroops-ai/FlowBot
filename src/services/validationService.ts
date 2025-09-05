import type {
  FlowNode,
  FlowEdge,
  ValidationResult,
  ValidationError,
} from '../types/flow';

/**
 * Validate the entire flow according to business rules
 */
export function validateFlow(
  nodes: FlowNode[],
  edges: FlowEdge[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // Rule 1: If there are multiple nodes, at most one node can have no outgoing connections
  if (nodes.length > 1) {
    const nodesWithoutOutgoing = nodes.filter(node => {
      return !edges.some(edge => edge.source === node.id);
    });

    if (nodesWithoutOutgoing.length > 1) {
      errors.push({
        id: 'multiple-end-nodes',
        type: 'flow',
        message: `Flow has ${nodesWithoutOutgoing.length} nodes without outgoing connections. Only one end node is allowed.`,
      });
    }
  }

  // Rule 2: All nodes must have valid text content
  nodes.forEach(node => {
    if (node.type === 'textNode') {
      if (!node.data.text || node.data.text.trim().length === 0) {
        errors.push({
          id: `empty-text-${node.id}`,
          type: 'node',
          message: 'Text node cannot be empty',
          nodeId: node.id,
        });
      }
    }
  });

  // Rule 3: Validate edge connections
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode) {
      errors.push({
        id: `invalid-source-${edge.id}`,
        type: 'edge',
        message: 'Edge has invalid source node',
        edgeId: edge.id,
      });
    }

    if (!targetNode) {
      errors.push({
        id: `invalid-target-${edge.id}`,
        type: 'edge',
        message: 'Edge has invalid target node',
        edgeId: edge.id,
      });
    }
  });

  // Rule 4: Check for isolated nodes (nodes with no connections at all)
  if (nodes.length > 1) {
    const isolatedNodes = nodes.filter(node => {
      const hasIncoming = edges.some(edge => edge.target === node.id);
      const hasOutgoing = edges.some(edge => edge.source === node.id);
      return !hasIncoming && !hasOutgoing;
    });

    isolatedNodes.forEach(node => {
      errors.push({
        id: `isolated-node-${node.id}`,
        type: 'node',
        message: 'Node is not connected to the flow',
        nodeId: node.id,
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
}

/**
 * Validate a single node
 */
export function validateNode(node: FlowNode): ValidationResult {
  const errors: ValidationError[] = [];

  switch (node.type) {
    case 'textNode':
      if (!node.data.text || node.data.text.trim().length === 0) {
        errors.push({
          id: `empty-text-${node.id}`,
          type: 'node',
          message: 'Text node cannot be empty',
          nodeId: node.id,
        });
      }

      if (node.data.text && node.data.text.length > 1000) {
        errors.push({
          id: `text-too-long-${node.id}`,
          type: 'node',
          message: 'Text message is too long (max 1000 characters)',
          nodeId: node.id,
        });
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
  };
}

/**
 * Check if a connection is valid before creating an edge
 */
export function isValidConnection(
  sourceNodeId: string,
  targetNodeId: string,
  _nodes: FlowNode[],
  edges: FlowEdge[]
): boolean {
  // Prevent self-connections
  if (sourceNodeId === targetNodeId) {
    return false;
  }

  // Check if source already has an outgoing connection
  const existingOutgoing = edges.find(edge => edge.source === sourceNodeId);
  if (existingOutgoing) {
    return false;
  }

  // Check if this would create a cycle
  if (wouldCreateCycle(sourceNodeId, targetNodeId, edges)) {
    return false;
  }

  return true;
}

/**
 * Check if adding an edge would create a cycle in the flow
 */
function wouldCreateCycle(
  sourceId: string,
  targetId: string,
  edges: FlowEdge[]
): boolean {
  // Use DFS to check if there's already a path from target to source
  const visited = new Set<string>();

  function hasPath(from: string, to: string): boolean {
    if (from === to) return true;
    if (visited.has(from)) return false;

    visited.add(from);

    const outgoingEdges = edges.filter(edge => edge.source === from);
    for (const edge of outgoingEdges) {
      if (hasPath(edge.target, to)) {
        return true;
      }
    }

    return false;
  }

  return hasPath(targetId, sourceId);
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    return 'Flow is valid and ready to save';
  }

  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  let summary = '';
  if (errorCount > 0) {
    summary += `${errorCount} error${errorCount > 1 ? 's' : ''}`;
  }
  if (warningCount > 0) {
    if (summary) summary += ', ';
    summary += `${warningCount} warning${warningCount > 1 ? 's' : ''}`;
  }

  return summary;
}
