import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Alle Vaskehaller' }} />
    </Stack>
  );
}
