import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </Provider>
  );
}
