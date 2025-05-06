import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { signUp } from "@/features/user/userSlice";
import { NewUserEntity } from "@/features/user/userEntities";
import { useRouter } from "expo-router";

export default function SignUp() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const error = useSelector((state: RootState) => state.user.errormessage);
    const newUser = useSelector((state: RootState) => state.user.user);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        dispatch(signUp(new NewUserEntity(username, password)));
    };

    return newUser == undefined ? (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(unauthorized)/SignIn")}>
                <Text style={styles.signupText}>Already have an account?</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={styles.container}>
            <Text style={styles.successText}>New User Created!</Text>
            <Text style={styles.usernameText}>{newUser.username}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    router.push("/(unauthorized)/SignIn");
                }}>
                <Text style={styles.buttonText}>Continue</Text>
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
