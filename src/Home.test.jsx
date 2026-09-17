import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';

// Mock AuthContext
vi.mock('./context/AuthContext', () => ({
  useAuthContext: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

// Mock useProfileStatus
vi.mock('./hooks/useProfileStatus', () => ({
  default: () => ({
    isProfileComplete: true,
    isLoading: false,
  }),
}));

describe('Home Component', () => {
  it('should render the main heading', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Report Civic Issues/i)).toBeInTheDocument();
  });
});
