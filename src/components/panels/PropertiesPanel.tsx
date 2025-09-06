import React, { useState, useEffect } from 'react';
import { Settings, Info, Save, Download, Upload, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';
import { useFlowExportImport } from '../../hooks/useAutoSave';

const PropertiesPanel: React.FC = () => {
  const {
    flowName,
    flowId,
    nodes,
    edges,
    autoSaveEnabled,
    autoSaveInterval,
    isModified,
    lastSaved,
    updateFlowName,
    toggleAutoSave,
    setAutoSaveInterval,
    saveFlow,
    createNewFlow,
  } = useFlowStore();

  const { setLoading, isLoading } = useUIStore();
  const { exportToFile, importFromFile } = useFlowExportImport();

  const [localFlowName, setLocalFlowName] = useState(flowName);
  const [localAutoSaveInterval, setLocalAutoSaveInterval] = useState(
    autoSaveInterval / 1000
  ); // Convert to seconds
  const [hasNameChanges, setHasNameChanges] = useState(false);
  const [hasIntervalChanges, setHasIntervalChanges] = useState(false);

  // Update local state when store changes
  useEffect(() => {
    setLocalFlowName(flowName);
    setHasNameChanges(false);
  }, [flowName]);

  useEffect(() => {
    setLocalAutoSaveInterval(autoSaveInterval / 1000);
    setHasIntervalChanges(false);
  }, [autoSaveInterval]);

  // Handle flow name changes
  const handleFlowNameChange = (value: string) => {
    setLocalFlowName(value);
    setHasNameChanges(value !== flowName);
  };

  // Handle auto-save interval changes
  const handleIntervalChange = (value: number) => {
    setLocalAutoSaveInterval(value);
    setHasIntervalChanges(value !== autoSaveInterval / 1000);
  };

  // Save flow name changes
  const handleSaveFlowName = () => {
    if (hasNameChanges) {
      updateFlowName(localFlowName);
      setHasNameChanges(false);
    }
  };

  // Save auto-save interval changes
  const handleSaveInterval = () => {
    if (hasIntervalChanges) {
      setAutoSaveInterval(localAutoSaveInterval * 1000); // Convert to milliseconds
      setHasIntervalChanges(false);
    }
  };

  // Auto-save on blur
  const handleFlowNameBlur = () => {
    if (hasNameChanges) {
      handleSaveFlowName();
    }
  };

  const handleIntervalBlur = () => {
    if (hasIntervalChanges) {
      handleSaveInterval();
    }
  };

  // Handle manual save
  const handleManualSave = async () => {
    setLoading(true);
    try {
      await saveFlow();
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    setLoading(true);
    try {
      await exportToFile();
    } finally {
      setLoading(false);
    }
  };

  // Handle import
  const handleImport = async () => {
    setLoading(true);
    try {
      await importFromFile();
    } finally {
      setLoading(false);
    }
  };

  // Handle new flow
  const handleNewFlow = () => {
    if (isModified) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to create a new flow?'
      );
      if (!confirmed) return;
    }
    createNewFlow();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="p-6 border-b border-glass-white-20">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-panel-properties-100 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-panel-properties-600" />
          </div>
          <h2 className="text-lg font-semibold text-surface-800">
            Flow Properties
          </h2>
        </div>
        <p className="text-sm text-surface-600">
          Configure your flow settings and metadata
        </p>
      </div>

      {/* Properties Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Flow Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Flow Information</span>
          </h3>

          {/* Flow Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flow Name
            </label>
            <input
              type="text"
              value={localFlowName}
              onChange={e => handleFlowNameChange(e.target.value)}
              onBlur={handleFlowNameBlur}
              placeholder="Enter flow name..."
              className="w-full px-3 py-2 border border-white/30 bg-white/60 backdrop-blur-md rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">Maximum 100 characters</p>
              <p className="text-xs text-gray-500">
                {localFlowName.length}/100
              </p>
            </div>
          </div>

          {/* Flow ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flow ID
            </label>
            <div className="px-3 py-2 bg-gray-50/50 border border-white/30 rounded-xl text-sm text-gray-500 font-mono">
              {flowId}
            </div>
          </div>
        </div>

        {/* Flow Statistics */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Flow Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50/50 border border-blue-200/50 rounded-xl">
              <div className="text-lg font-semibold text-blue-700">
                {nodes.length}
              </div>
              <div className="text-xs text-blue-600">Nodes</div>
            </div>
            <div className="p-3 bg-green-50/50 border border-green-200/50 rounded-xl">
              <div className="text-lg font-semibold text-green-700">
                {edges.length}
              </div>
              <div className="text-xs text-green-600">Connections</div>
            </div>
          </div>
        </div>

        {/* Auto-Save Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">
            Auto-Save Settings
          </h3>

          {/* Auto-Save Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enable Auto-Save
              </label>
              <p className="text-xs text-gray-500">
                Automatically save changes
              </p>
            </div>
            <button
              onClick={toggleAutoSave}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSaveEnabled ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSaveEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto-Save Interval */}
          {autoSaveEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Save Interval (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={localAutoSaveInterval}
                onChange={e => handleIntervalChange(Number(e.target.value))}
                onBlur={handleIntervalBlur}
                className="w-full px-3 py-2 border border-white/30 bg-white/60 backdrop-blur-md rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Between 5 and 300 seconds
              </p>
            </div>
          )}
        </div>

        {/* Flow Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Flow Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={handleManualSave}
              disabled={isLoading || !isModified}
              className="w-full justify-start"
              variant="secondary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Flow
              {isModified && <span className="ml-auto text-xs">•</span>}
            </Button>

            <Button
              onClick={handleExport}
              disabled={isLoading}
              className="w-full justify-start"
              variant="secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Flow
            </Button>

            <Button
              onClick={handleImport}
              disabled={isLoading}
              className="w-full justify-start"
              variant="secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Flow
            </Button>

            <Button
              onClick={handleNewFlow}
              disabled={isLoading}
              className="w-full justify-start"
              variant="secondary"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              New Flow
            </Button>
          </div>
        </div>

        {/* Last Saved */}
        {lastSaved && (
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-gray-500">
              Last saved: {new Date(lastSaved).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
