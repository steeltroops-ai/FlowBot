import type {
  FlowNode,
  FlowEdge,
  ValidationResult,
  ValidationError,
} from '../types/flow';

/**
 * Helper function to detect circular dependencies in the flow
 */
function detectCircularDependencies(
  nodes: FlowNode[],
  edges: FlowEdge[]
): string[][] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const circularPaths: string[][] = [];

  function dfs(nodeId: string, path: string[]): void {
    if (recursionStack.has(nodeId)) {
      // Found a cycle - extract the circular part
      const cycleStart = path.indexOf(nodeId);
      if (cycleStart !== -1) {
        circularPaths.push(path.slice(cycleStart));
      }
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    // Find all outgoing edges from this node
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    for (const edge of outgoingEdges) {
      dfs(edge.target, [...path]);
    }

    recursionStack.delete(nodeId);
  }

  // Start DFS from all nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id, []);
    }
  }

  return circularPaths;
}

/**
 * Helper function to get all nodes reachable from start nodes
 */
function getReachableNodes(
  startNodes: FlowNode[],
  edges: FlowEdge[]
): Set<string> {
  const reachable = new Set<string>();
  const queue = [...startNodes.map(node => node.id)];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (reachable.has(currentId)) {
      continue;
    }

    reachable.add(currentId);

    // Add all target nodes of outgoing edges to the queue
    const outgoingEdges = edges.filter(edge => edge.source === currentId);
    for (const edge of outgoingEdges) {
      if (!reachable.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return reachable;
}

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
        message: `"${node.data.text || 'Untitled node'}" is not connected to any other nodes. Connect it to include it in your flow.`,
        nodeId: node.id,
      });
    });
  }

  // Rule 5: Check for circular dependencies
  const circularPaths = detectCircularDependencies(nodes, edges);
  circularPaths.forEach((path, index) => {
    errors.push({
      id: `circular-dependency-${index}`,
      type: 'flow',
      message: `Circular dependency detected: ${path
        .map(nodeId => {
          const node = nodes.find(n => n.id === nodeId);
          return node?.data.text || 'Untitled node';
        })
        .join(' → ')} → ${path[0]}`,
    });
  });

  // Rule 6: Check for unreachable nodes (nodes that can't be reached from start nodes)
  const startNodes = nodes.filter(
    node => !edges.some(edge => edge.target === node.id)
  );

  if (startNodes.length > 0) {
    const reachableNodes = getReachableNodes(startNodes, edges);
    const unreachableNodes = nodes.filter(
      node =>
        !reachableNodes.has(node.id) &&
        !startNodes.some(start => start.id === node.id)
    );

    unreachableNodes.forEach(node => {
      errors.push({
        id: `unreachable-node-${node.id}`,
        type: 'node',
        message: `"${node.data.text || 'Untitled node'}" cannot be reached from the start of your flow. Check your connections.`,
        nodeId: node.id,
      });
    });
  }

  // Rule 7: Check for nodes with excessive text length
  nodes.forEach(node => {
    if (
      node.type === 'textNode' &&
      node.data.text &&
      node.data.text.length > 1000
    ) {
      errors.push({
        id: `text-too-long-${node.id}`,
        type: 'node',
        message: `Text message is too long (${node.data.text.length} characters). Keep messages under 1000 characters for better user experience.`,
        nodeId: node.id,
      });
    }
  });

  // Generate warnings for potential improvements
  const warnings: ValidationError[] = [];

  // Single node flows are valid - no warning needed

  // Warning: Very long flows (potential performance issues)
  if (nodes.length > 50) {
    warnings.push({
      id: 'large-flow-warning',
      type: 'flow',
      message: `Your flow has ${nodes.length} nodes. Large flows may impact performance. Consider breaking it into smaller, focused flows.`,
    });
  }

  // Warning: Nodes with very short text
  nodes.forEach(node => {
    if (
      node.type === 'textNode' &&
      node.data.text &&
      node.data.text.trim().length < 3
    ) {
      warnings.push({
        id: `short-text-${node.id}`,
        type: 'node',
        message: `"${node.data.text}" is very short. Consider adding more descriptive text for better user experience.`,
        nodeId: node.id,
      });
    }
  });

  // Warning: Empty text nodes
  nodes.forEach(node => {
    if (
      node.type === 'textNode' &&
      (!node.data.text || node.data.text.trim().length === 0)
    ) {
      warnings.push({
        id: `empty-text-${node.id}`,
        type: 'node',
        message: 'This text node is empty. Add a message or remove the node.',
        nodeId: node.id,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
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
