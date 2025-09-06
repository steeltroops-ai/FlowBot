import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Connection, NodeChange, EdgeChange } from 'reactflow';
import type {
  FlowNode,
  FlowEdge,
  FlowData,
  ValidationResult,
} from '../types/flow';
import { validateFlow } from '../services/validationService';
import { saveFlowData, loadFlowData } from '../services/persistenceService';
import { generateId } from '../utils/idUtils';

interface FlowStore {
  // Core flow data
  nodes: FlowNode[];
  edges: FlowEdge[];

  // Flow metadata
  flowId: string;
  flowName: string;
  isModified: boolean;
  lastSaved: string | null;

  // Auto-save settings
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in milliseconds
  lastAutoSave: string | null;

  // History state
  history: {
    past: { nodes: FlowNode[]; edges: FlowEdge[] }[];
    future: { nodes: FlowNode[]; edges: FlowEdge[] }[];
  };

  // Actions
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node operations
  addNode: (node: Omit<FlowNode, 'id'>) => void;
  updateNode: (id: string, data: Partial<FlowNode['data']>) => void;
  deleteNode: (id: string) => void;

  // Edge operations
  addEdgeCustom: (edge: Omit<FlowEdge, 'id'>) => void;
  deleteEdge: (id: string) => void;

  // Flow operations
  validateFlow: () => ValidationResult;
  saveFlow: () => Promise<string>;
  loadFlow: (flowId: string) => Promise<void>;
  createNewFlow: (name?: string) => void;
  updateFlowName: (name: string) => void;

  // Auto-save operations
  enableAutoSave: (interval?: number) => void;
  disableAutoSave: () => void;
  toggleAutoSave: () => void;
  setAutoSaveInterval: (interval: number) => void;
  triggerAutoSave: () => Promise<void>;

  // Export/Import operations
  exportFlow: () => Promise<string>;
  importFlow: (jsonString: string) => Promise<void>;

  // History operations
  pushToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Utility
  getNodeById: (id: string) => FlowNode | undefined;
  getEdgeById: (id: string) => FlowEdge | undefined;
}

