import type { Node } from 'reactflow';

// Core flow types
export interface FlowData {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt: string;
  updatedAt: string;
}

// Extended ReactFlow node with our custom data
export interface FlowNode extends Node {
  type: 'textNode';
  data: TextNodeData;
}

// Extended ReactFlow edge with our custom data
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: 'default';
  animated?: boolean;
}

// Node data types
export interface TextNodeData {
  text: string;
  placeholder?: string;

  // Enhanced properties for comprehensive settings
  richText?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  fontWeight?: 'normal' | 'bold';
  delay?: number;
  typing?: boolean;
  typingSpeed?: number;
  conditions?: Array<{
    id: string;
    field: string;
    operator: string;
    value: string;
    action: string;
  }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  description?: string;
  tags?: string[];
  notes?: string;
  customCSS?: string;
  customData?: Record<string, any>;
}

// Node configuration for extensibility
export interface NodeConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultData: Record<string, unknown>;
  settingsComponent: React.ComponentType<NodeSettingsProps>;
  validationRules: ValidationRule[];
}

export interface NodeSettingsProps {
  nodeId: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  id: string;
  type: 'flow' | 'node' | 'edge';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationWarning {
  id: string;
  type: 'flow' | 'node' | 'edge';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  validate: (data: unknown, context?: unknown) => ValidationError | null;
}

// Flow metadata for persistence
export interface FlowMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}

// Flow operations
export interface FlowOperations {
  addNode: (node: FlowNode) => void;
  updateNode: (id: string, data: Partial<FlowNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: FlowEdge) => void;
  deleteEdge: (id: string) => void;
  validateFlow: () => ValidationResult;
  saveFlow: () => Promise<string>;
  loadFlow: (flowId: string) => Promise<void>;
}

// History management
export interface HistoryState {
  past: FlowData[];
  present: FlowData;
  future: FlowData[];
}

export interface HistoryOperations {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}
