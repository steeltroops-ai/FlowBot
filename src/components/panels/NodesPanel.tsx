import React from 'react';
import { MessageSquare } from 'lucide-react';
import useUIStore from '../../store/uiStore';

interface NodeTypeConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const nodeTypes: NodeTypeConfig[] = [
  {
    type: 'textNode',
    label: 'Text Message',
    icon: MessageSquare,
    description: 'Send a text message to the user',
  },
  // Future node types can be added here
];

const NodesPanel: React.FC = () => {
  const { setDragState } = useUIStore();

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
      <div className="p-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Add Nodes</h2>
        <p className="text-sm text-gray-600">
          Drag and drop nodes onto the canvas to build your flow
        </p>
      </div>

      {/* Node Types List */}
      <div className="flex-1 p-6 space-y-3">
        {nodeTypes.map(nodeType => {
          const IconComponent = nodeType.icon;

          return (
            <div
              key={nodeType.type}
              draggable
              onDragStart={e => handleDragStart(e, nodeType.type)}
              onDragEnd={handleDragEnd}
              className="group cursor-grab active:cursor-grabbing"
            >
              <div className="p-4 bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {nodeType.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {nodeType.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
