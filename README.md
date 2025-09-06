# FlowBot

A modern, professional chatbot flow builder with drag-and-drop functionality, real-time editing, and comprehensive node configuration. Built with React, TypeScript, and ReactFlow for creating sophisticated conversational flows.

## Key Features

- **Drag-and-Drop Interface**: Intuitive visual flow builder with smooth animations and professional design
- **Comprehensive Node Library**: 12+ node types including messages, logic, input, integration, utility, and action nodes
- **Settings Panel**: 7-tab configuration interface with real-time preview and validation
- **Real-time Auto-save**: Intelligent auto-save functionality with visual status indicators

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Header, Sidebar, Layout components
│   ├── nodes/          # Flow node components (TextNode, etc.)
│   ├── panels/         # Settings and configuration panels
│   └── ui/             # Reusable UI components
├── store/              # Zustand state management
│   ├── flowStore.ts    # Flow data and operations
│   └── uiStore.ts      # UI state and panel management
├── types/              # TypeScript type definitions
│   ├── flow.ts         # Flow and node type definitions
│   └── ui.ts           # UI-related type definitions
├── config/             # Configuration files
│   └── nodeRegistry.ts # Node type registry and definitions
├── services/           # Business logic services
├── hooks/              # Custom React hooks
└── utils/              # Utility functions and helpers
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

### Build

```bash
# Build for production
pnpm build
```

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict mode enabled
- **ReactFlow** - Professional flow diagram library with advanced features
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Zustand** - Lightweight state management with TypeScript support
