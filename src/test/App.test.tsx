import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock ReactFlow to avoid complex setup in tests
vi.mock('reactflow', () => {
  const ReactFlow = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="react-flow-canvas">{children}</div>
  );

  return {
    default: ReactFlow,
    ReactFlow,
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Background: () => <div data-testid="background" />,
    Controls: () => <div data-testid="controls" />,
    MiniMap: () => <div data-testid="minimap" />,
    Handle: () => <div data-testid="handle" />,
    Position: {
      Left: 'left',
      Right: 'right',
      Top: 'top',
      Bottom: 'bottom',
    },
    ConnectionMode: {
      Strict: 'strict',
    },
    BackgroundVariant: {
      Dots: 'dots',
    },
    useReactFlow: () => ({
      screenToFlowPosition: vi.fn(),
    }),
    addEdge: vi.fn(),
    applyNodeChanges: vi.fn(),
    applyEdgeChanges: vi.fn(),
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);

    // Check if the main layout elements are present
    expect(screen.getByText('FlowBot')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByTestId('react-flow-canvas')).toBeInTheDocument();
  });

  it('displays the header with correct title', () => {
    render(<App />);

    const header = screen.getByText('FlowBot');
    expect(header).toBeInTheDocument();
  });

  it('displays the save button', () => {
    render(<App />);

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  it('renders the ReactFlow canvas', () => {
    render(<App />);

    const canvas = screen.getByTestId('react-flow-canvas');
    expect(canvas).toBeInTheDocument();
  });
});
