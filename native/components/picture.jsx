import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function CameraComponent({ setPhotoToDisplay, setCamera }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const [facing, setFacing] = useState("back");
    const cameraRef = useRef(null);

    // While permissions are loading:
    if (!permission) {
        return (
            <View style={styles.centered}>
                <Text>Loading permissions...</Text>
            </View>
        );
    }

    // If permissions are not granted:
    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera.</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </SafeAreaView>
        );
    }

    // Capture a photo using the camera reference:
    const takePicture = async () => {
        if (cameraRef.current) {
            const capturedPhoto = await cameraRef.current.takePictureAsync({ base64: true });
            setPhoto(capturedPhoto);
            setPhotoToDisplay(capturedPhoto.base64);
        }
    };

    // Save the captured photo to the media library:
    const savePicture = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted" && photo) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            setPhoto(null);
            setPhotoToDisplay(null);
            setCamera(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {photo ? (
                // Show save/discard options if a photo was taken
                <View style={styles.buttonContainer}>
                    <Button title="Save Photo" onPress={savePicture} />
                    <Button
                        title="Discard"
                        onPress={() => {
                            setPhoto(null);
                            setCamera(false);
                        }}
                    />
                </View>
            ) : (
                // Otherwise, show the camera view with flip and capture controls
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={styles.flipButton}
                            onPress={() =>
                                setFacing((current) => (current === "back" ? "front" : "back"))
                            }>
                            <Text style={styles.flipText}>Flip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <Text style={styles.captureText}>Take Picture</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    message: {
        textAlign: "center",
        padding: 10,
    },
    camera: {
        flex: 1,
    },
    controls: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    flipButton: {
        alignSelf: "flex-end",
        marginRight: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 5,
    },
    flipText: {
        fontSize: 18,
        color: "white",
    },
    captureButton: {
        alignSelf: "center",
        padding: 15,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 50,
    },
    captureText: {
        fontSize: 18,
        color: "white",
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
