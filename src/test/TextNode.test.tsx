import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextNode from '../components/nodes/TextNode';
import type { TextNodeData } from '../types/flow';

// Mock ReactFlow components
vi.mock('reactflow', () => ({
  Handle: ({ children, ...props }: any) => (
    <div data-testid="handle" {...props}>
      {children}
    </div>
  ),
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  },
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      whileHover: _whileHover,
      whileTap: _whileTap,
      variants: _variants,
      initial: _initial,
      animate: _animate,
      ...props
    }: any) => <div {...props}>{children}</div>,
  },
}));

describe('TextNode', () => {
  const mockNodeProps = {
    id: 'test-node-1',
    type: 'textNode',
    position: { x: 0, y: 0 },
    selected: false,
    dragging: false,
    zIndex: 1,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    data: {
      label: 'Test Node',
      text: 'Hello, this is a test message',
      placeholder: 'Enter your message...',
    } as TextNodeData,
  };

  it('renders with text content', () => {
    render(<TextNode {...mockNodeProps} />);

    expect(
      screen.getByText('Hello, this is a test message')
    ).toBeInTheDocument();
    expect(screen.getByText('Text Message')).toBeInTheDocument();
  });

  it('shows placeholder when text is empty', () => {
    const emptyNodeProps = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        text: '',
      },
    };

    render(<TextNode {...emptyNodeProps} />);

    expect(screen.getByText('Enter your message...')).toBeInTheDocument();
  });

  it('displays character count for long messages', () => {
    const longText = 'a'.repeat(150);
    const longNodeProps = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        text: longText,
      },
    };

    render(<TextNode {...longNodeProps} />);

    expect(screen.getByText('150 characters')).toBeInTheDocument();
  });

  it('renders handles for connections', () => {
    render(<TextNode {...mockNodeProps} />);

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(2); // source and target handles
  });

  it('shows selection indicator when selected', () => {
    const selectedNodeProps = {
      ...mockNodeProps,
      selected: true,
    };

    render(<TextNode {...selectedNodeProps} />);

    // Check for selection styling (the blue border is applied via className)
    const nodeElement = screen.getByRole('button');
    expect(nodeElement).toHaveAttribute('aria-selected', 'true');
  });

  it('has proper accessibility attributes', () => {
    render(<TextNode {...mockNodeProps} />);

    const nodeElement = screen.getByRole('button');
    expect(nodeElement).toHaveAttribute(
      'aria-label',
      'Text message node: Hello, this is a test message'
    );
    expect(nodeElement).toHaveAttribute(
      'aria-describedby',
      'node-test-node-1-description'
    );
    expect(nodeElement).toHaveAttribute('tabIndex', '0');
  });

  it('includes screen reader description', () => {
    render(<TextNode {...mockNodeProps} />);

    const description = screen.getByText(
      /Text message node containing: Hello, this is a test message/
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('sr-only');
  });

  it('handles empty text state properly', () => {
    const emptyNodeProps = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        text: '',
      },
    };

    render(<TextNode {...emptyNodeProps} />);

    const description = screen.getByText(
      /This node is empty and needs content/
    );
    expect(description).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<TextNode {...mockNodeProps} />);

    const nodeElement = screen.getByRole('button');
    expect(nodeElement).toHaveClass(
      'relative',
      'bg-white/80',
      'backdrop-blur-md'
    );
  });

  it('renders icon correctly', () => {
    render(<TextNode {...mockNodeProps} />);

    // The MessageSquare icon should be rendered
    const iconContainer =
      screen.getByText('Text Message').previousElementSibling;
    expect(iconContainer).toHaveClass('w-6', 'h-6', 'bg-blue-100');
  });
});
