import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NewUserEntity } from "@/features/user/userEntities";
import { signIn } from "@/features/user/userSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "expo-router";

export default function SignIn() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const error = useSelector((state: RootState) => state.user.errormessage);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        dispatch(signIn(new NewUserEntity(username, password)));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(unauthorized)/SignUp")}>
                <Text style={styles.signupText}>Don't have an account?</Text>
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
