import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Search, X, Filter } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import {
  staggerContainer,
  staggerItem,
  useReducedMotion,
  getReducedMotionVariants,
} from '../../utils/animations';

interface NodeTypeConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: 'message' | 'logic' | 'integration' | 'utility';
  tags: string[];
  isNew?: boolean;
  isPremium?: boolean;
}

const nodeTypes: NodeTypeConfig[] = [
  {
    type: 'textNode',
    label: 'Text Message',
    icon: MessageSquare,
    description: 'Send a text message to the user',
    category: 'message',
    tags: ['text', 'message', 'communication', 'basic'],
  },
  // Future node types can be added here
  // Example of extensible architecture:
  // {
  //   type: 'conditionalNode',
  //   label: 'Conditional Logic',
  //   icon: GitBranch,
  //   description: 'Branch conversation based on conditions',
  //   category: 'logic',
  //   tags: ['condition', 'branch', 'logic', 'flow'],
  //   isNew: true,
  // },
];

const categories = [
  { value: 'all', label: 'All Nodes' },
  { value: 'message', label: 'Messages' },
  { value: 'logic', label: 'Logic' },
  { value: 'integration', label: 'Integrations' },
  { value: 'utility', label: 'Utilities' },
];

const NodesPanel: React.FC = () => {
  const { setDragState } = useUIStore();
  const reducedMotion = useReducedMotion();
  const containerVariants = reducedMotion
    ? getReducedMotionVariants(staggerContainer)
    : staggerContainer;
  const itemVariants = reducedMotion
    ? getReducedMotionVariants(staggerItem)
    : staggerItem;

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered node types based on search and category
  const filteredNodeTypes = useMemo(() => {
    return nodeTypes.filter(nodeType => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || nodeType.category === selectedCategory;

      // Search filter (fuzzy search across label, description, and tags)
      const matchesSearch =
        searchQuery === '' ||
        nodeType.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nodeType.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        nodeType.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    setDragState(true, nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragState(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="p-6 border-b border-surface-divider/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-panel-nodes-100/80 rounded-xl flex items-center justify-center shadow-elevation-1">
              <Plus className="w-4 h-4 text-panel-nodes-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-800 tracking-tight">
                Add Nodes
              </h2>
              <p className="text-xs text-secondary-500">
                {filteredNodeTypes.length} of {nodeTypes.length} nodes
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg hover:bg-panel-nodes-100/50 transition-colors"
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4 text-secondary-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-surface-elevated border border-surface-border rounded-xl text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-panel-nodes-500/20 focus:border-panel-nodes-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-secondary-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3 h-3 text-secondary-400" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-panel-nodes-500 text-white shadow-elevation-1'
                      : 'bg-surface-elevated border border-surface-border text-secondary-600 hover:bg-panel-nodes-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={clearSearch}
                className="mt-2 text-xs text-secondary-500 hover:text-secondary-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}

        <p className="text-sm text-secondary-600 leading-relaxed">
          Drag and drop nodes onto the canvas to build your flow
        </p>
      </div>

      {/* Node Types List */}
      <motion.div
        className="flex-1 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredNodeTypes.length > 0 ? (
          <div className="space-y-3">
            {filteredNodeTypes.map(nodeType => {
              const IconComponent = nodeType.icon;

              return (
                <motion.div
                  key={nodeType.type}
                  variants={itemVariants}
                  className="group cursor-grab active:cursor-grabbing"
                >
                  <div
                    draggable
                    onDragStart={(e: React.DragEvent) =>
                      handleDragStart(e, nodeType.type)
                    }
                    onDragEnd={handleDragEnd}
                    className="p-5 bg-surface-elevated backdrop-blur-md border border-surface-border rounded-2xl shadow-elevation-2 hover:shadow-hover-lift hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-panel-nodes-100/80 rounded-xl flex items-center justify-center group-hover:bg-panel-nodes-200/80 transition-all duration-200 shadow-elevation-1">
                        <IconComponent className="w-6 h-6 text-panel-nodes-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-secondary-800 text-sm tracking-tight">
                            {nodeType.label}
                          </h3>
                          {nodeType.isNew && (
                            <span className="px-2 py-0.5 bg-panel-nodes-500 text-white text-xs rounded-full">
                              New
                            </span>
                          )}
                          {nodeType.isPremium && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
                              Pro
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-secondary-500 mt-1 leading-relaxed">
                          {nodeType.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {nodeType.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-panel-nodes-50 text-panel-nodes-700 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-700 mb-2">
              No nodes found
            </h3>
            <p className="text-sm text-secondary-500 mb-4 max-w-xs">
              Try adjusting your search terms or category filters to find the
              nodes you're looking for.
            </p>
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-panel-nodes-500 text-white rounded-lg hover:bg-panel-nodes-600 transition-colors text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Future Nodes Placeholder */}
      <div className="p-6 border-t border-white/20">
        <div className="p-4 bg-gray-100/50 backdrop-blur-md border border-gray-200/30 rounded-2xl">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-gray-500 text-xs">+</span>
            </div>
            <p className="text-xs text-gray-500">More node types coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
