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
import { isValidConnection } from '../../services/validationService';

// Define custom node types
const nodeTypes = {
  textNode: TextNode,
};

// Custom edge styles
const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#007aff',
    strokeWidth: 2,
  },
};

const FlowCanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore();

  const { selectNode, selectEdge, setDragState } = useUIStore();

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
    (connection: { source: string; target: string }) => {
      return isValidConnection(
        connection.source,
        connection.target,
        nodes,
        edges
      );
    },
    [nodes, edges]
  );

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
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        {/* Background Pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />

        {/* Controls */}
        <Controls
          className="bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg"
          showInteractive={false}
        />

        {/* Mini Map */}
        <MiniMap
          className="bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg"
          nodeColor="#007aff"
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
