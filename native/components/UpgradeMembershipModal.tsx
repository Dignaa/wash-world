// components/UpgradeMembershipModal.tsx
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Membership, MembershipType } from '@/types';
import Button from './Button';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { RootState } from '@/store/store';

export default function UpgradeMembershipModal({
  visible,
  onClose,
  membership,
  token,
  onUpgraded,
}: {
  visible: boolean;
  onClose: () => void;
  membership: Membership;
  token: string;
  onUpgraded: () => void;
}) {
  const queryClient = useQueryClient();
  const { userId } = useSelector((state: RootState) => state.auth);
  const [types, setTypes] = useState<MembershipType[]>([]);
  const [selectedType, setSelectedType] = useState<MembershipType | null>(null);

  useEffect(() => {
    if (!visible) return;
    const fetchTypes = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}membership-types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const all = await res.json();
        const better = all.filter(
          (t: MembershipType) => t.price > membership.membershipType.price,
        );
        setTypes(better);
        if (better.length > 0) setSelectedType(better[0]);
      } catch (err: any) {
        alert(err.message);
      }
    };
    fetchTypes();
  }, [visible]);

  const priceDifference = selectedType
    ? selectedType.price - membership.membershipType.price
    : 0;

  const handleConfirm = async () => {
    if (!selectedType) return;
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}user/${membership.user.id}/memberships/${membership.id}/upgrade`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newTypeId: selectedType.id }),
        },
      );
      if (!res.ok) throw new Error('Upgrade failed');
      await res.json();
      queryClient.invalidateQueries({ queryKey: ['memberships', userId] });
      onClose();
      onUpgraded();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Upgrade Membership</Text>
          <FlatList
            data={types}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedType(item)}
                style={[
                  styles.item,
                  selectedType?.id === item.id && styles.selected,
                ]}
              >
                <Text
                  style={
                    selectedType?.id === item.id ? { color: '#fff' } : undefined
                  }
                >
                  {item.type} - {item.price} DKK/M
                </Text>
              </Pressable>
            )}
            style={{ maxHeight: 200 }}
          />
          <Text>Price difference: {priceDifference} DKK</Text>
          <Button
            title="Confirm and Pay"
            onPress={handleConfirm}
            disabled={priceDifference <= 0}
          />
          <Pressable onPress={onClose}>
            <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  item: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
  },
  selected: { backgroundColor: '#335ab3', borderColor: '#224488' },
});
