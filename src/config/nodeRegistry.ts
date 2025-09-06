import {
  MessageSquare,
  GitBranch,
  FormInput,
  Globe,
  Clock,
  Shuffle,
  Webhook,
  Mail,
  Database,
  Phone,
  Calendar,
  Upload,
} from 'lucide-react';
import type { NodeTypeConfig, NodeTypeRegistry } from '../types/nodeTypes';

// Comprehensive node registry with all node types
export const nodeRegistry: NodeTypeRegistry = {
  // MESSAGE NODES
  textNode: {
    type: 'textNode',
    label: 'Text Message',
    icon: MessageSquare,
    description: 'Send a text message to the user',
    category: 'message',
    tags: ['text', 'message', 'communication', 'basic'],
    defaultData: {
      type: 'textNode',
      text: 'Hello! How can I help you today?',
      richText: false,
      typing: false,
      typingSpeed: 50,
    },
  },

  // LOGIC NODES
  conditionalNode: {
    type: 'conditionalNode',
    label: 'Conditional Logic',
    icon: GitBranch,
    description: 'Branch conversation based on conditions',
    category: 'logic',
    tags: ['condition', 'branch', 'logic', 'flow', 'if'],
    isNew: true,
    defaultData: {
      type: 'conditionalNode',
      conditions: [
        {
          id: '1',
          field: 'user_input',
          operator: 'contains',
          value: 'yes',
          caseSensitive: false,
        },
      ],
      defaultPath: 'no_match',
    },
  },

  randomNode: {
    type: 'randomNode',
    label: 'Random Choice',
    icon: Shuffle,
    description: 'Randomly select from multiple paths',
    category: 'logic',
    tags: ['random', 'choice', 'variation', 'path'],
    defaultData: {
      type: 'randomNode',
      choices: [
        { id: '1', label: 'Option A', weight: 1, path: 'path_a' },
        { id: '2', label: 'Option B', weight: 1, path: 'path_b' },
      ],
      algorithm: 'uniform',
    },
  },

  // INPUT NODES
  inputNode: {
    type: 'inputNode',
    label: 'User Input',
    icon: FormInput,
    description: 'Collect input from the user',
    category: 'input',
    tags: ['input', 'form', 'collect', 'data', 'user'],
    defaultData: {
      type: 'inputNode',
      inputType: 'text',
      placeholder: 'Enter your response...',
      required: true,
      storageKey: 'user_response',
    },
  },

  emailInputNode: {
    type: 'emailInputNode',
    label: 'Email Input',
    icon: Mail,
    description: 'Collect email address from user',
    category: 'input',
    tags: ['email', 'input', 'validation', 'contact'],
    defaultData: {
      type: 'inputNode',
      inputType: 'email',
      placeholder: 'Enter your email address...',
      required: true,
      storageKey: 'user_email',
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        customMessage: 'Please enter a valid email address',
      },
    },
  },

  phoneInputNode: {
    type: 'phoneInputNode',
    label: 'Phone Input',
    icon: Phone,
    description: 'Collect phone number from user',
    category: 'input',
    tags: ['phone', 'input', 'validation', 'contact'],
    defaultData: {
      type: 'inputNode',
      inputType: 'phone',
      placeholder: 'Enter your phone number...',
      required: true,
      storageKey: 'user_phone',
    },
  },

  dateInputNode: {
    type: 'dateInputNode',
    label: 'Date Input',
    icon: Calendar,
    description: 'Collect date from user',
    category: 'input',
    tags: ['date', 'input', 'calendar', 'schedule'],
    defaultData: {
      type: 'inputNode',
      inputType: 'date',
      placeholder: 'Select a date...',
      required: true,
      storageKey: 'selected_date',
    },
  },

  fileInputNode: {
    type: 'fileInputNode',
    label: 'File Upload',
    icon: Upload,
    description: 'Allow user to upload files',
    category: 'input',
    tags: ['file', 'upload', 'attachment', 'document'],
    isPremium: true,
    defaultData: {
      type: 'inputNode',
      inputType: 'file',
      placeholder: 'Upload a file...',
      required: false,
      storageKey: 'uploaded_file',
    },
  },

  // INTEGRATION NODES
  apiNode: {
    type: 'apiNode',
    label: 'API Request',
    icon: Globe,
    description: 'Make HTTP requests to external APIs',
    category: 'integration',
    tags: ['api', 'http', 'request', 'integration', 'external'],
    isPremium: true,
    defaultData: {
      type: 'apiNode',
      method: 'GET',
      url: 'https://api.example.com/data',
      headers: {
        'Content-Type': 'application/json',
      },
      errorHandling: {
        retries: 3,
        timeout: 5000,
        fallbackMessage: 'Sorry, there was an error processing your request.',
      },
    },
  },

  webhookNode: {
    type: 'webhookNode',
    label: 'Webhook',
    icon: Webhook,
    description: 'Send data to external webhooks',
    category: 'integration',
    tags: ['webhook', 'http', 'post', 'integration', 'notify'],
    isPremium: true,
    defaultData: {
      type: 'webhookNode',
      url: 'https://hooks.example.com/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: '{"message": "{{user_input}}", "timestamp": "{{timestamp}}"}',
      authentication: {
        type: 'none',
      },
    },
  },

  // UTILITY NODES
  delayNode: {
    type: 'delayNode',
    label: 'Delay/Wait',
    icon: Clock,
    description: 'Add delays between messages',
    category: 'utility',
    tags: ['delay', 'wait', 'pause', 'timing', 'flow'],
    defaultData: {
      type: 'delayNode',
      duration: 2,
      unit: 'seconds',
      showProgress: false,
      message: 'Please wait...',
    },
  },

  // ACTION NODES
  emailActionNode: {
    type: 'emailActionNode',
    label: 'Send Email',
    icon: Mail,
    description: 'Send email notifications',
    category: 'action',
    tags: ['email', 'notification', 'send', 'action'],
    isPremium: true,
    defaultData: {
      type: 'actionNode',
      actionType: 'email',
      config: {
        to: '{{user_email}}',
        subject: 'Thank you for your message',
        body: 'We have received your message and will get back to you soon.',
      },
      successMessage: 'Email sent successfully!',
      errorMessage: 'Failed to send email. Please try again.',
    },
  },

  databaseActionNode: {
    type: 'databaseActionNode',
    label: 'Database Action',
    icon: Database,
    description: 'Store or retrieve data from database',
    category: 'action',
    tags: ['database', 'store', 'retrieve', 'data', 'action'],
    isPremium: true,
    defaultData: {
      type: 'actionNode',
      actionType: 'database',
      config: {
        operation: 'insert',
        table: 'conversations',
        data: {
          user_id: '{{user_id}}',
          message: '{{user_input}}',
          timestamp: '{{timestamp}}',
        },
      },
      successMessage: 'Data saved successfully!',
      errorMessage: 'Failed to save data. Please try again.',
    },
  },
};

