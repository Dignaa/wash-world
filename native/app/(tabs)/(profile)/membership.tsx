import { Location } from '@/types';
import { useRouter } from 'expo-router';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MembershipType } from '@/types';
import LicensePlateInput from '@/components/LicensePlateInput';
import { Picker } from '@react-native-picker/picker';
import NewMembershipCard from '@/components/NewMembershipCard';
import Button from '@/components/Button';
import { checkAuth } from '@/store/authSlice';
import { useQueryClient } from '@tanstack/react-query';

export default function Profile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const [licensePlate, setLicensePlate] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [selectedMembershipType, setSelectedMembershipType] =
    useState<MembershipType | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingMembershipTypes, setLoadingMembershipTypes] = useState(false);

  useEffect(() => {
    fetchLocations();
    fetchMembershipTypes();
  }, []);

  const fetchLocations = async (): Promise<Location[]> => {
    setLoadingLocations(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}location`);
      const data: Location[] = await res.json();
      if (!res.ok) throw new Error((data as any).message || 'Fetch failed');
      setLocations(data);
      setLoadingLocations(false);
      return data;
    } catch (e: any) {
      console.error('Location fetch error:', e.message);
      return [];
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchMembershipTypes = async (): Promise<MembershipType[]> => {
    setLoadingMembershipTypes(true);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}membership-types`,
      );

      const data: MembershipType[] = await res.json();
      if (!res.ok) throw new Error((data as any).message || 'Fetch failed');
      setMembershipTypes(data);
      setLoadingMembershipTypes(false);

      return data;
    } catch (e: any) {
      console.error('Membership fetch error:', e.message);
      return [];
    } finally {
      setLoadingMembershipTypes(false);
    }
  };

  const handleSubmit = async () => {
    if (licensePlate.trim() === '') {
      Alert.alert('Fejl', 'Please enter a valid license plate.');
      return;
    }

    if (selectedLocation === null) {
      Alert.alert('Fejl', 'Please select a wash station.');
      return;
    }

    if (selectedMembershipType === null) {
      Alert.alert('Fejl', 'Please select a membership plan.');
      return;
    }

    if (!token || !userId) {
      dispatch(checkAuth());
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${userId}/memberships`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            licensePlate: licensePlate,
            userId: userId,
            locationId: selectedLocation,
            typeId: selectedMembershipType.id,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create membership');
      }

      queryClient.invalidateQueries({ queryKey: ['memberships', userId] });

      Alert.alert('Success', 'Membership created successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error creating membership:', error.message);
      Alert.alert('Error', error.message || 'Failed to create membership');
    }
  };

  if (loadingMembershipTypes || loadingLocations) {
    return (
      <View style={styles.main}>
        <ActivityIndicator size="large" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (token) {
    return (
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.main}>
            <View style={styles.section}>
              <View style={styles.label}>
                <Text style={styles.labelTypo}>License Plate</Text>
              </View>
              <LicensePlateInput
                text={licensePlate}
                onChange={setLicensePlate}
              />
            </View>
            <View style={styles.section}>
              <View style={styles.label}>
                <Text style={styles.labelTypo}>Location</Text>
              </View>
              <Picker
                selectedValue={selectedLocation}
                onValueChange={(val) => {
                  setSelectedLocation(val);
                }}
                style={styles.dropdown}
              >
                <Picker.Item
                  label="Choose washstation"
                  value={null}
                  style={styles.picker}
                />
                {locations.map((loc) => (
                  <Picker.Item
                    key={loc.id}
                    label={loc.address}
                    value={loc.id}
                    style={styles.cartPrice}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.section}>
              <View style={styles.label}>
                <Text style={styles.labelTypo}>Membership</Text>
              </View>
              {!loadingMembershipTypes &&
                membershipTypes.length > 0 &&
                membershipTypes.map((membership) => (
                  <NewMembershipCard
                    key={membership.id}
                    membershipType={membership.type}
                    price={membership.price}
                    selected={selectedMembershipType?.id === membership.id}
                    onPress={() => {
                      setSelectedMembershipType(membership);
                    }}
                  />
                ))}
            </View>
            {selectedMembershipType! ? (
              <View style={styles.section}>
                <View style={styles.label}>
                  <Text style={[styles.labelTypo]}>Cart</Text>
                </View>
                <View style={styles.cartCard}>
                  <View style={styles.totalFlexBox}>
                    <Text style={[styles.cartMembership, styles.cartTypo]}>
                      {selectedMembershipType?.type}
                    </Text>
                    <Text style={[styles.cartPrice, styles.cartTypo]}>
                      {(selectedMembershipType?.price ?? '') +
                        (selectedMembershipType ? '  kr.' : '')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.pay]}>
                  <Button
                    title="Pay"
                    onPress={handleSubmit}
                    style={styles.button}
                  />
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  labelTypo: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 18,
    position: 'absolute',
    top: 0,
    left: 5,
  },
  cartTypo: {
    fontSize: 16,
    textAlign: 'left',
  },
  totalFlexBox: {
    width: 337,
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    color: '#e5e5e5',
    fontFamily: 'Inter-Regular',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderBottomWidth: 4,
    borderBottomColor: '#E5E5E5',
  },
  location: {
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  label: {
    height: 22,
    alignSelf: 'stretch',
  },
  brilliant: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 18,
  },
  section: {
    gap: 8,
    justifyContent: 'center',
  },
  cartMembership: {
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
    color: '#000',
  },
  cartPrice: {
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
    color: '#000',
  },
  cartCard: {
    padding: 12,
    gap: 10,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignSelf: 'stretch',
  },
  button: {
    borderBottomWidth: 4,
    borderColor: '#198b47',
    backgroundColor: '#06c167',
    borderStyle: 'solid',
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  pay: { height: 60 },
  main: {
    backgroundColor: '#f7f7f7',
    width: '100%',
    padding: 16,
    gap: 30,
    flex: 1,
    alignSelf: 'stretch',
  },
});
