import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/Button';
import { checkAuth } from '@/store/authSlice';
import CustomTextInput from '@/components/TextInput';
import { User } from '@/types';
import { router } from 'expo-router';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState<string | undefined>('');
  const [email, setEmail] = useState<string | undefined>('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [dataLoading, setDataLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    } else {
      dispatch(checkAuth());
      fetchUserData();
    }
  }, []);

  const fetchUserData = async (): Promise<User | null> => {
    setDataLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data: User = await res.json();
      if (!res.ok) throw new Error((data as any).message || 'Fetch failed');
      setName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setDataLoading(false);
      return data;
    } catch (e: any) {
      console.error('Location fetch error:', e.message);
      return null;
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name,
            phoneNumber: phoneNumber,
            email: email,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user details');
      }

      Alert.alert('Success', 'Profile detailes updated successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error updateing user profile:', error.message);
      Alert.alert('Error', error.message || 'Failed to update user details');
    }
  };

  if (token && userId) {
    if (dataLoading) {
      return (
        <View style={styles.main}>
          <ActivityIndicator size="large" style={styles.locationFlexBox} />
          <Text style={styles.label}>Loading user data...</Text>
        </View>
      );
    }
    return (
      <View style={styles.main}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.label}>Name</Text>
          <CustomTextInput
            placeholder="Name"
            text={name}
            onChange={setName}
          ></CustomTextInput>

          <Text style={styles.label}>Email</Text>
          <CustomTextInput
            placeholder="Email"
            text={email}
            onChange={setEmail}
          ></CustomTextInput>

          <Text style={styles.label}>Phone number</Text>
          <CustomTextInput
            placeholder="Phone number"
            text={phoneNumber}
            onChange={setPhoneNumber}
          ></CustomTextInput>
          <Button title="Update" onPress={handleSubmit} disabled={submitting} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  locationFlexBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    backgroundColor: '#f7f7f7',
    width: '100%',
    padding: 16,
    gap: 40,
    flex: 1,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 18,
    height: 22,
    alignSelf: 'stretch',
  },
});
