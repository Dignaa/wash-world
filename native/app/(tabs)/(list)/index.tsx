import Card from '@/components/Card';
import { LinkProps } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const halls = [
    {
      location: 'Lorem Ipsum',
      currentStatus: 'OPEN',
      openingHours: '07-22',
      waitTime: '5',
      userDistance: '20KM',
      link: 'https://maps.google.com/' as LinkProps['href'],
    },
  ];

  return (
    <View>
      {halls.map((hall) => (
        <Card key={hall.location} hall={hall} />
      ))}
    </View>
  );
}
