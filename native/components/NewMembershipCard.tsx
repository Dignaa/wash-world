import * as React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CardProps = {
  membershipType: string;
  price: number;
  selected?: boolean;
  onPress?: () => void;
};

export default function NewMembershipCard({
  membershipType,
  price,
  selected,
  onPress,
}: CardProps) {
  const styles = StyleSheet.create({
    price: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      textAlign: 'left',
      color: selected ? '#FFFFFF' : '#000000',
    },
    membershipType: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      textAlign: 'left',
      color: selected ? '#FFFFFF' : '#000000',
      fontWeight: selected ? 'bold' : '400',
    },
    card: {
      borderRadius: 6,
      borderColor: '#eee',
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 6,
      borderStyle: 'solid',
      alignSelf: 'stretch',
      gap: 0,
      width: '100%',
      minHeight: 50,
      backgroundColor: selected ? '#06C167' : '#FFFFFF',
      color: selected ? '#FFFFFF' : '#000000',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={{ width: '100%' }}>
        <Text style={[styles.membershipType]}>{membershipType}</Text>
        <Text style={[styles.price]}>{price} kr./mnd</Text>
      </Pressable>
    </View>
  );
}
