import React from 'react';
// ensure React is available globally for components expecting the identifier
global.React = React;
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductDetails from '../pages/ProductDetails';
import { CartContext } from '../context/CartContext';
import API from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock react-router hooks used in the component and stub Link to avoid Router context
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'p1' }),
    useNavigate: () => vi.fn(),
    Link: (props) => {
      // simple anchor replacement for Link
      const { children, ...rest } = props;
      return React.createElement('a', rest, children);
    },
  };
});

const mockProduct = {
  _id: 'p1',
  name: 'Handmade Vase',
  description: 'Beautiful vase',
  price: 45,
  createdAt: new Date().toISOString(),
  category: { name: 'Decor' },
  artisan: { name: 'Artisan B' },
  stock: 3,
  images: ['img1.jpg', 'img2.jpg'],
};

describe('ProductDetails page', () => {
  beforeEach(() => {
    API.get.mockReset();
    API.get.mockResolvedValue({ data: { data: mockProduct } });
    // stub alert to avoid popups
    global.alert = vi.fn();
  });

  it('renders product info and lets user add to cart', async () => {
    const addToCart = vi.fn();

    render(
      <CartContext.Provider value={{ addToCart }}>
        <ProductDetails />
      </CartContext.Provider>
    );

    await waitFor(() => expect(screen.getByRole('heading', { name: /Handmade Vase/i })).toBeTruthy());

    // Price and stock visible
    expect(screen.getByText(/\$45/)).toBeTruthy();
    expect(screen.getByText(/In Stock/)).toBeTruthy();

    // Add to cart click
    const addBtn = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(addBtn);

    expect(addToCart).toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalled();
  });
});
