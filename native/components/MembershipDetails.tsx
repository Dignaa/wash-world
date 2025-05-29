// components/MembershipCard.tsx
import { View, Text, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Membership } from '@/types'

export default function MembershipDetails({ membership }: { membership: Membership }) {
  return (
    <View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  addressText: { marginLeft: 10, fontSize: 16 },
  licenseContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ff0000',
    borderWidth: 0.5,
    width: 95,
    height: 35,
    marginLeft: 10,
  },
  dkWrapper: {
    backgroundColor: '#335ab3',
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dk: { color: '#fff' },
  licenseNoWrapper: { justifyContent: 'center', paddingHorizontal: 6 },
  licenseNo: { color: '#000' },
  dkTypo: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 16,
  },
})
