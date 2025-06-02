import { useLocalSearchParams } from 'expo-router'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, Modal } from 'react-native'
import { useEffect, useState } from 'react'
import { Membership, MembershipType } from '@/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Button from '@/components/Button'
import ExtendMembershipModal from '@/components/ExtendMembershipModal'
import UpgradeMembershipModal from '@/components/UpgradeMembershipModal'
import MembershipDetails from '@/components/MembershipDetails'

export default function DetailsScreen() {
  const { userId, token } = useSelector((state: RootState) => state.auth)
  const { carId } = useLocalSearchParams()
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [extendModalVisible, setExtendModalVisible] = useState(false)
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false)

  const fetchMembership = async () => {
    if (!carId) return
    try {
      setLoading(true)
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/${userId}/memberships/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch membership')
      const data: Membership = await res.json()
      setMembership(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembership()
  }, [carId])

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>
  if (error) return <View style={styles.center}><Text>Error: {error}</Text></View>
  if (!membership) return <View style={styles.center}><Text>No membership found.</Text></View>

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MembershipDetails membership={membership} />

      {membership.membershipType.type !== 'Brilliant' && (
        <Button title="Upgrade membership" onPress={() => setUpgradeModalVisible(true)} />
      )}
      <Button title="Extend membership" onPress={() => setExtendModalVisible(true)} />

      <ExtendMembershipModal
        visible={extendModalVisible}
        onClose={() => setExtendModalVisible(false)}
        membership={membership}
        token={token!}
        onExtended={fetchMembership}
      />

      <UpgradeMembershipModal
        visible={upgradeModalVisible}
        onClose={() => setUpgradeModalVisible(false)}
        membership={membership}
        token={token!}
        onUpgraded={fetchMembership}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})