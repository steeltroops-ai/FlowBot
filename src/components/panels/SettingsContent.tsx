import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface NodeSettings {
  text: string;
  richText?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  fontWeight?: 'normal' | 'bold';
  delay?: number;
  typing?: boolean;
  typingSpeed?: number;
  conditions?: Array<{
    id: string;
    field: string;
    operator: string;
    value: string;
    action: string;
  }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  description?: string;
  tags?: string[];
  notes?: string;
  customCSS?: string;
  customData?: Record<string, any>;
}

interface ValidationError {
  field: string;
  message: string;
}

type SettingsTab =
  | 'content'
  | 'styling'
  | 'behavior'
  | 'conditions'
  | 'validation'
  | 'metadata'
  | 'advanced';

interface SettingsContentProps {
  activeTab: SettingsTab;
  settings: NodeSettings;
  validationErrors: ValidationError[];
  onChange: (key: keyof NodeSettings, value: any) => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  activeTab,
  settings,
  validationErrors,
  onChange,
}) => {
  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field);
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Message Text */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Message Text
          <span className="text-interactive-danger ml-1">*</span>
        </label>
        <div className="relative">
          <textarea
            value={settings.text}
            onChange={e => onChange('text', e.target.value)}
            placeholder="Enter your message..."
            className={`w-full h-32 px-4 py-3 border rounded-xl text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-panel-settings-500/20 focus:border-panel-settings-500/50 transition-all resize-none ${
              getFieldError('text')
                ? 'border-interactive-danger bg-interactive-danger-50/50'
                : 'border-surface-border bg-surface-elevated'
            }`}
            maxLength={1000}
          />
          {getFieldError('text') && (
            <div className="absolute right-3 top-3">
              <AlertCircle className="w-4 h-4 text-interactive-danger" />
            </div>
          )}
        </div>

        {/* Error Display */}
        {getFieldError('text') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 flex items-center space-x-2 text-sm text-interactive-danger"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{getFieldError('text')?.message}</span>
          </motion.div>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.richText || false}
                onChange={e => onChange('richText', e.target.checked)}
                className="rounded border-surface-border"
              />
              <span className="text-xs text-secondary-600">
                Rich text formatting
              </span>
            </label>
          </div>
          <p
            className={`text-xs ${
              settings.text.length > 900
                ? 'text-interactive-warning'
                : 'text-secondary-500'
            }`}
          >
            {settings.text.length}/1000
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Description
        </label>
        <input
          type="text"
          value={settings.description || ''}
          onChange={e => onChange('description', e.target.value)}
          placeholder="Brief description of this message..."
          className="w-full px-4 py-2 border border-surface-border bg-surface-elevated rounded-xl text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-panel-settings-500/20 focus:border-panel-settings-500/50 transition-all"
        />
      </div>
    </div>
  );

  const renderStylingTab = () => (
    <div className="space-y-6">
      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Background Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.backgroundColor || '#ffffff'}
              onChange={e => onChange('backgroundColor', e.target.value)}
              className="w-12 h-10 rounded-lg border border-surface-border cursor-pointer"
            />
            <input
              type="text"
              value={settings.backgroundColor || '#ffffff'}
              onChange={e => onChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Text Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.textColor || '#1f2937'}
              onChange={e => onChange('textColor', e.target.value)}
              className="w-12 h-10 rounded-lg border border-surface-border cursor-pointer"
            />
            <input
              type="text"
              value={settings.textColor || '#1f2937'}
              onChange={e => onChange('textColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Font Size
          </label>
          <select
            value={settings.fontSize || 'medium'}
            onChange={e => onChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Font Weight
          </label>
          <select
            value={settings.fontWeight || 'normal'}
            onChange={e => onChange('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="space-y-6">
      {/* Delay Settings */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Delay (milliseconds)
        </label>
        <input
          type="number"
          value={settings.delay || 0}
          onChange={e => onChange('delay', parseInt(e.target.value) || 0)}
          min="0"
          max="60000"
          className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-panel-settings-500/20 focus:border-panel-settings-500/50 transition-all ${
            getFieldError('delay')
              ? 'border-interactive-danger bg-interactive-danger-50/50'
              : 'border-surface-border bg-surface-elevated'
          }`}
        />
        <p className="text-xs text-secondary-500 mt-1">
          Delay before showing this message (0-60000ms)
        </p>
        {getFieldError('delay') && (
          <p className="text-xs text-interactive-danger mt-1">
            {getFieldError('delay')?.message}
          </p>
        )}
      </div>

      {/* Typing Animation */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.typing || false}
            onChange={e => onChange('typing', e.target.checked)}
            className="rounded border-surface-border"
          />
          <span className="text-sm font-medium text-secondary-700">
            Typing animation
          </span>
        </label>
        <p className="text-xs text-secondary-500 mt-1">
          Show typing indicator before message appears
        </p>
      </div>

      {/* Typing Speed */}
      {settings.typing && (
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Typing Speed (characters per minute)
          </label>
          <input
            type="number"
            value={settings.typingSpeed || 50}
            onChange={e =>
              onChange('typingSpeed', parseInt(e.target.value) || 50)
            }
            min="1"
            max="200"
            className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-panel-settings-500/20 focus:border-panel-settings-500/50 transition-all ${
              getFieldError('typingSpeed')
                ? 'border-interactive-danger bg-interactive-danger-50/50'
                : 'border-surface-border bg-surface-elevated'
            }`}
          />
          {getFieldError('typingSpeed') && (
            <p className="text-xs text-interactive-danger mt-1">
              {getFieldError('typingSpeed')?.message}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={settings.validation?.required || false}
          onChange={e =>
            onChange('validation', {
              ...settings.validation,
              required: e.target.checked,
            })
          }
          className="rounded border-surface-border"
        />
        <label className="text-sm font-medium text-secondary-700">
          Required field
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Minimum Length
          </label>
          <input
            type="number"
            value={settings.validation?.minLength || ''}
            onChange={e =>
              onChange('validation', {
                ...settings.validation,
                minLength: parseInt(e.target.value) || undefined,
              })
            }
            min="0"
            className="w-full px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Maximum Length
          </label>
          <input
            type="number"
            value={settings.validation?.maxLength || ''}
            onChange={e =>
              onChange('validation', {
                ...settings.validation,
                maxLength: parseInt(e.target.value) || undefined,
              })
            }
            min="0"
            className="w-full px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderMetadataTab = () => (
    <div className="space-y-6">
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(settings.tags || []).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-panel-settings-100 text-panel-settings-700 rounded-full text-xs"
            >
              {tag}
              <button
                onClick={() => {
                  const newTags = [...(settings.tags || [])];
                  newTags.splice(index, 1);
                  onChange('tags', newTags);
                }}
                className="ml-2 hover:text-panel-settings-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tag and press Enter"
          onKeyPress={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const newTags = [
                ...(settings.tags || []),
                e.currentTarget.value.trim(),
              ];
              onChange('tags', newTags);
              e.currentTarget.value = '';
            }
          }}
          className="w-full px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Notes
        </label>
        <textarea
          value={settings.notes || ''}
          onChange={e => onChange('notes', e.target.value)}
          placeholder="Internal notes about this node..."
          className="w-full h-24 px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm resize-none"
        />
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Custom CSS
        </label>
        <textarea
          value={settings.customCSS || ''}
          onChange={e => onChange('customCSS', e.target.value)}
          placeholder="/* Custom CSS styles */&#10;.custom-node {&#10;  /* Your styles here */&#10;}"
          className="w-full h-32 px-3 py-2 border border-surface-border bg-surface-elevated rounded-lg text-sm font-mono resize-none"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
      case 'styling':
        return renderStylingTab();
      case 'behavior':
        return renderBehaviorTab();
      case 'validation':
        return renderValidationTab();
      case 'metadata':
        return renderMetadataTab();
      case 'advanced':
        return renderAdvancedTab();
      default:
        return renderContentTab();
    }
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full overflow-y-auto"
    >
      {renderTabContent()}
    </motion.div>
  );
};

export default SettingsContent;
