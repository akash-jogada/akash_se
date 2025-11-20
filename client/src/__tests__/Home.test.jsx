import React from 'react';
// ensure React is available globally for components using the classic runtime
global.React = React;
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from '../pages/Home';
import { CartContext } from '../context/CartContext';
import API from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockProducts = [
  {
    _id: 'p1',
    name: 'Handmade Bowl',
    description: 'Nice bowl',
    price: 20,
    createdAt: new Date().toISOString(),
    category: { _id: 'c1', name: 'Kitchen' },
    artisan: { name: 'Artisan A' },
    stock: 5,
    images: [],
  },
];

const mockCategories = [{ _id: 'c1', name: 'Kitchen' }];

describe('Home page', () => {
  beforeEach(() => {
    API.get.mockReset();
    API.get.mockImplementation((path) => {
      if (path === '/products') return Promise.resolve({ data: { data: mockProducts } });
      if (path === '/categories') return Promise.resolve({ data: { data: mockCategories } });
      return Promise.resolve({ data: { data: [] } });
    });
  });

  it('renders products and responds to search', async () => {
    const addToCart = vi.fn();

    render(
      <MemoryRouter>
        <CartContext.Provider value={{ addToCart }}>
          <Home />
        </CartContext.Provider>
      </MemoryRouter>
    );

    // Wait for products to load
    await waitFor(() => expect(screen.getByText(/Handmade Bowl/i)).toBeTruthy());

    // Search for the product
    const searchInput = screen.getByPlaceholderText(/Search products/i);
    fireEvent.change(searchInput, { target: { value: 'bowl' } });

    // Expect the product to still be visible after filtering
    expect(screen.getByText(/Handmade Bowl/i)).toBeTruthy();

    // Click Add to Cart
    const addBtn = screen.getByRole('button', { name: /Add to Cart|🛒 Add to Cart/i });
    fireEvent.click(addBtn);
    expect(addToCart).toHaveBeenCalled();
  });
});
