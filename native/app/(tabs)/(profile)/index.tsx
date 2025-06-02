import Button from '@/components/Button';
import * as SecureStore from 'expo-secure-store';
import MembershipCard from '@/components/MembershipCard';
import SecondaryButton from '@/components/SecondaryButton';
import CustomTextInput from '@/components/TextInput';
import WashCard from '@/components/WashCard';
import { checkAuth, login, logout, signup } from '@/store/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Wash } from '@/types';
import { Membership } from '@/types';
import { Link } from 'expo-router';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error, userId, username } = useSelector(
    (state: RootState) => state.auth,
  );
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [washes, setWashes] = useState<Wash[]>([]);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    if (token) {
      fetchMemberships();
      fetchWashes();
    }
  }, [token]);

  const handleSubmit = async () => {
    await SecureStore.setItemAsync('userPassword', password);
    if (email && password) {
      if (isLogin) {
        await dispatch(login({ email, password }));
      } else {
        await dispatch(signup({ email, password }));
      }
    } else {
      alert(
        'Please fill the details before ' + (isLogin ? 'log in' : 'sign up'),
      );
    }
  };

  const fetchMemberships = async () => {
    try {
      if (!token || !userId) {
        await dispatch(checkAuth());
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${userId}/memberships`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Membership Fetch error: ', errorData.message);
        throw new Error(errorData.message || 'Membership Fetch failed');
      }

      const data: Membership[] = await res.json();
      setMemberships(data);
    } catch (error: any) {
      console.error('Membership Fetch error:', error.message);
    }
  };

  const fetchWashes = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${userId}/washes`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Washes Fetch failed');
      }

      const rawData: Wash[] = await res.json();

      const data: Wash[] = rawData.map((item: any) => ({
        id: item.id,
        car: item.car.registrationNumber, // flatten nested object
        location: item.location.address.split(',')[1]?.trim() || '', // flatten nested object
        washType: item.washType.type, // flatten nested object
        date: new Date(item.time).toDateString(), // convert string to Date
        rating: item.rating,
      }));

      setWashes(data);
    } catch (error: any) {
      console.error('Fetch error:', error.message);
    }
  };

  if (token && userId) {
    // Logged in Users profile page
    return (
      <View style={styles.main}>
        {/* Profile Details section */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.sectionWrapper}>
            <View style={styles.profileDetailsContainer}>
              <Text style={[styles.name, styles.nameBox]}>{username}</Text>
              <Text style={[styles.email, styles.nameBox]}>{email}</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <View style={[styles.buttonFlexBox]}>
                <SecondaryButton
                  title="Log out"
                  onPress={() => {
                    dispatch(logout());
                  }}
                />
                <SecondaryButton
                  title="Update profile"
                  link="/(tabs)/(profile)/profile"
                />
              </View>
            </View>
          </View>
          {/* Memberships section */}
          <View style={styles.sectionWrapper}>
            <Text style={[styles.name, styles.nameBox]}>Memberships</Text>
            {memberships.length === 0 ? (
              <Text style={styles.centeredText}>No memberships.</Text>
            ) : (
              memberships.map((membership) => (
                <Link
                  key={membership.id}
                  href={{
                    pathname: '/(tabs)/(profile)/[carId]',
                    params: { carId: membership.car.id },
                  }}
                  style={{ width: '100%' }}
                >
                  <View style={{ width: '100%' }}>
                    <MembershipCard
                      membershipType={membership.membershipType.type}
                      price={membership.membershipType.price}
                      licensePlate={membership.car.registrationNumber}
                    />
                  </View>
                </Link>
              ))
            )}

            <View style={styles.buttonWrapper}>
              <View style={[styles.buttonFlexBox]}>
                <Button
                  title="Add membership"
                  link="/(tabs)/(profile)/membership"
                />
              </View>
            </View>
          </View>
          {/* Washes section */}
          <View style={styles.sectionWrapper}>
            <Text style={[styles.name, styles.nameBox]}>Washes</Text>
            {washes.length === 0 ? (
              <Text style={styles.centeredText}>No washes.</Text>
            ) : (
              washes.map((wash) => (
                <WashCard
                  key={wash.id}
                  car={wash.car}
                  location={wash.location}
                  date={wash.date}
                  washType={wash.washType}
                  rating={wash.rating}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    // Login/sign-up page
    <KeyboardAvoidingView
      style={styles.main}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Manage your memberships and see your washes!
            </Text>
          </View>
          <CustomTextInput
            text={email}
            onChange={setEmail}
            placeholder="Email"
            validateEmail
            onValidationError={setIsValidEmail}
          />
          <CustomTextInput
            text={password}
            onChange={setPassword}
            placeholder="Password"
            secureTextEntry={true}
          />
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          <Button
            title={isLogin ? 'Login' : 'Sign Up'}
            onPress={handleSubmit}
          />
          <View style={{ marginTop: 50 }}>
            <Text style={styles.centeredText}>
              {isLogin
                ? "Don't have an account, yet?"
                : 'Already have an account?'}
            </Text>
            <SecondaryButton
              title={isLogin ? 'Create account' : 'Login'}
              onPress={() => setIsLogin((prev) => !prev)}
            />
            {loading && <Text>Loading...</Text>}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#f7f7f7',
    width: '100%',
    height: '100%',
    padding: 16,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
  centeredText: {
    fontSize: 16,
    textAlign: 'center',
  },
  nameBox: {
    textAlign: 'left',
    color: '#000',
  },
  buttonFlexBox: {
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  name: {
    display: 'flex',
    width: '100%',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#000',
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  profileDetailsContainer: {
    alignSelf: 'stretch',
  },
  becomeAMember: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#000',
  },

  buttonWrapper: {
    alignItems: 'flex-end',
    width: '100%',
  },
  sectionWrapper: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
