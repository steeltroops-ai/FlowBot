import { useEffect, useRef } from 'react';
import useFlowStore from '../store/flowStore';

/**
 * Hook to handle automatic saving of flow data
 */
export function useAutoSave() {
  const {
    autoSaveEnabled,
    autoSaveInterval,
    isModified,
    triggerAutoSave,
    lastAutoSave,
  } = useFlowStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<string | null>(null);

  // Update last save time reference
  useEffect(() => {
    lastSaveTimeRef.current = lastAutoSave;
  }, [lastAutoSave]);

  // Setup auto-save interval
  useEffect(() => {
    if (!autoSaveEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Setup new interval
    intervalRef.current = setInterval(() => {
      if (isModified) {
        triggerAutoSave();
      }
    }, autoSaveInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoSaveEnabled, autoSaveInterval, isModified, triggerAutoSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (isModified && autoSaveEnabled) {
        // Trigger auto-save before page unload
        try {
          await triggerAutoSave();
        } catch (error) {
          console.error('Failed to auto-save before page unload:', error);
        }

        // Show confirmation dialog if there are unsaved changes
        event.preventDefault();
        event.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isModified, autoSaveEnabled, triggerAutoSave]);

  // Auto-save on visibility change (when tab becomes hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isModified && autoSaveEnabled) {
        triggerAutoSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isModified, autoSaveEnabled, triggerAutoSave]);

  return {
    autoSaveEnabled,
    autoSaveInterval,
    lastAutoSave,
    isAutoSaving: false, // Could be enhanced to track saving state
  };
}

/**
 * Hook to handle flow export/import functionality
 */
export function useFlowExportImport() {
  const { exportFlow, importFlow } = useFlowStore();

  const exportToFile = async (filename?: string) => {
    try {
      const jsonString = await exportFlow();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `flow-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export flow:', error);
      throw error;
    }
  };

  const importFromFile = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async event => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        try {
          const text = await file.text();
          await importFlow(text);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  };

  const importFromText = async (jsonString: string) => {
    try {
      await importFlow(jsonString);
    } catch (error) {
      console.error('Failed to import flow:', error);
      throw error;
    }
  };

  return {
    exportToFile,
    importFromFile,
    importFromText,
  };
}
