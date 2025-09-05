import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import NodesPanel from '../panels/NodesPanel';
import SettingsPanel from '../panels/SettingsPanel';
import useUIStore from '../../store/uiStore';
import { cn } from '../../utils/cn';

const Sidebar: React.FC = () => {
  const {
    isPanelOpen,
    shouldShowNodesPanel,
    shouldShowSettingsPanel,
    selectedNodeId,
    togglePanel,
  } = useUIStore();

  return (
    <>
      {/* Sidebar Container */}
      <motion.div
        initial={false}
        animate={{
          width: isPanelOpen ? 320 : 0,
          opacity: isPanelOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        className="relative bg-white/60 backdrop-blur-xl border-l border-white/20 shadow-lg shadow-black/5 overflow-hidden"
      >
        <div className="w-80 h-full">
          <AnimatePresence mode="wait">
            {shouldShowSettingsPanel && selectedNodeId ? (
              <motion.div
                key="settings"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                <SettingsPanel nodeId={selectedNodeId} />
              </motion.div>
            ) : shouldShowNodesPanel ? (
              <motion.div
                key="nodes"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
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
