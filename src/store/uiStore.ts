import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PanelMode, ValidationError } from '../types/ui';

interface UIStore {
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
  validationWarnings: ValidationError[];
  showErrorBanner: boolean;
  showWarningBanner: boolean;
  isValidating: boolean;
  lastValidationTime: number | null;

  // Loading state
  isLoading: boolean;
  loadingMessage: string | null;

  // Actions
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setPanelMode: (mode: PanelMode) => void;
  togglePanel: () => void;
  setDragState: (isDragging: boolean, nodeType?: string) => void;
  showErrors: (errors: ValidationError[]) => void;
  showWarnings: (warnings: ValidationError[]) => void;
  clearErrors: () => void;
  clearWarnings: () => void;
  setValidationState: (isValidating: boolean) => void;
  setLoading: (isLoading: boolean, message?: string) => void;

  // Computed getters
  get hasSelection(): boolean;
  get shouldShowNodesPanel(): boolean;
  get shouldShowSettingsPanel(): boolean;
  get shouldShowPropertiesPanel(): boolean;
}

const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedNodeId: null,
      selectedEdgeId: null,
      panelMode: 'nodes',
      isPanelOpen: true,
      isDragging: false,
      draggedNodeType: null,
      validationErrors: [],
      validationWarnings: [],
      showErrorBanner: false,
      showWarningBanner: false,
      isValidating: false,
      lastValidationTime: null,
      isLoading: false,
      loadingMessage: null,

      // Selection actions
      selectNode: id => {
        set({
          selectedNodeId: id,
          selectedEdgeId: null, // Clear edge selection when selecting node
          panelMode: id ? 'settings' : 'nodes',
        });
      },

      selectEdge: id => {
        set({
          selectedEdgeId: id,
          selectedNodeId: null, // Clear node selection when selecting edge
          panelMode: 'nodes', // Edges don't have settings panel yet
        });
      },

      // Panel actions
      setPanelMode: mode => {
        set({ panelMode: mode });
      },

      togglePanel: () => {
        set(state => ({ isPanelOpen: !state.isPanelOpen }));
      },

      // Drag state actions
      setDragState: (isDragging, nodeType) => {
        set({
          isDragging,
          draggedNodeType: nodeType || null,
        });
      },

      // Error handling actions
      showErrors: errors => {
        set({
          validationErrors: errors,
          showErrorBanner: errors.length > 0,
        });

        // Auto-hide error banner after 5 seconds
        if (errors.length > 0) {
          setTimeout(() => {
            get().clearErrors();
          }, 5000);
        }
      },

      showWarnings: warnings => {
        set({
          validationWarnings: warnings,
          showWarningBanner: warnings.length > 0,
          lastValidationTime: Date.now(),
        });

        // Auto-hide warnings after 8 seconds
        if (warnings.length > 0) {
          setTimeout(() => {
            get().clearWarnings();
          }, 8000);
        }
      },

      clearErrors: () => {
        set({
          validationErrors: [],
          showErrorBanner: false,
        });
      },

      clearWarnings: () => {
        set({
          validationWarnings: [],
          showWarningBanner: false,
        });
      },

      setValidationState: isValidating => {
        set({
          isValidating,
          lastValidationTime: isValidating ? null : Date.now(),
        });
      },

      // Loading state actions
      setLoading: (isLoading, message) => {
        set({
          isLoading,
          loadingMessage: message || null,
        });
      },

      // Computed getters
      get hasSelection() {
        const { selectedNodeId, selectedEdgeId } = get();
        return selectedNodeId !== null || selectedEdgeId !== null;
      },

      get shouldShowNodesPanel() {
        const { panelMode, isPanelOpen } = get();
        return isPanelOpen && panelMode === 'nodes';
      },

      get shouldShowSettingsPanel() {
        const { panelMode, isPanelOpen, selectedNodeId } = get();
        return (
          isPanelOpen && panelMode === 'settings' && selectedNodeId !== null
        );
      },

      get shouldShowPropertiesPanel() {
        const { panelMode, isPanelOpen } = get();
        return isPanelOpen && panelMode === 'properties';
      },
    }),
    {
      name: 'ui-store',
    }
  )
);

export default useUIStore;
