import { View, Text, Modal, Pressable, Platform, StyleSheet } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import { Membership } from '@/types'
import Button from './Button'

export default function ExtendMembershipModal({
  visible,
  onClose,
  membership,
  token,
  onExtended,
}: {
  visible: boolean
  onClose: () => void
  membership: Membership
  token: string
  onExtended: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState(0)

  useEffect(() => {
    if (selectedDate) {
      const start = new Date(membership.end)
      const days = Math.ceil((selectedDate.getTime() - start.getTime()) / (1000 * 3600 * 24))
      const price = days > 0 ? Math.ceil((membership.membershipType.price / 30) * days) : 0
      setCalculatedPrice(price)
    }
  }, [selectedDate])

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (date) setSelectedDate(date)
  }

  const handleConfirm = async () => {
    if (!selectedDate) return
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/${membership.user.id}/memberships/${membership.id}/extend`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEndDate: selectedDate }),
      })
      if (!res.ok) throw new Error('Extension failed')
      await res.json()
      onClose()
      onExtended()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Extend Membership</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
            <Text>{selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={selectedDate || new Date(membership.end)}
              minimumDate={new Date(membership.end)}
              onChange={handleDateChange}
            />
          )}
          <Text>Price: {calculatedPrice} DKK</Text>
          <Button title="Confirm and Pay" onPress={handleConfirm} disabled={calculatedPrice <= 0} />
          <Pressable onPress={onClose}><Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text></Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '80%' },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  dateBox: { padding: 10, backgroundColor: '#eee', borderRadius: 6, marginVertical: 10 },
})
