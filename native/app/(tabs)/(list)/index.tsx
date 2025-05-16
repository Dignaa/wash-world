// app/index.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import { Location as LocationType } from '@/types/location';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Index() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    fetchLocations().finally(initLocationIfAllowed);
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}location`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: LocationType[] = await res.json();
      if (!res.ok) throw new Error((data as any).message || 'Fetch failed');
      setLocations(data);
    } catch (error: any) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const initLocationIfAllowed = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      await sortByDistance();
    }
  };

  const sortByDistance = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setHasPermission(false);
      return;
    }
    setHasPermission(true);

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    const { latitude, longitude } = position.coords;

    const withDistances = locations.map((loc) => ({
      ...loc,
      distance: Math.round(getDistance(latitude, longitude, loc.y, loc.x)),
    }));
    withDistances.sort((a, b) => a.distance! - b.distance!);
    setLocations(withDistances);
  };

  // Haversine formula by chatgpt (straight line from a to b (no roads))
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
      {hasPermission === false && (
        <Button title="Brug lokation" onPress={sortByDistance} />
      )}

      {locations.length === 0 ? (
        <Text style={styles.empty}>No locations found.</Text>
      ) : (
        locations.map((location) => (
          <Card key={location.id} location={location} />
        ))
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
