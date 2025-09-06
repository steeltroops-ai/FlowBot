import React from 'react';
import {
  Save,
  Loader2,
  Download,
  Upload,
  Settings,
  Plus,
  Wrench,
} from 'lucide-react';
import Button from '../ui/Button';
import AutoSaveStatus from '../ui/AutoSaveStatus';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';
import { useFlowExportImport } from '../../hooks/useAutoSave';

const Header: React.FC = () => {
  const { saveFlow, validateFlow, flowName, isModified } = useFlowStore();
  const { showErrors, setLoading, isLoading, setPanelMode, panelMode } =
    useUIStore();
  const { exportToFile, importFromFile } = useFlowExportImport();

  const handleSave = async () => {
    try {
      setLoading(true, 'Validating flow...');

      // Validate flow before saving
      const validation = validateFlow();

      if (!validation.isValid) {
        showErrors(
          validation.errors.map(error => ({
            id: error.id,
            message: error.message,
            type: 'error' as const,
          }))
        );
        return;
      }

      setLoading(true, 'Saving flow...');
      await saveFlow();

      // Show success message briefly
      setLoading(true, 'Flow saved successfully!');
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('Failed to save flow:', error);
      showErrors([
        {
          id: 'save-error',
          message: 'Failed to save flow. Please try again.',
          type: 'error',
        },
      ]);
    } finally {
      if (!isLoading) {
        setLoading(false);
      }
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true, 'Exporting flow...');
      await exportToFile(
        `${flowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
      );
      setLoading(false);
    } catch (error) {
      console.error('Failed to export flow:', error);
      showErrors([
        {
          id: 'export-error',
          message: 'Failed to export flow. Please try again.',
          type: 'error',
        },
      ]);
      setLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setLoading(true, 'Importing flow...');
      await importFromFile();
      setLoading(false);
    } catch (error) {
      console.error('Failed to import flow:', error);
      showErrors([
        {
          id: 'import-error',
          message: 'Failed to import flow. Please check the file format.',
          type: 'error',
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <header
      className="h-16 bg-secondary-50/90 backdrop-blur-xl border-b border-secondary-200/40 shadow-elevation-1 flex items-center justify-between px-6 relative z-50"
      role="banner"
      aria-label="FlowBot application header"
    >
      {/* Left side - Logo and title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-surface-800 tracking-tight">
            FlowBot
          </h1>
          <p className="text-xs text-surface-500 -mt-1">
            {flowName}
            {isModified && ' •'}
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Auto-save status */}
        <AutoSaveStatus />

        {isModified && (
          <span
            id="unsaved-changes"
            className="text-xs text-gray-500 bg-yellow-100/50 px-2 py-1 rounded-full"
            role="status"
            aria-live="polite"
          >
            Unsaved changes
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPanelMode('nodes')}
            disabled={isLoading}
            aria-label="Open nodes panel"
            className={
              panelMode === 'nodes'
                ? 'bg-panel-nodes-100/80 text-panel-nodes-700 shadow-elevation-2'
                : ''
            }
          >
            <Plus className="w-3 h-3 mr-1" />
            Nodes
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPanelMode('settings')}
            disabled={isLoading}
            aria-label="Open node settings"
            className={
              panelMode === 'settings'
                ? 'bg-panel-settings-100/80 text-panel-settings-700 shadow-elevation-2'
                : ''
            }
          >
            <Wrench className="w-3 h-3 mr-1" />
            Settings
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPanelMode('properties')}
            disabled={isLoading}
            aria-label="Open flow properties"
            className={
              panelMode === 'properties'
                ? 'bg-panel-properties-100/80 text-panel-properties-700 shadow-elevation-2'
                : ''
            }
          >
            <Settings className="w-3 h-3 mr-1" />
            Properties
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={isLoading}
            aria-label="Export flow"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleImport}
            disabled={isLoading}
            aria-label="Import flow"
          >
            <Upload className="w-3 h-3 mr-1" />
            Import
          </Button>
        </div>

        <Button
          onClick={handleSave}
          loading={isLoading}
          disabled={isLoading}
          className="shadow-lg"
          aria-label={isLoading ? 'Saving flow...' : 'Save flow'}
          aria-describedby={isModified ? 'unsaved-changes' : undefined}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Flow
        </Button>
      </div>
    </header>
  );
};

export default Header;
