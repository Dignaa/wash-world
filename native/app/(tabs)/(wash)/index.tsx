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
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CreateWashDto, Membership, WashResponse, WashType } from '@/types';
import Button from '@/components/Button';

export default function Index() {
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  // ── 1) Fetch memberships ─────────────────────────────────────────────
  const {
    data: memberships,
    isLoading: membershipsLoading,
    isError: membershipsError,
    error: membershipsErrorObj,
  } = useQuery<Membership[]>({
    queryKey: ['memberships', userId],
    queryFn: async () => {
      const resp = await axios.get<Membership[]>(
        `${baseUrl}user/${userId}/memberships/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return resp.data;
    },
    enabled: Boolean(token && userId),
    staleTime: 1000 * 60 * 5,
  });

  // Active only
  const activeMemberships = useMemo(() => {
    if (!memberships) return [];
    const now = new Date();
    return memberships.filter((m) => {
      const startDate = new Date(m.start);
      const endDate = new Date(m.end);
      return startDate <= now && now <= endDate;
    });
  }, [memberships]);

  // ── 2) Fetch wash‐types ─────────────────────────────────────────────
  const {
    data: washTypes,
    isLoading: washTypesLoading,
    isError: washTypesError,
    error: washTypesErrorObj,
  } = useQuery<WashType[]>({
    queryKey: ['washTypes'],
    queryFn: async () => {
      const resp = await axios.get<WashType[]>(`${baseUrl}wash-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // ── 3) Local state ────────────────────────────────────────────────────
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

  const onNewWash = () => {
    setShowRatingInput(false);
    setWashStopped(false);
    setWashId(null);
    setPickedReg('');
    setManualReg('');
    setSelectedWashTypeId(null);
    setRating(0);
    setIsWashing(false);
  };

  useEffect(() => {
    onNewWash();
  }, [userId, token]);

  // ── 4) Derive “selectedMembership” from dropdown only ──
  const selectedMembership = useMemo<Membership | null>(() => {
    if (!activeMemberships.length) return null;
    return (
      activeMemberships.find((m) => m.car.registrationNumber === pickedReg) ||
      null
    );
  }, [pickedReg, activeMemberships]);

  // ── 5) Which washType is “free” ─────────────────────────────────────
  const freeWashType: WashType | null = useMemo(() => {
    if (!selectedMembership || !washTypes) return null;
    return (
      washTypes.find(
        (w) =>
          w.type.toLowerCase() ===
          selectedMembership.membershipType.type.toLowerCase(),
      ) || null
    );
  }, [selectedMembership, washTypes]);

  useEffect(() => {
    if (freeWashType) {
      setSelectedWashTypeId(freeWashType.id);
    }
  }, [freeWashType]);

  // ── 6) Create wash mutation ───────────────────────────────────────────
  const createWashMutation = useMutation<WashResponse, unknown, CreateWashDto>({
    mutationFn: async (newWashDto) => {
      const resp = await axios.post<WashResponse>(
        `${baseUrl}wash`,
        newWashDto,
        {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        },
      );
      return resp.data;
    },
    onSuccess: (data) => {
      setWashId(data.id);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // ── 7) Update wash mutation ───────────────────────────────────────────
  const updateWashMutation = useMutation<
    WashResponse,
    unknown,
    { washId: number; payload: { emergencyStop?: boolean; rating?: number } }
  >({
    mutationFn: async ({ washId, payload }) => {
      const resp = await axios.patch<WashResponse>(
        `${baseUrl}wash/${washId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return resp.data;
    },
  });

  // ── 8) Timer effect ─────────────────────────────────────────────────
  useEffect(() => {
    if (washId !== null && !washStopped) {
      setIsWashing(true);
      setCountdown(300);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [washId]);

  // ── 9) Start wash handler ────────────────────────────────────────────
  const onStartVask = () => {
    // require either dropdown or manual:
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

    // build DTO
    const isManual = Boolean(manualReg);
    const dto: CreateWashDto = {
      ...(isManual
        ? { licensePlate: manualReg.trim().toUpperCase() }
        : { carId: selectedMembership!.car.id }),
      userId: userId || null,
      locationId: selectedMembership!
        ? selectedMembership.location.id
        : /* fallback location */ 4,
      washTypeId: selectedWashTypeId,
    };

    createWashMutation.mutate(dto);
  };

  // ── 10) Stop wash ────────────────────────────────────────────────────
  const onStopVask = () => {
    if (washId === null) return;
    if (timerId !== null) clearInterval(timerId);
    setCountdown(0);
    setIsWashing(false);
    setShowRatingInput(true);
    setWashStopped(true);

    updateWashMutation.mutate({
      washId,
      payload: { emergencyStop: true },
    });
  };

  // ── 11) Submit rating ────────────────────────────────────────────────
  const onSubmitRating = () => {
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
  };

  // ── 12) Loading / Error ──────────────────────────────────────────────
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

  // ── 13) UI: Before wash starts ────────────────────────────────────────
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

  // ── 14) Washing ───────────────────────────────────────────────────────
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

  // ── 15) Rating ────────────────────────────────────────────────────────
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

  return null;
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
