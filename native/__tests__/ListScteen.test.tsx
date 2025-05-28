import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Index from '../app/(tabs)/(list)/index';
import fetchMock from 'jest-fetch-mock';
import { getDistance } from '@/utils/distance';

// --- Mock Expo Location ---
jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 55.6761,
      longitude: 12.5683,
    },
  }),
  Accuracy: { Highest: 6 },
}));

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

// --- 1. Test Location Fetching & Card Rendering ---
it('renders cards when locations are fetched', async () => {
  const fakeLocations = [
    { id: 1, name: 'Wash A', x: 12.568, y: 55.675 },
    { id: 2, name: 'Wash B', x: 12.569, y: 55.676 },
  ];

  fetchMock.mockResponseOnce(JSON.stringify(fakeLocations));

  const { getByText } = render(<Index />);

  await waitFor(() => {
    expect(getByText('Wash A')).toBeTruthy();
    expect(getByText('Wash B')).toBeTruthy();
  });
});

// --- 2. Unit Test for Distance Calculation ---
describe('getDistance()', () => {
  it('calculates correct distance between two points', () => {
    const d = getDistance(55.6761, 12.5683, 55.6762, 12.5684);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(0.05); // ~50m
  });

  it('returns 0 when coordinates are the same', () => {
    expect(getDistance(55.6761, 12.5683, 55.6761, 12.5683)).toBe(0);
  });
});

// --- 3. Test Sorting by Distance ---
it('sorts locations by distance', async () => {
  const locations = [
    { id: 1, name: 'Close Wash', x: 12.5685, y: 55.6761 },
    { id: 2, name: 'Far Wash', x: 13.0, y: 56.0 },
  ];

  fetchMock.mockResponseOnce(JSON.stringify(locations));

  const { getAllByText } = render(<Index />);

  await waitFor(() => {
    const cards = getAllByText(/Wash/);
    expect(cards[0].props.children).toContain('Close Wash');
    expect(cards[1].props.children).toContain('Far Wash');
  });
});
