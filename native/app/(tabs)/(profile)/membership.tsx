import Button from '@/components/Button';
import SecondaryButton from '@/components/SecondaryButton';
import { checkAuth, login, logout, signup } from '@/store/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleSubmit = () => {};

  if (token) {
    return (
      <View>
        <Text>Your memberships</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Get new memberships!</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
    </View>
  );
}
