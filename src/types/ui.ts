// UI state types
export interface UIState {
  // Selection state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Panel state
  panelMode: PanelMode;
  isPanelOpen: boolean;

  // Interaction state
  isDragging: boolean;
  draggedNodeType: string | null;

  // Error state
  validationErrors: ValidationError[];
  showErrorBanner: boolean;

  // Loading state
  isLoading: boolean;
  loadingMessage?: string;
}

export type PanelMode = 'nodes' | 'settings' | 'properties';

export interface ValidationError {
  id: string;
  message: string;
  type: 'error' | 'warning';
}

// UI operations
export interface UIOperations {
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setPanelMode: (mode: PanelMode) => void;
  togglePanel: () => void;
  setDragState: (isDragging: boolean, nodeType?: string) => void;
  showErrors: (errors: ValidationError[]) => void;
  clearErrors: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Animation types
export interface AnimationVariants {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  hover?: Record<string, unknown>;
  tap?: Record<string, unknown>;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Responsive breakpoints
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}