const useFlowStore = create<FlowStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      flowId: generateId(),
      flowName: 'Untitled Flow',
      isModified: false,
      lastSaved: null,
      autoSaveEnabled: true,
      autoSaveInterval: 30000, // 30 seconds
      lastAutoSave: null,
      history: {
        past: [],
        future: [],
      },

      // Core ReactFlow handlers
      setNodes: nodes => set({ nodes, isModified: true }),
      setEdges: edges => set({ edges, isModified: true }),

      onNodesChange: changes => {
        const { nodes } = get();
        const newNodes = applyNodeChanges(changes, nodes) as FlowNode[];
        get().pushToHistory();
        set({ nodes: newNodes, isModified: true });
      },

      onEdgesChange: changes => {
        const { edges } = get();
        const newEdges = applyEdgeChanges(changes, edges) as FlowEdge[];
        get().pushToHistory();
        set({ edges: newEdges, isModified: true });
      },

      onConnect: connection => {
        const { edges } = get();

        // Validate connection (source handle can only have one outgoing edge)
        const existingEdge = edges.find(
          edge =>
            edge.source === connection.source &&
            edge.sourceHandle === connection.sourceHandle
        );

        if (existingEdge) {
          console.warn('Source handle already has a connection');
          return;
        }

        const newEdge: FlowEdge = {
          id: generateId(),
          ...connection,
          type: 'default',
          animated: true,
        } as FlowEdge;

        get().pushToHistory();
        set({ edges: addEdge(newEdge, edges) as FlowEdge[], isModified: true });
      },

      // Node operations
      addNode: nodeData => {
        const newNode: FlowNode = {
          id: generateId(),
          ...nodeData,
        };

        get().pushToHistory();
        set(state => ({
          nodes: [...state.nodes, newNode],
          isModified: true,
        }));
      },

      updateNode: (id, data) => {
        get().pushToHistory();
        set(state => ({
          nodes: state.nodes.map(node =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
          ),
          isModified: true,
        }));
      },

      deleteNode: id => {
        get().pushToHistory();
        set(state => ({
          nodes: state.nodes.filter(node => node.id !== id),
          edges: state.edges.filter(
            edge => edge.source !== id && edge.target !== id
          ),
          isModified: true,
        }));
      },

      // Edge operations
      addEdgeCustom: edgeData => {
        const newEdge: FlowEdge = {
          id: generateId(),
          ...edgeData,
        };

        get().pushToHistory();
        set(state => ({
          edges: [...state.edges, newEdge],
          isModified: true,
        }));
      },

      deleteEdge: id => {
        get().pushToHistory();
        set(state => ({
          edges: state.edges.filter(edge => edge.id !== id),
          isModified: true,
        }));
      },

      // Flow operations
      validateFlow: () => {
        const { nodes, edges } = get();
        return validateFlow(nodes, edges);
      },

      saveFlow: async () => {
        const { nodes, edges, flowId, flowName } = get();
        const flowData: FlowData = {
          id: flowId,
          name: flowName,
          nodes,
          edges,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const savedId = await saveFlowData(flowData);
        set({
          flowId: savedId,
          isModified: false,
          lastSaved: new Date().toISOString(),
        });

        return savedId;
      },

      loadFlow: async flowId => {
        const flowData = await loadFlowData(flowId);
        set({
          nodes: flowData.nodes,
          edges: flowData.edges,
          flowId: flowData.id,
          flowName: flowData.name,
          isModified: false,
          lastSaved: flowData.updatedAt,
          history: { past: [], future: [] },
        });
      },

      createNewFlow: (name = 'Untitled Flow') => {
        set({
          nodes: [],
          edges: [],
          flowId: generateId(),
          flowName: name,
          isModified: false,
          lastSaved: null,
          history: { past: [], future: [] },
        });
      },

      updateFlowName: (name: string) => {
        set({ flowName: name, isModified: true });
      },

      // History operations
      pushToHistory: () => {
        const { nodes, edges, history } = get();
        const newPast = [...history.past, { nodes, edges }];

        // Limit history size
        if (newPast.length > 50) {
          newPast.shift();
        }

        set({
          history: {
            past: newPast,
            future: [],
          },
        });
      },

      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        const { nodes, edges } = get();

        set({
          nodes: previous.nodes,
          edges: previous.edges,
          history: {
            past: newPast,
            future: [{ nodes, edges }, ...history.future],
          },
          isModified: true,
        });
      },

      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;

        const next = history.future[0];
        const newFuture = history.future.slice(1);
        const { nodes, edges } = get();

        set({
          nodes: next.nodes,
          edges: next.edges,
          history: {
            past: [...history.past, { nodes, edges }],
            future: newFuture,
          },
          isModified: true,
        });
      },

      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,

      // Auto-save operations
      enableAutoSave: (interval = 30000) => {
        set({
          autoSaveEnabled: true,
          autoSaveInterval: interval,
        });
      },

      disableAutoSave: () => {
        set({
          autoSaveEnabled: false,
        });
      },

      toggleAutoSave: () => {
        const { autoSaveEnabled } = get();
        set({
          autoSaveEnabled: !autoSaveEnabled,
        });
      },

      setAutoSaveInterval: (interval: number) => {
        set({
          autoSaveInterval: interval,
          isModified: true,
        });
      },

      triggerAutoSave: async () => {
        const { autoSaveEnabled, isModified, nodes } = get();

        if (!autoSaveEnabled || !isModified || nodes.length === 0) {
          return;
        }

        try {
          await get().saveFlow();
          set({
            lastAutoSave: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      },

      // Export/Import operations
      exportFlow: async () => {
        const { flowId } = get();
        const { exportFlowData } = await import(
          '../services/persistenceService'
        );
        return await exportFlowData(flowId);
      },

      importFlow: async (jsonString: string) => {
        const { importFlowData } = await import(
          '../services/persistenceService'
        );
        const flowData = await importFlowData(jsonString);

        set({
          nodes: flowData.nodes,
          edges: flowData.edges,
          flowId: flowData.id,
          flowName: flowData.name,
          isModified: false,
          lastSaved: flowData.updatedAt,
          history: { past: [], future: [] },
        });
      },

      // Utility functions
      getNodeById: id => get().nodes.find(node => node.id === id),
      getEdgeById: id => get().edges.find(edge => edge.id === id),
    }),
    {
      name: 'flow-store',
    }
  )
);

export default useFlowStore;
export { useFlowStore };
