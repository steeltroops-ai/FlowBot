import React, { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NodesPanel from '../panels/NodesPanel';
import SettingsPanel from '../panels/SettingsPanel';
import PropertiesPanel from '../panels/PropertiesPanel';
import useUIStore from '../../store/uiStore';
import { cn } from '../../utils/cn';
import {
  panelVariants,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';

const Sidebar: React.FC = () => {
  const {
    panelMode,
    isPanelOpen,
    selectedNodeId,
    sidebarWidth,
    setSidebarWidth,
  } = useUIStore();

  const reducedMotion = useReducedMotion();
  const panelAnimationVariants = reducedMotion
    ? getReducedMotionVariants(panelVariants)
    : panelVariants;

  // Resize functionality
  const isResizing = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isResizing.current = true;
      e.preventDefault();

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;

        const newWidth = e.clientX;
        setSidebarWidth(newWidth);
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [setSidebarWidth]
  );

  // Determine sidebar class based on panel mode
  const getSidebarClass = () => {
    const baseClass =
      'backdrop-blur-xl border-r shadow-panel-float transition-all duration-300';
    switch (panelMode) {
      case 'nodes':
        return `${baseClass} bg-panel-nodes-50/90 border-panel-nodes-200/30`;
      case 'settings':
        return `${baseClass} bg-panel-settings-50/90 border-panel-settings-200/30`;
      case 'properties':
        return `${baseClass} bg-panel-properties-50/90 border-panel-properties-200/30`;
      default:
        return `${baseClass} bg-secondary-50/90 border-secondary-200/30`;
    }
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={cn('relative overflow-hidden', getSidebarClass())}
        style={{ width: sidebarWidth }}
      >
        <div className="h-full" style={{ width: sidebarWidth }}>
          <AnimatePresence mode="wait">
            {/* Render different content based on panel mode */}
            {panelMode === 'settings' && isPanelOpen ? (
              <motion.div
                key="settings"
                variants={panelAnimationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                {selectedNodeId ? (
                  <SettingsPanel nodeId={selectedNodeId} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-panel-settings-100/80 rounded-xl flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-panel-settings-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                      Node Settings
                    </h3>
                    <p className="text-sm text-secondary-600 max-w-sm">
                      Select a node from the canvas to configure its settings
                      and properties.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : panelMode === 'properties' && isPanelOpen ? (
              <motion.div
                key="properties"
                variants={panelAnimationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <PropertiesPanel />
              </motion.div>
            ) : panelMode === 'nodes' && isPanelOpen ? (
              <motion.div
                key="nodes"
                variants={panelAnimationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <NodesPanel />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-primary-200/50 transition-colors group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-secondary-300 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
