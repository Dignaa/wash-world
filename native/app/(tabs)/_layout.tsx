import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#06C167',
      }}
    >
      <Tabs.Screen
        name="(list)"
        options={{
          title: 'Find Vask',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={26} name="magnify" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(wash)"
        options={{
          title: 'Start Vask',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="car-wash" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Min Profil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="account" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
