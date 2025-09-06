import type { LucideIcon } from 'lucide-react';

export type NodeCategory =
  | 'message'
  | 'logic'
  | 'input'
  | 'integration'
  | 'utility'
  | 'action';

export interface BaseNodeData {
  // Common properties for all nodes
  id: string;
  type: string;
  label: string;
  description?: string;
  tags?: string[];
  notes?: string;

  // Styling
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  fontWeight?: 'normal' | 'bold';

  // Behavior
  delay?: number;

  // Validation
  validation?: {
    required?: boolean;
    customMessage?: string;
  };

  // Advanced
  customCSS?: string;
  customData?: Record<string, any>;
}

// Text Message Node
export interface TextNodeData extends BaseNodeData {
  type: 'textNode';
  text: string;
  richText?: boolean;
  typing?: boolean;
  typingSpeed?: number;
}

// Conditional Logic Node
export interface ConditionalNodeData extends BaseNodeData {
  type: 'conditionalNode';
  conditions: Array<{
    id: string;
    field: string;
    operator:
      | 'equals'
      | 'not_equals'
      | 'contains'
      | 'not_contains'
      | 'greater_than'
      | 'less_than'
      | 'exists'
      | 'not_exists';
    value: string;
    caseSensitive?: boolean;
  }>;
  defaultPath?: string;
}

// Input Collection Node
export interface InputNodeData extends BaseNodeData {
  type: 'inputNode';
  inputType: 'text' | 'number' | 'email' | 'phone' | 'date' | 'choice' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  choices?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  storageKey?: string;
}

// API Integration Node
export interface ApiNodeData extends BaseNodeData {
  type: 'apiNode';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: string;
  responseMapping?: Record<string, string>;
  errorHandling?: {
    retries?: number;
    timeout?: number;
    fallbackMessage?: string;
  };
}

// Delay/Wait Node
export interface DelayNodeData extends BaseNodeData {
  type: 'delayNode';
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours';
  showProgress?: boolean;
  message?: string;
}

// Random/Choice Node
export interface RandomNodeData extends BaseNodeData {
  type: 'randomNode';
  choices: Array<{
    id: string;
    label: string;
    weight?: number;
    path: string;
  }>;
  algorithm: 'uniform' | 'weighted';
}

// Webhook Node
export interface WebhookNodeData extends BaseNodeData {
  type: 'webhookNode';
  url: string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload?: string;
  authentication?: {
    type: 'none' | 'bearer' | 'basic' | 'api_key';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
}

// Action Node (for external actions)
export interface ActionNodeData extends BaseNodeData {
  type: 'actionNode';
  actionType: 'email' | 'sms' | 'notification' | 'database' | 'file' | 'custom';
  config: Record<string, any>;
  successMessage?: string;
  errorMessage?: string;
}

// Union type for all node data types
export type NodeData =
  | TextNodeData
  | ConditionalNodeData
  | InputNodeData
  | ApiNodeData
  | DelayNodeData
  | RandomNodeData
  | WebhookNodeData
  | ActionNodeData;

// Node type configuration for the nodes panel
export interface NodeTypeConfig {
  type: string;
  label: string;
  icon: LucideIcon;
  description: string;
  category: NodeCategory;
  tags: string[];
  isNew?: boolean;
  isPremium?: boolean;
  defaultData: Partial<NodeData>;
}

// Node type registry
export interface NodeTypeRegistry {
  [key: string]: NodeTypeConfig;
}
