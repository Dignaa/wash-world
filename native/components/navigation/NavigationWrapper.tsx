import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { Stack, useRouter } from "expo-router"; // Import useRouter
import { AppDispatch, RootState } from "@/store";
import { reloadJwtFromStorage } from "@/features/user/userSlice";
import { fetchExpenses } from "@/features/expenses/expensesSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";

export default function NavigationWrapper() {
    const token = useSelector((state: RootState) => state.user.token);
    const router = useRouter(); // Initialize router
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        async function getValueFor() {
            try {
                const storedValue = await SecureStore.getItemAsync("jwt");
                if (storedValue) {
                    const userObj = JSON.parse(storedValue);
                    dispatch(reloadJwtFromStorage(userObj));
                }
            } catch (error) {
                console.error("Error fetching JWT:", error);
            } finally {
                setLoading(false);
            }
        }
        getValueFor();
    }, [dispatch]);

    useEffect(() => {
        if (!loading) {
            if (token) {
                router.replace("/(authorized)/Overview");
                dispatch(fetchExpenses());
                dispatch(fetchCategories());
            } else {
                router.replace("/(unauthorized)/SignIn");
            }
        }
    }, [token, loading, router]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="(authorized)" options={{ headerShown: false }} />
            <Stack.Screen name="(unauthorized)" options={{ headerShown: false }} />
        </Stack>
    );
}
