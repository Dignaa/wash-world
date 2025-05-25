import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { Location } from '@/types/location';
import { showLocation } from 'react-native-map-link';

type CardProps = {
  location: Location;
};

export default function Card({ location }: CardProps) {
  const statusColor =
    location.status === 'operational'
      ? 'green'
      : location.status === 'maintenance'
        ? 'yellow'
        : 'red';

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{
          uri: location.imageUrl,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{location.address}</Text>
        <View style={styles.row}>
          <View style={styles.row}>
            <Text>Status: </Text>
            <View
              style={[styles.indicator, { backgroundColor: statusColor }]}
            />
          </View>
          <View style={styles.row}>
            <Text>
              {location.openFrom} - {location.openTo}
            </Text>
            <MaterialCommunityIcons name="clock-outline" />
          </View>
        </View>
        {location.distance !== null && location.distance !== undefined && (
          <View style={styles.row}>
            <Text>Afstand fra dig:</Text>
            <Text>{`≈ ${location.distance} km.`}</Text>
          </View>
        )}
        <Button
          title="Find vej"
          onPress={() => {
            showLocation({
              latitude: location.y,
              longitude: location.x,
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    maxWidth: 500,
    marginInline: 'auto',
    borderColor: '#eeeeee',
    borderWidth: 2,
  },
  image: {
    width: 150,
    height: '100%',
  },
  content: {
    padding: 16,
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: 10,
  },
});
