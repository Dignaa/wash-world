import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import { Location as LocationType } from '@/types';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { getDistance } from '@/utils/distance';

export default function Index() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Effects
  useEffect(() => {
    const fetch = async () => {
      const data = await fetchLocations();
      await initLocationIfAllowed(data);
    };
    fetch();
  }, []);

  const fetchLocations = async (): Promise<LocationType[]> => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}location`);
      const data: LocationType[] = await res.json();
      if (!res.ok) throw new Error((data as any).message || 'Fetch failed');
      setLocations(data);
      return data;
    } catch (e: any) {
      console.error('Fetch error:', e.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const initLocationIfAllowed = async (data: LocationType[]) => {
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      status = permissionResponse.status;
    }

    setHasPermission(status === 'granted');

    if (status === 'granted') {
      sortByDistance(data);
    }
  };

  const sortByDistance = async (data: LocationType[]) => {
    // no need to re-request permission here
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const withDistances = data
      .map((loc) => ({
        ...loc,
        distance: Math.round(
          getDistance(coords.latitude, coords.longitude, loc.y, loc.x),
        ),
      }))
      .sort((a, b) => a.distance! - b.distance!);

    setLocations(withDistances);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasPermission !== true && (
        <Button
          title="Brug lokation"
          onPress={() => sortByDistance(locations)}
        />
      )}

      {locations.length === 0 ? (
        <Text style={styles.empty}>No locations found.</Text>
      ) : (
        locations.map((loc) => <Card key={loc.id} location={loc} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
