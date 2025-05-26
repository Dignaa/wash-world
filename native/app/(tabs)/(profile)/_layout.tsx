import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Min Profil' }} />
      <Stack.Screen name="membership" options={{ title: 'New Membership' }} />
      <Stack.Screen name="profile" options={{ title: 'Update Profile' }} />
      <Stack.Screen name="[carId]" options={{ title: 'Membership Details' }} />
    </Stack>
  );
}