// Helper functions for node registry
export const getNodeTypeConfig = (type: string): NodeTypeConfig | undefined => {
  return nodeRegistry[type];
};

export const getNodesByCategory = (category: string): NodeTypeConfig[] => {
  return Object.values(nodeRegistry).filter(node => node.category === category);
};

export const getAllNodeTypes = (): NodeTypeConfig[] => {
  return Object.values(nodeRegistry);
};

export const searchNodes = (query: string): NodeTypeConfig[] => {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(nodeRegistry).filter(
    node =>
      node.label.toLowerCase().includes(lowercaseQuery) ||
      node.description.toLowerCase().includes(lowercaseQuery) ||
      node.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Categories configuration
export const nodeCategories = [
  { value: 'all', label: 'All Nodes', count: Object.keys(nodeRegistry).length },
  {
    value: 'message',
    label: 'Messages',
    count: getNodesByCategory('message').length,
  },
  { value: 'logic', label: 'Logic', count: getNodesByCategory('logic').length },
  { value: 'input', label: 'Input', count: getNodesByCategory('input').length },
  {
    value: 'integration',
    label: 'Integrations',
    count: getNodesByCategory('integration').length,
  },
  {
    value: 'utility',
    label: 'Utilities',
    count: getNodesByCategory('utility').length,
  },
  {
    value: 'action',
    label: 'Actions',
    count: getNodesByCategory('action').length,
  },
] as const;
