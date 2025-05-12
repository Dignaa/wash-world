import * as SecureStore from 'expo-secure-store';

export const saveValue = async (key: string, value: string): Promise<void> => {
  await SecureStore.setItemAsync(key, value);
};

export const getValue = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

export const deleteValue = async (key: string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};
