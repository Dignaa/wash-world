import { fetchCategories } from '@/features/categories/categoriesSlice';
import { fetchExpenses } from '@/features/expenses/expensesSlice';
import { reloadJwtFromStorage } from '@/features/user/userSlice';
import { AppDispatch, RootState } from '@/store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

export default function TabLayout() {
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter(); // Initialize router
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function getValueFor() {
      try {
        const storedValue = await SecureStore.getItemAsync('jwt');
        if (storedValue) {
          const userObj = JSON.parse(storedValue);
          dispatch(reloadJwtFromStorage(userObj));
        }
      } catch (error) {
        console.error('Error fetching JWT:', error);
      } finally {
        setLoading(false);
      }
    }
    getValueFor();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (token) {
        alert(token);
        dispatch(fetchExpenses());
        dispatch(fetchCategories());
      } else {
        alert('no token');
      }
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
