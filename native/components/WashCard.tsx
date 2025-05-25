import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CardProps = {
  car: string;
  washType: string;
  location: string;
  date: string;
  rating: number;
};

export default function WashCard({
  washType,
  location,
  date,
  rating,
  car,
}: CardProps) {
  return (
    <SafeAreaView style={styles.card}>
      <View style={styles.cardGroup}>
        <View style={styles.locationParent}>
          <Text style={styles.location}>{location}</Text>
          <Text style={[styles.wash, styles.text]}>
            {washType} - {car}
          </Text>
        </View>
        <View style={styles.dateParent}>
          <Text style={[styles.date, styles.text]}>{date}</Text>
          <Text style={[styles.date, styles.text]}>
            {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  location: {
    fontSize: 18,
    textAlign: 'left',
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  wash: {
    textAlign: 'left',
  },
  locationParent: {
    gap: 4,
    justifyContent: 'center',
  },
  date: {
    textAlign: 'right',
  },
  dateParent: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  cardGroup: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 0,
    gap: 0,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  card: {
    borderRadius: 6,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#eee',
    borderWidth: 1,
    flex: 1,
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 0,
    alignSelf: 'stretch',
  },
});
