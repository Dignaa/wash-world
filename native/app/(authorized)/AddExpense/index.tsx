import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppDispatch, RootState } from "@/store";
import { CategoryEntity } from "@/features/categories/categoriesEntities";
import { useRouter } from "expo-router";
import { createExpense } from "@/features/expenses/expensesSlice";
import { NewExpenseEntity } from "@/features/expenses/expensesEntities";
import CameraComponent from "@/components/picture";

export default function AddExpense() {
    const [photoToDisplay, setPhotoToDisplay] = useState<string | null>(null);
    const [isCameraOpen, setCamera] = useState(false);
    const router = useRouter();
    const categories = useSelector((state: RootState) => state.category.categories);
    const [price, setPrice] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [date, setDate] = useState(new Date());
    const dispatch = useDispatch<AppDispatch>();

    const handlePriceChange = (text: string) => {
        const numericValue = parseFloat(text);

        if (!isNaN(numericValue)) {
            setPrice(numericValue);
        } else {
            setPrice(0);
        }
    };

    const handleCategoryChange = (itemValue: string) => {
        setSelectedCategory(itemValue);
    };

    const onChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const handleCreateExpense = () => {
        dispatch(
            createExpense(new NewExpenseEntity(selectedCategory, price, date, photoToDisplay))
        );
    };

    const isButtonDisabled = !selectedCategory || !price;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Category Picker */}
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={handleCategoryChange}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}>
                        <Picker.Item label="Select a category" value="" />
                        {categories.map((category: CategoryEntity) => (
                            <Picker.Item
                                key={category.id}
                                label={category.title}
                                value={category.id.toString()}
                            />
                        ))}
                    </Picker>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push("/AddExpense/Categories")}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Price Input */}
                <Text style={styles.label}>Price</Text>
                <TextInput
                    value={price.toString()}
                    onChangeText={(text: string) => handlePriceChange(text)}
                    keyboardType="numeric" // Show the numeric keyboard
                    style={styles.input}
                />

                {/* Date Picker */}
                <Text style={styles.label}>Date</Text>
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    maximumDate={new Date()}
                    style={styles.datePicker}
                    textColor="black"
                />

                {isCameraOpen ? (
                    <CameraComponent setPhotoToDisplay={setPhotoToDisplay} setCamera={setCamera} />
                ) : (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#007bff",
                            padding: 10,
                            borderRadius: 5,
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                        onPress={() => setCamera(true)}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Open Camera</Text>
                    </TouchableOpacity>
                )}

                {/* Add Expense Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.addExpenseButton,
                            isButtonDisabled ? styles.disabledButton : styles.enabledButton,
                        ]}
                        onPress={handleCreateExpense}
                        disabled={isButtonDisabled}>
                        <Text
                            style={[
                                styles.addExpenseText,
                                isButtonDisabled ? styles.disabledText : styles.enabledText,
                            ]}>
                            Add Expense
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: "#333",
        fontWeight: "500",
    },
    pickerContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        position: "relative",
        backgroundColor: "white",
    },
    picker: {
        width: "100%",
    },
    pickerItem: {
        color: "#000",
        fontSize: 18,
    },
    editButton: {
        position: "absolute",
        right: 10,
        top: 10,
        backgroundColor: "#007bff",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    input: {
        minHeight: 40,
        borderColor: "#ccc",
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
    },
    datePicker: {
        maxWidth: "100%",
        minHeight: 40,
        borderColor: "#ccc",
        backgroundColor: "white",
        color: "black",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    addExpenseButton: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    enabledButton: {
        backgroundColor: "#28a745",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    addExpenseText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    enabledText: {
        color: "#fff",
    },
    disabledText: {
        color: "#666",
    },
});
