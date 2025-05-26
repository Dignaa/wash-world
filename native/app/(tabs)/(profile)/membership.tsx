import { Location } from '@/types';
import { useRouter } from 'expo-router';

import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
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

interface CreateMembershipDTO {
  locationId: number;
  typeId: number;
  licensePlate: string;
  userId?: string | null;
}

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error, userId, username } = useSelector(
    (state: RootState) => state.auth,
  );
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
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </SafeAreaView>
    );
  }

  if (token) {
    return (
      <SafeAreaView style={styles.main}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.memberships, styles.locationFlexBox]}>
            <View style={styles.membershipsLabel}>
              <Text style={[styles.membership, styles.cart1Typo]}>
                License Plate
              </Text>
            </View>
            <LicensePlateInput text={licensePlate} onChange={setLicensePlate} />
          </View>
          <View style={[styles.location, styles.locationFlexBox]}>
            <View style={styles.licensePlateParent}>
              <View style={[styles.locationLabel, styles.parentFlexBox]}>
                <Text style={[styles.location1, styles.location1Typo]}>
                  Location
                </Text>
                <Text style={styles.closest}>Closest</Text>
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
          <View style={styles.licensePlateParent}>
            <Text style={styles.cart1Typo}>Cart</Text>
            <View style={styles.cartCard}>
              <View style={styles.totalFlexBox}>
                <View style={styles.brilliantAllInclusiveParent}>
                  <Text style={[styles.brilliantAll, styles.brilliantTypo]}>
                    Brilliant / All inclusive
                  </Text>
                  <Text style={[styles.inPeriod15, styles.krmndTypo]}>
                    In period 15 May - 14 June 2025
                  </Text>
                </View>
                <View style={[styles.krWrapper, styles.krWrapperFlexBox]}>
                  <Text style={[styles.kr, styles.dkTypo]}>199 kr.</Text>
                </View>
              </View>
              <View style={styles.totalFlexBox}>
                <View style={styles.signUpFeeWrapper}>
                  <Text style={[styles.brilliantAll, styles.brilliantTypo]}>
                    Sign-up fee
                  </Text>
                </View>
                <View style={[styles.krWrapper, styles.krWrapperFlexBox]}>
                  <Text style={[styles.kr, styles.dkTypo]}>99 kr.</Text>
                </View>
              </View>
              <View style={styles.totalFlexBox}>
                <View style={styles.signUpFeeWrapper}>
                  <Text style={[styles.brilliantAll, styles.brilliantTypo]}>
                    Tax 25%
                  </Text>
                </View>
                <View style={[styles.krWrapper, styles.krWrapperFlexBox]}>
                  <Text style={[styles.kr, styles.dkTypo]}>74,75 kr.</Text>
                </View>
              </View>
              <View style={[styles.total, styles.totalFlexBox]}>
                <View style={styles.signUpFeeWrapper}>
                  <Text style={[styles.taxes1, styles.kr3Typo]}>To pay</Text>
                </View>
                <View style={[styles.krWrapper, styles.krWrapperFlexBox]}>
                  <Text style={[styles.kr3, styles.dkTypo]}>373,75 kr.</Text>
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
        </ScrollView>
      </SafeAreaView>
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
  frameGroupBorder: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 4,
    borderRadius: 4,
    gap: 0,
    justifyContent: 'space-between',
    borderStyle: 'solid',
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  kr3Typo: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  brilliantTypo: {
    fontSize: 18,
    textAlign: 'left',
  },
  krmndFlexBox: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  krmndTypo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
  },
  krmnd1Clr: {
    color: '#343434',
    textAlign: 'left',
  },
  frameChildLayout: {},
  totalFlexBox: {
    width: 337,
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  licensePlate1: {
    height: 22,
    alignSelf: 'stretch',
  },
  dk: {
    color: '#fff',
    fontFamily: 'Inter-Regular',
  },
  dkWrapper: {
    backgroundColor: '#335ab3',
    width: 36,
    paddingHorizontal: 3,
    paddingVertical: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  ab12345: {
    color: '#e5e5e5',
    fontFamily: 'Inter-Regular',
  },
  ab12345Wrapper: {
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderBottomWidth: 6,
    borderColor: '#e5e5e5',
    borderStyle: 'solid',
    overflow: 'hidden',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'stretch',
  },
  frameParent: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignSelf: 'stretch',
  },
  licensePlateParent: {
    gap: 8,
    alignSelf: 'stretch',
  },
  licensePlate: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  location1: {
    height: 22,
    flex: 1,
  },
  closest: {
    textDecorationLine: 'underline',
    color: '#06c167',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'left',
  },
  locationSharpIcon: {
    overflow: 'hidden',
  },
  locationLabel: {
    alignSelf: 'stretch',
  },
  vectorIcon: {},
  chevronDownSharp: {
    flex: 1,
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
  allInclusive: {
    color: '#fff',
    fontFamily: 'Inter-Regular',
    textAlign: 'left',
  },
  brilliantParent: {
    gap: 4,
  },

  krmnd: {
    color: '#fff',
  },
  krmndParent: {
    flex: 1,
  },
  frameGroup: {
    borderColor: '#198b47',
    backgroundColor: '#06c167',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
  },
  membershipTypeSelcetedInner: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'solid',
    alignSelf: 'stretch',
  },
  membershipTypeSelceted: {
    borderRadius: 8,
    width: 361,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  premium: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  krmnd1: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  frameChild: {
    borderRadius: 50,
    backgroundColor: '#fff',
    width: 22,
  },
  krmndGroup: {
    width: 171,
  },
  membershipTypeGrey: {
    backgroundColor: '#e5e5e5',
    width: 350,
    borderColor: '#e5e5e5',
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
  inPeriod15: {
    color: '#000',
  },
  brilliantAllInclusiveParent: {
    gap: 4,
    justifyContent: 'center',
  },
  kr: {
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  krWrapper: {
    paddingVertical: 10,
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  signUpFeeWrapper: {
    justifyContent: 'center',
  },
  taxes1: {
    textAlign: 'left',
    color: '#000',
    fontSize: 18,
  },
  kr3: {
    color: '#000',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  total: {
    borderColor: '#000',
    borderTopWidth: 1,
    paddingVertical: 4,
    borderStyle: 'solid',
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
    gap: 40,
    flex: 1,
    alignSelf: 'stretch',
  },
});
