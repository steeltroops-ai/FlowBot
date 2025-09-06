import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

// Extend Vitest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('App should not have accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<App />);

    // Check for proper heading structure
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);

    // Ensure h1 exists (main app title)
    const h1Elements = headings.filter(heading => heading.tagName === 'H1');
    expect(h1Elements.length).toBeGreaterThanOrEqual(1);
  });

  it('should have proper landmark regions', () => {
    render(<App />);

    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check for banner (header)
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have proper focus management', () => {
    render(<App />);

    // Check that interactive elements are focusable
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('should have proper ARIA labels', () => {
    render(<App />);

    // Check that important elements have ARIA labels
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-label');

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label');
  });

  it('should support keyboard navigation', () => {
    render(<App />);

    // Check that all buttons are keyboard accessible
    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      // Should not have negative tabindex (unless specifically needed for accessibility)
      const tabIndex = button.getAttribute('tabindex');
      if (tabIndex !== null) {
        expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
      }
    });
  });

  it('should have proper color contrast', async () => {
    const { container } = render(<App />);

    // Use axe to check color contrast
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });

  it('should support screen readers', () => {
    render(<App />);

    // Check for screen reader friendly elements
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label');

    // Check that buttons have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      const accessibleName =
        button.getAttribute('aria-label') ||
        button.getAttribute('aria-labelledby') ||
        button.textContent;
      expect(accessibleName).toBeTruthy();
    });
  });

  it('should handle reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<App />);

    // App should render without issues even with reduced motion
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have proper form labels when forms are present', () => {
    render(<App />);

    // Check that any form inputs have proper labels (if they exist)
    const inputs = screen.queryAllByRole('textbox');
    inputs.forEach(input => {
      const label =
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        input.getAttribute('placeholder');
      expect(label).toBeTruthy();
    });
  });
});
