import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import FlowCanvas from './components/canvas/FlowCanvas';
import ErrorBanner from './components/ui/ErrorBanner';
import WarningBanner from './components/ui/WarningBanner';
import useFlowStore from './store/flowStore';
import useUIStore from './store/uiStore';
import { useAutoSave } from './hooks/useAutoSave';
import type { FlowNode, FlowEdge } from './types/flow';
import sampleFlowData from './data/sampleFlow.json';

function App() {
  const { nodes, loadFlow, createNewFlow } = useFlowStore();
  const {
    validationErrors,
    validationWarnings,
    showErrorBanner,
    showWarningBanner,
    clearErrors,
    clearWarnings,
  } = useUIStore();

  // Initialize auto-save functionality
  useAutoSave();

  // Load sample data on first visit
  useEffect(() => {
    const hasExistingFlow = nodes.length > 0;

    if (!hasExistingFlow) {
      // Check if there's saved data in localStorage
      const savedFlows = localStorage.getItem('flowbot-flows');

      if (!savedFlows) {
        // Load sample flow for first-time users
        try {
          const flowData = sampleFlowData as {
            nodes: FlowNode[];
            edges: FlowEdge[];
            name: string;
            id: string;
          };
          useFlowStore.setState({
            nodes: flowData.nodes,
            edges: flowData.edges,
            flowName: flowData.name,
            flowId: flowData.id,
          });
        } catch (error) {
          console.error('Failed to load sample flow:', error);
          createNewFlow('My First Flow');
        }
      }
    }
  }, [nodes.length, loadFlow, createNewFlow]);

  return (
    <Layout>
      <FlowCanvas />

      {/* Error Banner */}
      <ErrorBanner
        errors={validationErrors}
        isVisible={showErrorBanner}
        onClose={clearErrors}
      />

      {/* Warning Banner */}
      <WarningBanner
        warnings={validationWarnings}
        isVisible={showWarningBanner}
        onClose={clearWarnings}
      />
    </Layout>
  );
}

export default App;
