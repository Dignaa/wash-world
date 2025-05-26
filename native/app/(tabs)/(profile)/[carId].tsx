import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Membership } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Button from '@/components/Button';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function DetailsScreen() {
  const { userId, token } = useSelector((state: RootState) => state.auth);
  const { carId } = useLocalSearchParams();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) return;

    const fetchMembership = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}user/${userId}/memberships/${carId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) throw new Error('Failed to fetch membership');
        const data: Membership = await res.json();
        setMembership(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [carId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!membership) {
    return (
      <View style={styles.container}>
        <Text>No membership found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {membership.membershipType.type} medlemskab
      </Text>
      <Text>
        <MaterialCommunityIcons name="car" size={28} />
        <View style={styles.licenseContainer}>
          <View style={styles.dkWrapper}>
            <Text style={[styles.dk, styles.dkTypo]}>DK</Text>
          </View>
          <View style={[styles.licenseNoWrapper]}>
            <Text style={[styles.licenseNo, styles.dkTypo]}>
              {membership.car.registrationNumber}
            </Text>
          </View>
        </View>
      </Text>
      <Text>
        <MaterialCommunityIcons name="map" size={28} />
        {membership.location.address}
      </Text>
      <Text>Price: {membership.membershipType.price} DKK/M.</Text>
      <Text>Start: {new Date(membership.start).toLocaleDateString()}</Text>
      <Text>End: {new Date(membership.end).toLocaleDateString()}</Text>
      {membership.membershipType.type !== 'Brilliant' && (
        <Button title="Upgrade membership" />
      )}
      <Button title="Extend membership" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  licenseNoWrapper: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    paddingHorizontal: 6,
    textAlign: 'left',
  },
  licenseNo: {
    color: '#000',
    textAlign: 'right',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 16,
  },
  dkTypo: {
    textAlign: 'right',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 16,
  },
  licenseContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ff0000',
    borderWidth: 0.5,
    width: 95,
    height: 35,
    borderStyle: 'solid',
  },
  dk: {
    color: '#fff',
  },
  dkWrapper: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: '#335ab3',
    width: 30,
    paddingHorizontal: 4,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
