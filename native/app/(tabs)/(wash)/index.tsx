import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useMemberships } from '@/hooks/useMemberships';
import { useWashTypes } from '@/hooks/useWashTypes';
import { useCreateWash } from '@/hooks/useCreateWash';
import { useUpdateWash } from '@/hooks/useUpdateWash';
import { CreateWashDto, Membership, WashType } from '@/types';

export default function Index() {
  const { userId } = useSelector((state: RootState) => state.auth);

  const {
    data: memberships,
    isLoading: membershipsLoading,
    isError: membershipsError,
    error: membershipsErrorObj,
  } = useMemberships();

  const {
    data: washTypes,
    isLoading: washTypesLoading,
    isError: washTypesError,
    error: washTypesErrorObj,
  } = useWashTypes();

  const createWashMutation = useCreateWash();
  const updateWashMutation = useUpdateWash();

  // State
  const [pickedReg, setPickedReg] = useState<string>('');
  const [manualReg, setManualReg] = useState<string>('');
  const [selectedWashTypeId, setSelectedWashTypeId] = useState<number | null>(
    null,
  );
  const [isWashing, setIsWashing] = useState(false);
  const [countdown, setCountdown] = useState<number>(300);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [washId, setWashId] = useState<number | null>(null);
  const [washStopped, setWashStopped] = useState(false);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const activeMemberships: Membership[] = (() => {
    if (!memberships) return [];
    const now = new Date();
    return memberships.filter((m) => {
      const startDate = new Date(m.start);
      const endDate = new Date(m.end);
      return startDate <= now && now <= endDate;
    });
  })();

  const selectedMembership: Membership | null =
    activeMemberships.find((m) => m.car.registrationNumber === pickedReg) ??
    null;

  const freeWashType: WashType | null =
    selectedMembership && washTypes
      ? (washTypes.find(
          (w) =>
            w.type.toLowerCase() ===
            selectedMembership.membershipType.type.toLowerCase(),
        ) ?? null)
      : null;

  // Effects
  // reset component when auth changes
  useEffect(() => {
    onNewWash();
  }, [userId]);
  // set the default wash‑type when membership changes
  useEffect(() => {
    if (!selectedMembership || !washTypes) return;
    const free =
      washTypes.find(
        (w) =>
          w.type.toLowerCase() ===
          selectedMembership.membershipType.type.toLowerCase(),
      ) ?? null;
    if (free) setSelectedWashTypeId(free.id);
  }, [selectedMembership, washTypes]);
  // timer handling
  useEffect(() => {
    if (washId !== null && !washStopped) {
      setIsWashing(true);
      setCountdown(300); //300sec = 5min
      const id = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setIsWashing(false);
            setShowRatingInput(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(id as unknown as number);
    }
    return () => {
      if (timerId !== null) clearInterval(timerId);
    };
  }, [washId]);

  // Handelers
  function onNewWash() {
    setShowRatingInput(false);
    setWashStopped(false);
    setWashId(null);
    setPickedReg('');
    setManualReg('');
    setSelectedWashTypeId(null);
    setRating(0);
    setIsWashing(false);
  }
  function onStartVask() {
    if (!pickedReg && !manualReg) {
      Alert.alert(
        'Fejl',
        'Vælg eller indtast venligst et registreringsnummer.',
      );
      return;
    }
    if (!selectedWashTypeId) {
      Alert.alert('Fejl', 'Vælg venligst en vaske-type.');
      return;
    }

    const isManual = Boolean(manualReg);
    const dto: CreateWashDto = {
      ...(isManual
        ? { licensePlate: manualReg.trim().toUpperCase() }
        : { carId: selectedMembership!.car.id }),
      userId,
      locationId: selectedMembership ? selectedMembership.location.id : 4,
      washTypeId: selectedWashTypeId,
    };

    createWashMutation.mutate(dto, {
      onSuccess: (data) => setWashId(data.id),
    });
  }
  function onStopVask() {
    if (washId === null) return;
    if (timerId !== null) clearInterval(timerId);
    setCountdown(0);
    setIsWashing(false);
    setShowRatingInput(true);
    setWashStopped(true);

    updateWashMutation.mutate({ washId, payload: { emergencyStop: true } });
  }
  function onSubmitRating() {
    if (washId === null || rating < 1 || rating > 5) {
      Alert.alert('Fejl', 'Indtast venligst en rating mellem 1 og 5.');
      return;
    }
    setRatingSubmitting(true);
    updateWashMutation.mutate(
      { washId, payload: { rating } },
      {
        onSuccess: () => {
          setRatingSubmitting(false);
          Alert.alert('Tak!', 'Din rating er modtaget.');
          onNewWash();
        },
        onError: () => {
          setRatingSubmitting(false);
          Alert.alert('Fejl', 'Kunne ikke indsende rating. Prøv igen.');
        },
      },
    );
  }

  // Errors
  if (membershipsLoading || washTypesLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Indlæser data…</Text>
      </View>
    );
  }
  if (membershipsError) {
    return (
      <View style={styles.centered}>
        <Text>Kunne ikke hente medlemskaber:</Text>
        <Text style={{ color: 'red' }}>
          {(membershipsErrorObj as Error).message}
        </Text>
      </View>
    );
  }
  if (washTypesError) {
    return (
      <View style={styles.centered}>
        <Text>Kunne ikke hente vaske-typer:</Text>
        <Text style={{ color: 'red' }}>
          {(washTypesErrorObj as Error).message}
        </Text>
      </View>
    );
  }

  // Before wash starts
  if (!isWashing && !showRatingInput) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Vælg dit køretøj</Text>

        {/* Dropdown */}
        <Picker
          selectedValue={pickedReg}
          onValueChange={(val) => {
            setPickedReg(val);
            setManualReg(''); // clear manual when picking
          }}
          style={styles.picker}
        >
          <Picker.Item label="Vælg registrering" value="" />
          {activeMemberships.map((m) => (
            <Picker.Item
              key={m.car.id}
              label={m.car.registrationNumber}
              value={m.car.registrationNumber}
            />
          ))}
        </Picker>

        <Text style={styles.orText}>— ELLER —</Text>

        {/* Manual input */}
        <TextInput
          placeholder="Indtast registreringsnummer manuelt"
          value={manualReg}
          onChangeText={(txt) => {
            setManualReg(txt);
            setPickedReg(''); // clear dropdown when typing
          }}
          style={styles.textInput}
          autoCapitalize="characters"
        />

        {/* wash-type options */}
        {(!manualReg ? selectedMembership : true) && (
          <>
            <Text style={[styles.heading, { marginTop: 20 }]}>
              Vælg vaske-type
            </Text>
            {washTypes?.map((w) => {
              const isFree =
                !manualReg && freeWashType && freeWashType.id === w.id;
              const extraCost = isFree
                ? 0
                : Math.max(0, w.price - (freeWashType?.price ?? 0));
              return (
                <TouchableOpacity
                  key={w.id}
                  style={[
                    styles.washOption,
                    selectedWashTypeId === w.id && styles.washOptionSelected,
                  ]}
                  onPress={() => setSelectedWashTypeId(w.id)}
                >
                  <View style={styles.washOptionText}>
                    <Text>{w.type}</Text>
                    <Text>{isFree ? 'GRATIS' : `+${extraCost},-`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.startButton}
              onPress={onStartVask}
              disabled={createWashMutation.status === 'pending'}
            >
              {createWashMutation.status === 'pending' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.startButtonText}>Start vask</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
  // Washing
  if (isWashing) {
    const minutes = Math.floor(countdown / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (countdown % 60).toString().padStart(2, '0');
    return (
      <View style={styles.centered}>
        <Text style={styles.heading}>Vasken kører…</Text>
        <Text style={styles.timerText}>
          {minutes}:{seconds}
        </Text>
        <TouchableOpacity style={styles.stopButton} onPress={onStopVask}>
          <Text style={styles.stopButtonText}>Stop vask</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // Rating
  if (showRatingInput) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Bedøm din vask</Text>
        <TextInput
          placeholder="Indtast rating (1-5)"
          keyboardType="number-pad"
          value={rating === 0 ? '' : rating.toString()}
          onChangeText={(txt) => {
            const num = parseInt(txt, 10);
            if (!Number.isNaN(num)) setRating(num);
          }}
          style={styles.textInput}
          maxLength={1}
        />
        <TouchableOpacity
          style={styles.startButton}
          onPress={onSubmitRating}
          disabled={ratingSubmitting}
        >
          {ratingSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startButtonText}>Send rating</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.startButton]} onPress={onNewWash}>
          <Text style={styles.startButtonText}>Start ny vask</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  picker: {
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 4,
    borderBottomColor: '#E5E5E5',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#6B7280',
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'black',
    textAlign: 'left',
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    borderBottomWidth: 6,
    flex: 1,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingInline: 10,
    paddingBlock: 5,
    marginVertical: 8,
    textAlignVertical: 'center',
    maxHeight: 50,
  },
  warningText: {
    color: '#B91C1C',
    marginBottom: 8,
  },
  washOption: {
    padding: 12,
    backgroundColor: '#FFF',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  washOptionSelected: {
    borderColor: '#06C167',
  },
  washOptionText: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  startButton: {
    marginTop: 8,
    backgroundColor: '#06C167',
    borderBottomColor: '#198B47',
    borderBottomWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 20,
    color: '#111827',
  },
  stopButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  stopButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
