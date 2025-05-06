import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/features/user/userSlice";
import { AppDispatch } from "@/store";

export default function Profile() {
    const dispatch = useDispatch<AppDispatch>();

    const signOut = () => {
        dispatch(logoutUser());
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={signOut} style={styles.button}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: "90%",
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    successText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "green",
        marginBottom: 10,
    },
    usernameText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 10,
        width: "90%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signupText: {
        marginTop: 15,
        color: "#007bff",
        fontSize: 14,
    },
});
