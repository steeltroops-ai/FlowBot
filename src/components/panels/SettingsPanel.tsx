import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';

interface SettingsPanelProps {
  nodeId: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ nodeId }) => {
  const { getNodeById, updateNode } = useFlowStore();
  const { selectNode } = useUIStore();

  const node = getNodeById(nodeId);
  const [text, setText] = useState(node?.data.text || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when node changes
  useEffect(() => {
    if (node) {
      setText(node.data.text || '');
      setHasChanges(false);
    }
  }, [node]);

  // Handle text changes
  const handleTextChange = (value: string) => {
    setText(value);
    setHasChanges(value !== (node?.data.text || ''));
  };

  // Save changes to store
  const handleSave = () => {
    if (node && hasChanges) {
      updateNode(nodeId, { text });
      setHasChanges(false);
    }
  };

  // Auto-save on blur
  const handleBlur = () => {
    if (hasChanges) {
      handleSave();
    }
  };

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
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="p-2"
            aria-label="Go back to nodes panel"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Text Message
              </h2>
              <p className="text-xs text-gray-500">
                Node ID: {nodeId.slice(-6)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Message Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Text
          </label>
          <textarea
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter your message..."
            className="w-full h-32 px-3 py-2 border border-white/30 bg-white/60 backdrop-blur-md rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Maximum 1000 characters</p>
            <p className="text-xs text-gray-500">{text.length}/1000</p>
          </div>
        </div>

        {/* Character Count Warning */}
        {text.length > 800 && (
          <div className="p-3 bg-yellow-50/50 border border-yellow-200/50 rounded-xl">
            <p className="text-xs text-yellow-700">
              Message is getting long. Consider breaking it into multiple nodes.
            </p>
          </div>
        )}

        {/* Save Button */}
        {hasChanges && (
          <div className="pt-4 border-t border-white/20">
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Node Info */}
      <div className="p-6 border-t border-white/20 bg-gray-50/50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Node Information
        </h3>
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Type:</span>
            <span>Text Message</span>
          </div>
          <div className="flex justify-between">
            <span>Position:</span>
            <span>
              ({Math.round(node.position.x)}, {Math.round(node.position.y)})
            </span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>
              {new Date(parseInt(nodeId.split('-')[0])).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
