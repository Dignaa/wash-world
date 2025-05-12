import Button from '@/components/Button';
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
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleSubmit = () => {
    if (isLogin) {
      dispatch(login({ email, password }));
    } else {
      dispatch(signup({ email, password }));
    }
  };

  if (token) {
    return (
      <View>
        <Text>Welcome!</Text>
        <Button title="Log out" onPress={() => dispatch(logout())} />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title={isLogin ? 'Login' : 'Sign Up'} onPress={handleSubmit} />
      <Button
        title={isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
        onPress={() => setIsLogin((prev) => !prev)}
      />
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
    </View>
  );
}
