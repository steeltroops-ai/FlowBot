import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import NodesPanel from '../panels/NodesPanel';
import SettingsPanel from '../panels/SettingsPanel';
import PropertiesPanel from '../panels/PropertiesPanel';
import useUIStore from '../../store/uiStore';
import { cn } from '../../utils/cn';
import {
  sidebarVariants,
  panelVariants,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';

const Sidebar: React.FC = () => {
  const {
    isPanelOpen,
    shouldShowNodesPanel,
    shouldShowSettingsPanel,
    shouldShowPropertiesPanel,
    selectedNodeId,
    panelMode,
    togglePanel,
  } = useUIStore();

  const reducedMotion = useReducedMotion();
  const sidebarAnimationVariants = reducedMotion
    ? getReducedMotionVariants(sidebarVariants)
    : sidebarVariants;
  const panelAnimationVariants = reducedMotion
    ? getReducedMotionVariants(panelVariants)
    : panelVariants;

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
      <motion.div
        variants={sidebarAnimationVariants}
        initial="closed"
        animate={isPanelOpen ? 'open' : 'closed'}
        className={cn('relative overflow-hidden', getSidebarClass())}
      >
        <div className="w-80 h-full">
          <AnimatePresence mode="wait">
            {shouldShowSettingsPanel && selectedNodeId ? (
              <motion.div
                key="settings"
                variants={panelAnimationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full"
              >
                <SettingsPanel nodeId={selectedNodeId} />
              </motion.div>
            ) : shouldShowPropertiesPanel ? (
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
            ) : shouldShowNodesPanel ? (
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
      </motion.div>

      {/* Toggle Button */}
      <motion.button
        onClick={togglePanel}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 w-8 h-16 bg-white/80 backdrop-blur-md border border-white/30 shadow-lg shadow-black/10 flex items-center justify-center z-10 transition-colors hover:bg-white/90',
          isPanelOpen ? 'right-80 rounded-l-xl' : 'right-0 rounded-l-xl'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPanelOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <motion.div
          animate={{ rotate: isPanelOpen ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </motion.div>
      </motion.button>
    </>
  );
};

export default Sidebar;
