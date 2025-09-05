import type { FlowData, FlowMetadata } from '../types/flow';

const STORAGE_KEY = 'flowbot-flows';
const METADATA_KEY = 'flowbot-metadata';

/**
 * Save flow data to localStorage
 */
export async function saveFlowData(flowData: FlowData): Promise<string> {
  try {
    // Get existing flows
    const existingFlows = await getAllFlows();

    // Update or add the flow
    const updatedFlows = {
      ...existingFlows,
      [flowData.id]: flowData,
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFlows));

    // Update metadata
    await updateFlowMetadata(flowData);

    return flowData.id;
  } catch (error) {
    console.error('Failed to save flow:', error);
    throw new Error('Failed to save flow to local storage');
  }
}

/**
 * Load flow data from localStorage
 */
export async function loadFlowData(flowId: string): Promise<FlowData> {
  try {
    const flows = await getAllFlows();
    const flowData = flows[flowId];

    if (!flowData) {
      throw new Error(`Flow with ID ${flowId} not found`);
    }

    return flowData;
  } catch (error) {
    console.error('Failed to load flow:', error);
    throw new Error('Failed to load flow from local storage');
  }
}

/**
 * Delete flow data from localStorage
 */
export async function deleteFlowData(flowId: string): Promise<void> {
  try {
    const flows = await getAllFlows();
    delete flows[flowId];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));

    // Update metadata
    const metadata = await getFlowsMetadata();
    const updatedMetadata = metadata.filter(meta => meta.id !== flowId);
    localStorage.setItem(METADATA_KEY, JSON.stringify(updatedMetadata));
  } catch (error) {
    console.error('Failed to delete flow:', error);
    throw new Error('Failed to delete flow from local storage');
  }
}

/**
 * Get all flows from localStorage
 */
export async function getAllFlows(): Promise<Record<string, FlowData>> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to get flows:', error);
    return {};
  }
}

/**
 * Get flows metadata for listing
 */
export async function getFlowsMetadata(): Promise<FlowMetadata[]> {
  try {
    const stored = localStorage.getItem(METADATA_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get flows metadata:', error);
    return [];
  }
}

/**
 * Update flow metadata
 */
async function updateFlowMetadata(flowData: FlowData): Promise<void> {
  const metadata = await getFlowsMetadata();
  const existingIndex = metadata.findIndex(meta => meta.id === flowData.id);

  const flowMetadata: FlowMetadata = {
    id: flowData.id,
    name: flowData.name,
    createdAt: flowData.createdAt,
    updatedAt: flowData.updatedAt,
    nodeCount: flowData.nodes.length,
    edgeCount: flowData.edges.length,
  };

  if (existingIndex >= 0) {
    metadata[existingIndex] = flowMetadata;
  } else {
    metadata.push(flowMetadata);
  }

  localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
}

/**
 * Export flow data as JSON string
 */
export async function exportFlowData(flowId: string): Promise<string> {
  const flowData = await loadFlowData(flowId);
  return JSON.stringify(flowData, null, 2);
}

/**
 * Import flow data from JSON string
 */
export async function importFlowData(jsonString: string): Promise<FlowData> {
  try {
    const flowData = JSON.parse(jsonString) as FlowData;

    // Validate the imported data structure
    if (
      !flowData.id ||
      !flowData.name ||
      !Array.isArray(flowData.nodes) ||
      !Array.isArray(flowData.edges)
    ) {
      throw new Error('Invalid flow data structure');
    }

    // Generate new ID to avoid conflicts
    const newFlowData: FlowData = {
      ...flowData,
      id: `imported-${Date.now()}`,
      name: `${flowData.name} (Imported)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveFlowData(newFlowData);
    return newFlowData;
  } catch (error) {
    console.error('Failed to import flow:', error);
    throw new Error('Failed to import flow data');
  }
}

/**
 * Clear all flow data (for development/testing)
 */
export async function clearAllFlows(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(METADATA_KEY);
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  used: number;
  available: number;
  percentage: number;
} {
  try {
    const used = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
    const available = 5 * 1024 * 1024; // Assume 5MB localStorage limit
    const percentage = (used / available) * 100;

    return { used, available, percentage };
  } catch {
    return { used: 0, available: 0, percentage: 0 };
  }
}
