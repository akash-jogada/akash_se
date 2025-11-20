import React from 'react';
// ensure React is available globally for components expecting the identifier
global.React = React;
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
// mock react-router functions and stub Link before importing the component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: (props) => {
      const { children, ...rest } = props;
      return React.createElement('a', rest, children);
    },
  };
});
import Checkout from '../pages/Checkout';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Checkout page', () => {
  beforeEach(() => {
    API.post.mockReset();
    // clear sessionStorage between tests
    sessionStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('shows login prompt when no user', () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <CartContext.Provider value={{ cart: [], removeFromCart: () => {} }}>
          <Checkout />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Please login to checkout/i)).toBeTruthy();
  });

  it('submits order when user and items present', async () => {
    const mockUser = { id: 'u1', name: 'Test User' };
    const mockCart = [ { _id: 'p1', name: 'Item A', price: 10, quantity: 2 } ];
    // simulate cart provided via context and items saved in sessionStorage
    sessionStorage.setItem('checkoutItems', JSON.stringify(mockCart));

    API.post.mockResolvedValue({ data: { success: true } });

    const removeFromCart = vi.fn();

    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <CartContext.Provider value={{ cart: mockCart, removeFromCart }}>
          <Checkout />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    // Fill required shipping fields
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '123 St' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Town' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'S' } });
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'Country' } });

    // Click Place Order (Cash on Delivery)
    const placeOrderBtn = screen.getByRole('button', { name: /Place Order/i });
    fireEvent.click(placeOrderBtn);

    await waitFor(() => {
      expect(API.post).toHaveBeenCalled();
    });
  });
});
