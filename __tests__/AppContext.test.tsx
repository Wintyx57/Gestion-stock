import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '@/contexts/AppContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn((url) => {
    if (typeof url === 'string' && url.includes('/api/login')) {
      return Promise.resolve({ ok: true, json: async () => ({ token: 'token' }) });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
});

describe('AppContext', () => {
  it('authenticates user on login', async () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    await act(async () => {
      await result.current.login('user@example.com', 'pass');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userEmail).toBe('user@example.com');
  });

  it('adds products and suppliers', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    const newProducts = [
      {
        id: 1,
        supplier: 'Demo',
        ean: '1',
        name: 'Prod 1',
        currentStock: 0,
        alertThreshold: 5,
        movements: [],
        stockInitialized: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        supplier: 'Other',
        ean: '2',
        name: 'Prod 2',
        currentStock: 0,
        alertThreshold: 5,
        movements: [],
        stockInitialized: false,
        createdAt: new Date().toISOString(),
      },
    ];

    act(() => {
      result.current.addProducts(newProducts);
    });

    expect(result.current.products).toHaveLength(2);
    expect(result.current.suppliers).toEqual(expect.arrayContaining(['Demo', 'Other']));
  });
});
