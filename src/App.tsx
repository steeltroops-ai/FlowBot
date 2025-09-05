import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import FlowCanvas from './components/canvas/FlowCanvas';
import useFlowStore from './store/flowStore';
import sampleFlowData from './data/sampleFlow.json';

function App() {
  const { nodes, loadFlow, createNewFlow } = useFlowStore();

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
            nodes: any[];
            edges: any[];
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
    </Layout>
  );
}

export default App;
