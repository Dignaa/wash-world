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

export default function Profile() {
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
            <View style={[styles.memberships, styles.locationFlexBox]}>
              <View style={styles.membershipsLabel}>
                <Text style={[styles.membership, styles.cart1Typo]}>
                  License Plate
                </Text>
              </View>
              <LicensePlateInput
                text={licensePlate}
                onChange={setLicensePlate}
              />
            </View>
            <View style={[styles.location, styles.locationFlexBox]}>
              <View style={styles.licensePlateParent}>
                <View style={[styles.locationLabel, styles.parentFlexBox]}>
                  <Text style={[styles.location1, styles.location1Typo]}>
                    Location
                  </Text>
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
                    style={styles.ab12345}
                  />
                  {locations.map((loc) => (
                    <Picker.Item
                      key={loc.id}
                      label={loc.address}
                      value={loc.id}
                      style={styles.kr}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={[styles.memberships, styles.locationFlexBox]}>
              <View style={styles.membershipsLabel}>
                <Text style={[styles.membership, styles.cart1Typo]}>
                  Membership
                </Text>
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
            <View style={[styles.memberships, styles.locationFlexBox]}>
              <View style={styles.membershipsLabel}>
                <Text style={[styles.membership, styles.cart1Typo]}>Cart</Text>
              </View>
              <View style={styles.cartCard}>
                <View style={styles.totalFlexBox}>
                  <View style={styles.brilliantAllInclusiveParent}>
                    <Text style={[styles.brilliantAll, styles.brilliantTypo]}>
                      {selectedMembershipType?.type}
                    </Text>
                  </View>
                  <View style={[styles.krWrapper, styles.krWrapperFlexBox]}>
                    <Text style={[styles.kr, styles.dkTypo]}>
                      {selectedMembershipType?.price ??
                        '' + (selectedMembershipType ? '  kr.' : '')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.pay, styles.parentFlexBox]}>
                <Button
                  title="Pay"
                  onPress={handleSubmit}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
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
  location1Typo: {
    display: 'flex',
    height: 22,
    textAlign: 'left',
    color: '#000',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 18,
    alignItems: 'center',
  },
  parentFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dkTypo: {
    textAlign: 'right',
    fontSize: 16,
  },
  krWrapperFlexBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cart1Typo: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 18,
  },
  brilliantTypo: {
    fontSize: 18,
    textAlign: 'left',
  },
  totalFlexBox: {
    width: 337,
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  ab12345: {
    color: '#e5e5e5',
    fontFamily: 'Inter-Regular',
  },

  licensePlateParent: {
    gap: 8,
    alignSelf: 'stretch',
  },
  location1: {
    height: 22,
    flex: 1,
  },
  locationLabel: {
    alignSelf: 'stretch',
  },
  dropdown: {
    paddingHorizontal: 0,
    gap: 0,
    justifyContent: 'space-between',
    paddingVertical: 0,
    borderBottomWidth: 6,
    borderColor: '#e5e5e5',
    borderStyle: 'solid',
    flexDirection: 'row',
    overflow: 'hidden',
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  location: {
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  membership: {
    position: 'absolute',
    top: 0,
    left: 5,
  },
  membershipsLabel: {
    height: 22,
    alignSelf: 'stretch',
  },

  brilliant: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 18,
  },

  memberships: {
    gap: 8,
    justifyContent: 'center',
  },
  brilliantAll: {
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
    color: '#000',
  },

  brilliantAllInclusiveParent: {
    gap: 4,
    justifyContent: 'center',
  },
  kr: {
    fontFamily: 'Inter-Regular',
    color: '#000',
    width: '100%',
  },
  krWrapper: {
    paddingVertical: 10,
    overflow: 'hidden',
    paddingHorizontal: 0,
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
  pay: {
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  main: {
    backgroundColor: '#f7f7f7',
    width: '100%',
    padding: 16,
    gap: 30,
    flex: 1,
    alignSelf: 'stretch',
  },
});
