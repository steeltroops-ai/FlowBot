import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';

interface SettingsPanelProps {
  nodeId: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ nodeId }) => {
  const { getNodeById, updateNode } = useFlowStore();
  const { selectNode } = useUIStore();

  const node = getNodeById(nodeId);
  const [text, setText] = useState(node?.data.text || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Validation rules
  const validateText = useCallback((value: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!value.trim()) {
      errors.push({ field: 'text', message: 'Message text is required' });
    } else if (value.length < 3) {
      errors.push({
        field: 'text',
        message: 'Message must be at least 3 characters long',
      });
    } else if (value.length > 1000) {
      errors.push({
        field: 'text',
        message: 'Message must be less than 1000 characters',
      });
    }

    return errors;
  }, []);

  // Update local state when node changes
  useEffect(() => {
    if (node) {
      setText(node.data.text || '');
      setHasChanges(false);
      setValidationErrors([]);
    }
  }, [node]);

  // Real-time validation
  useEffect(() => {
    const errors = validateText(text);
    setValidationErrors(errors);
  }, [text, validateText]);

  // Handle text changes with real-time preview
  const handleTextChange = (value: string) => {
    setText(value);
    setHasChanges(value !== (node?.data.text || ''));

    // Real-time preview update (update node immediately for preview)
    if (node && showPreview) {
      updateNode(nodeId, { text: value });
    }
  };

  // Save changes to store with validation
  const handleSave = async () => {
    if (!node || !hasChanges) return;

    const errors = validateText(text);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      updateNode(nodeId, { text });
      setHasChanges(false);
      setLastSaved(new Date());
      setValidationErrors([]);
    } catch (error) {
      console.error('Failed to save node:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges && validationErrors.length === 0) {
      const autoSaveTimer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasChanges, validationErrors.length, text]);

  // Go back to nodes panel
  const handleBack = () => {
    if (hasChanges) {
      handleSave();
    }
    selectNode(null);
  };

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500">Node not found</p>
          <Button onClick={handleBack} variant="ghost" className="mt-2">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="p-6 border-b border-surface-divider/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="p-2"
              aria-label="Go back to nodes panel"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-panel-settings-100/80 rounded-xl flex items-center justify-center shadow-elevation-1">
                <MessageSquare className="w-4 h-4 text-panel-settings-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-secondary-800 tracking-tight">
                  Text Message
                </h2>
                <p className="text-xs text-secondary-500">
                  Node ID: {nodeId.slice(-6)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview
                  ? 'bg-panel-settings-100 text-panel-settings-700'
                  : 'hover:bg-panel-settings-50 text-secondary-600'
              }`}
              aria-label="Toggle preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || validationErrors.length > 0 || isSaving}
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Save className="w-3 h-3" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            {hasChanges && (
              <span className="text-panel-settings-600 flex items-center space-x-1">
                <div className="w-2 h-2 bg-panel-settings-500 rounded-full"></div>
                <span>Unsaved changes</span>
              </span>
            )}
            {lastSaved && !hasChanges && (
              <span className="text-secondary-500 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-interactive-success" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </span>
            )}
          </div>
          <div className="text-secondary-500">
            {text.length}/1000 characters
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Message Text */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Message Text
            <span className="text-interactive-danger ml-1">*</span>
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              placeholder="Enter your message..."
              className={`w-full h-32 px-4 py-3 border rounded-xl text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-panel-settings-500/20 focus:border-panel-settings-500/50 transition-all resize-none ${
                validationErrors.some(e => e.field === 'text')
                  ? 'border-interactive-danger bg-interactive-danger-50/50'
                  : 'border-surface-border bg-surface-elevated'
              }`}
              maxLength={1000}
            />
            {validationErrors.some(e => e.field === 'text') && (
              <div className="absolute right-3 top-3">
                <AlertCircle className="w-4 h-4 text-interactive-danger" />
              </div>
            )}
          </div>

          {/* Validation Errors */}
          <AnimatePresence>
            {validationErrors.map(
              (error, index) =>
                error.field === 'text' && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex items-center space-x-2 text-sm text-interactive-danger"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{error.message}</span>
                  </motion.div>
                )
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-secondary-500">
              {validationErrors.length === 0 ? (
                <span className="flex items-center space-x-1 text-interactive-success">
                  <CheckCircle className="w-3 h-3" />
                  <span>Valid message</span>
                </span>
              ) : (
                'Please fix validation errors'
              )}
            </p>
            <p
              className={`text-xs ${
                text.length > 900
                  ? 'text-interactive-warning'
                  : 'text-secondary-500'
              }`}
            >
              {text.length}/1000
            </p>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-surface-border rounded-xl p-4 bg-surface-elevated"
          >
            <h3 className="text-sm font-medium text-secondary-700 mb-3 flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </h3>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-700 leading-relaxed">
                    {text || 'Enter your message to see preview...'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Advanced Settings */}
        <div className="border-t border-surface-divider pt-6">
          <h3 className="text-sm font-medium text-secondary-700 mb-4">
            Advanced Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-secondary-700">Auto-save</label>
                <p className="text-xs text-secondary-500">
                  Automatically save changes after 2 seconds
                </p>
              </div>
              <div className="w-10 h-6 bg-panel-settings-200 rounded-full relative">
                <div className="w-4 h-4 bg-panel-settings-500 rounded-full absolute top-1 left-1 transition-transform transform translate-x-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Information Footer */}
      <div className="p-6 border-t border-surface-divider/50 bg-secondary-50/30">
        <h3 className="text-sm font-medium text-secondary-700 mb-3">
          Node Information
        </h3>
        <div className="space-y-2 text-xs text-secondary-500">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium">Text Message</span>
          </div>
          <div className="flex justify-between">
            <span>Position:</span>
            <span>
              ({Math.round(node?.position.x || 0)},{' '}
              {Math.round(node?.position.y || 0)})
            </span>
          </div>
          <div className="flex justify-between">
            <span>Node ID:</span>
            <span className="font-mono">{nodeId.slice(-8)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
