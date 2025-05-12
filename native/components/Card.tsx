import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { LinkProps } from 'expo-router';

type Hall = {
  location: string;
  currentStatus: string;
  openingHours: string;
  waitTime: string;
  userDistance: string;
  link?: LinkProps['href'];
};
type CardProps = {
  hall: Hall;
};

export default function Card({ hall }: CardProps) {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{
          uri: 'https://plus.unsplash.com/premium_photo-1681488098851-e3913f3b1908?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFwfGVufDB8fDB8fHww',
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{hall.location}</Text>
        <View style={styles.row}>
          <Text>Status: {hall.currentStatus}</Text>
          <Text>
            {hall.openingHours}
            <MaterialCommunityIcons name="clock-outline" />
          </Text>
        </View>
        <View style={styles.row}>
          <Text>Gns. ventetid:</Text>
          <Text>{hall.waitTime} min.</Text>
        </View>
        <View style={styles.row}>
          <Text>Afstand fra dig:</Text>
          <Text>{hall.waitTime} km.</Text>
        </View>
        <Button link={hall.link} title="Find vej" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    maxWidth: 500,
    borderColor: '#eeeeee',
    borderWidth: 2,
  },
  image: {
    width: 100,
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
  },
});
