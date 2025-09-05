import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';

const Header: React.FC = () => {
  const { saveFlow, validateFlow, flowName, isModified } = useFlowStore();
  const { showErrors, setLoading, isLoading } = useUIStore();

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

  return (
    <header
      className="h-16 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm shadow-black/5 flex items-center justify-between px-6 relative z-50"
      role="banner"
      aria-label="FlowBot application header"
    >
      {/* Left side - Logo and title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            FlowBot
          </h1>
          <p className="text-xs text-gray-500 -mt-1">
            {flowName}
            {isModified && ' •'}
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
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
