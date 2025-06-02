import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Index from '@/app/(tabs)/(list)/index';
import { getDistance } from '@/utils/distance';

jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 0, longitude: 0 },
    }),
  ),
  Accuracy: {
    Highest: 6,
  },
}));

describe('<Index />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator and then "No locations found"', async () => {
    // ─── ARRANGE ───────────────────────────────────────────────────────────────
    // Mock fetch to return an empty array (HTTP 200, empty JSON list)
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    ) as jest.Mock;

    // ─── ACT ───────────────────────────────────────────────────────────────────
    // Render the <Index /> component. On mount, it:
    // 1. Checks permissions (mocked via jest.mock above).
    // 2. Gets current position (mocked to {0,0}).
    // 3. Calls fetch(...) which resolves to [].
    // While all that is happening, it should show a loading spinner.
    const { getByTestId, queryByTestId, getByText } = render(<Index />);

    // ─── ASSERT (initial) ──────────────────────────────────────────────────────
    // Immediately after render (before async fetch finishes), the loading indicator must be present.
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // ─── ASSERT (after fetch resolves) ─────────────────────────────────────────
    // Wait for the async work to complete:
    // once fetch returns [], the loading indicator should be gone,
    // and “No locations found” should be displayed.
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(getByText(/no locations found/i)).toBeTruthy();
    });
  });

  it('shows "No locations found" when fetch fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('API failed')),
    ) as jest.Mock;

    const { getByTestId, queryByTestId, getByText } = render(<Index />);

    expect(getByTestId('loading-indicator')).toBeTruthy();

    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(getByText(/no locations found/i)).toBeTruthy();
    });
  });
});

describe('getDistance()', () => {
  it('calculates correct distance between Copenhagen and Aarhus', () => {
    const cph = { lat: 55.6761, lon: 12.5683 };
    const aarhus = { lat: 56.1629, lon: 10.2039 };
    const distance = getDistance(cph.lat, cph.lon, aarhus.lat, aarhus.lon);

    expect(Math.round(distance)).toBeGreaterThan(150);
    expect(Math.round(distance)).toBeLessThan(200);
  });
});
