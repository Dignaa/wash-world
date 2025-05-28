import { useLocalSearchParams } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  Platform,
  FlatList,
} from 'react-native'
import { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Membership, MembershipType } from '@/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Button from '@/components/Button'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { waitFor } from '@testing-library/react-native'

export default function DetailsScreen() {
  const { userId, token } = useSelector((state: RootState) => state.auth)
  const { carId } = useLocalSearchParams()
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calculatedPrice, setCalculatedPrice] = useState(0)

  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false)
  const [availableTypes, setAvailableTypes] = useState<MembershipType[]>([])
  const [selectedUpgradeType, setSelectedUpgradeType] = useState<MembershipType | null>(null)
  const [upgradePriceDifference, setUpgradePriceDifference] = useState(0)

  useEffect(() => {
    if (!carId) return
    setLoading(true)
    setError(null)

    const fetchMembership = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}user/${userId}/memberships/${carId}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }
        )
        if (!res.ok) throw new Error('Failed to fetch membership')
        const data: Membership = await res.json()
        setMembership(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchMembership()
  }, [carId])

  useEffect(() => {
    if (selectedDate && membership) {
      const start = new Date(membership.end)
      const end = selectedDate
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
      if (days > 0) {
        const monthlyPrice = membership.membershipType.price
        const price = Math.ceil((monthlyPrice / 30) * days)
        setCalculatedPrice(price)
      } else setCalculatedPrice(0)
    }
  }, [selectedDate])

  useEffect(() => {
    if (selectedUpgradeType && membership) {
      const difference = selectedUpgradeType.price - membership.membershipType.price
      setUpgradePriceDifference(difference > 0 ? difference : 0)
    }
  }, [selectedUpgradeType])

  const handleExtendPress = () => {
    setSelectedDate(new Date(membership!.end))
    setModalVisible(true)
  }

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (date) setSelectedDate(date)
  }

  const handleConfirmExtend = async () => {
    if (!selectedDate || !membership) return
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${membership.user.id}/memberships/${membership.id}/extend`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ newEndDate: selectedDate }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Extension failed')
      }
      const updatedMembership: Membership = await response.json()
      setMembership(updatedMembership)
      setModalVisible(false)
      Alert.alert('Success', `Extended until ${new Date(updatedMembership.end).toLocaleDateString()}`)
    } catch (err: any) {
      Alert.alert('Error', err.message)
    }
  }

  const handleUpgradePress = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}membership-types`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to fetch membership types')
      const types: MembershipType[] = await res.json()
      const higherTypes = types.filter(t => t.price > membership!.membershipType.price)
      setAvailableTypes(higherTypes)
      if (higherTypes.length > 0) setSelectedUpgradeType(higherTypes[0])
      setUpgradeModalVisible(true)
    } catch (err: any) {
      Alert.alert('Error', err.message)
    }
  }

  const handleConfirmUpgrade = async () => {
    if (!selectedUpgradeType || !membership) return
    try {      
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${membership.user.id}/memberships/${membership.id}/upgrade`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ newTypeId: selectedUpgradeType.id }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upgrade failed')
      }
      const updatedMembership: Membership = await response.json()
      setMembership(updatedMembership)
      setUpgradeModalVisible(false)
      Alert.alert('Success', `Upgraded to ${updatedMembership.membershipType.type}`)
    } catch (err: any) {
      Alert.alert('Error', err.message)
    }
  }

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )

  if (error)
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    )

  if (!membership)
    return (
      <View style={styles.container}>
        <Text>No membership found.</Text>
      </View>
    )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{membership.membershipType.type} medlemskab</Text>
      <View style={styles.row}>
        <MaterialCommunityIcons name="car" size={28} />
        <View style={styles.licenseContainer}>
          <View style={styles.dkWrapper}>
            <Text style={[styles.dk, styles.dkTypo]}>DK</Text>
          </View>
          <View style={styles.licenseNoWrapper}>
            <Text style={[styles.licenseNo, styles.dkTypo]}>{membership.car.registrationNumber}</Text>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons name="map" size={28} />
        <Text style={styles.addressText}>{membership.location.address}</Text>
      </View>
      <Text>Price: {membership.membershipType.price} DKK/M.</Text>
      <Text>Start: {new Date(membership.start).toLocaleDateString()}</Text>
      <Text>End: {new Date(membership.end).toLocaleDateString()}</Text>

      {membership.membershipType.type !== 'Brilliant' && (
        <Button title="Upgrade membership" onPress={handleUpgradePress} />
      )}
      <Button title="Extend membership" onPress={handleExtendPress} />

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Extend Membership</Text>
            <Text>Current end date: {new Date(membership.end).toLocaleDateString()}</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
              <Text>{selectedDate ? `New end date: ${selectedDate.toLocaleDateString()}` : 'Choose date'}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={selectedDate || new Date(membership.end)}
                minimumDate={new Date(membership.end)}
                onChange={handleDateChange}
              />
            )}
            <Text style={styles.priceText}>Price: {calculatedPrice} DKK</Text>
            <Button title="Confirm and Pay" onPress={handleConfirmExtend} disabled={calculatedPrice <= 0} />
            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={upgradeModalVisible}
        onRequestClose={() => setUpgradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Upgrade Membership</Text>
            <Text>Current type: {membership.membershipType.type}</Text>

            <FlatList
              data={availableTypes}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedUpgradeType(item)}
                  style={[
                    styles.upgradeItem,
                    selectedUpgradeType?.id === item.id && styles.selectedUpgradeItem,
                  ]}
                >
                  <Text style={[styles.upgradeItemText, selectedUpgradeType?.id === item.id && { color: '#fff' }]}>
                    {item.type} - {item.price} DKK/M
                  </Text>
                </Pressable>
              )}
              style={{ maxHeight: 200, marginVertical: 10 }}
            />

            <Text style={styles.priceText}>Price difference: {upgradePriceDifference} DKK</Text>
            <Button title="Confirm and Pay" onPress={handleConfirmUpgrade} disabled={upgradePriceDifference <= 0} />
            <Pressable onPress={() => setUpgradeModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    marginLeft: 10,
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
  addressText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  dateBox: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginVertical: 10,
  },
  priceText: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeItem: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    width: 250,
  },
  selectedUpgradeItem: {
    backgroundColor: '#335ab3',
    borderColor: '#224488',
  },
  upgradeItemText: {
    color: '#000',
  },
})
