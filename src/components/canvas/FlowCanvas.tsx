import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TextNode from '../nodes/TextNode';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';
import { createNodeAtPosition } from '../../utils/nodeFactory';
import {
  isValidConnection,
  validateFlow,
} from '../../services/validationService';

// Define custom node types
const nodeTypes = {
  textNode: TextNode,
};

// Custom edge styles with modern colors
const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#0ea5e9', // primary-500
    strokeWidth: 2,
  },
};

const FlowCanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore();

  const {
    selectNode,
    selectEdge,
    setDragState,
    showWarnings,
    setValidationState,
  } = useUIStore();

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.stopPropagation();
      selectNode(node.id);
    },
    [selectNode]
  );

  // Handle edge selection
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: { id: string }) => {
      event.stopPropagation();
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  // Handle canvas click (deselect all)
  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  // Handle drag over for drop functionality
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop to create new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');

      if (!nodeType || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      try {
        const newNode = createNodeAtPosition(nodeType, position);
        useFlowStore.getState().addNode(newNode);

        // Select the newly created node
        selectNode(newNode.id);
      } catch (error) {
        console.error('Failed to create node:', error);
      }

      setDragState(false);
    },
    [screenToFlowPosition, selectNode, setDragState]
  );

  // Validate connections before allowing them
  const isValidConnectionCallback = useCallback(
    (connection: { source: string | null; target: string | null }) => {
      if (!connection.source || !connection.target) {
        return false;
      }
      return isValidConnection(
        connection.source,
        connection.target,
        nodes,
        edges
      );
    },
    [nodes, edges]
  );

  // Perform automatic validation when flow changes
  const performAutoValidation = useCallback(async () => {
    if (nodes.length === 0) return;

    setValidationState(true);

    try {
      // Small delay to avoid excessive validation during rapid changes
      await new Promise(resolve => setTimeout(resolve, 500));

      const validation = validateFlow(nodes, edges);

      if (validation.warnings.length > 0) {
        // Convert flow ValidationError to UI ValidationError format
        const uiWarnings = validation.warnings.map(warning => ({
          id: warning.id,
          message: warning.message,
          type: 'warning' as const,
        }));
        showWarnings(uiWarnings);
      }
    } catch (error) {
      console.error('Auto-validation failed:', error);
    } finally {
      setValidationState(false);
    }
  }, [nodes, edges, setValidationState, showWarnings]);

  // Trigger auto-validation when nodes or edges change
  React.useEffect(() => {
    const timeoutId = setTimeout(performAutoValidation, 1000);
    return () => clearTimeout(timeoutId);
  }, [performAutoValidation]);

  return (
    <div
      className="w-full h-full"
      ref={reactFlowWrapper}
      role="application"
      aria-label="Flow builder canvas - drag nodes from the sidebar to create your chatbot flow"
      tabIndex={0}
      onKeyDown={e => {
        // Handle keyboard shortcuts
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          // Delete selected nodes/edges - handled by ReactFlow
        }
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'z':
              e.preventDefault();
              // Undo action - could be implemented with history
              break;
            case 'y':
              e.preventDefault();
              // Redo action - could be implemented with history
              break;
            case 's':
              e.preventDefault();
              // Save flow - could trigger save action
              break;
          }
        }
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Strict}
        isValidConnection={isValidConnectionCallback}
        fitView
        fitViewOptions={{
          padding: 0.1,
          minZoom: 0.5,
          maxZoom: 2.0,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        attributionPosition="bottom-left"
        className="bg-secondary-50"
      >
        {/* Background Pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e2e8f0" // canvas-200
        />

        {/* Controls */}
        <Controls
          className="bg-glass-white-80 backdrop-blur-md border border-glass-white-30 rounded-2xl shadow-glass-lg"
          showInteractive={false}
        />

        {/* Mini Map */}
        <MiniMap
          className="bg-glass-white-80 backdrop-blur-md border border-glass-white-30 rounded-2xl shadow-glass-lg"
          nodeColor="#0ea5e9" // primary-500
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable
          zoomable
          ariaLabel="Flow overview minimap"
        />
      </ReactFlow>

      {/* Hidden instructions for screen readers */}
      <div id="canvas-instructions" className="sr-only">
        Flow builder canvas. Use Tab to navigate between nodes. Press Enter or
        Space to select nodes. Use Delete or Backspace to remove selected items.
        Drag nodes from the sidebar to add them to the canvas. Connect nodes by
        dragging from output handles to input handles.
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider
const FlowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
};

export default FlowCanvas;
