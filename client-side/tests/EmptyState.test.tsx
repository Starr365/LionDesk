import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../src/components/shared/EmptyState';

describe('EmptyState Component Tests', () => {
  it('should render the title and description correctly', () => {
    render(
      <EmptyState
        title="No items found"
        description="Please check back later for updates."
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Please check back later for updates.')).toBeInTheDocument();
  });

  it('should render and fire the action button when configured', () => {
    const handleAction = vi.fn();

    render(
      <EmptyState
        title="Add records"
        description="Registry list is empty."
        actionButton={{
          label: "Create New",
          onClick: handleAction
        }}
      />
    );

    const button = screen.getByText('Create New');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
