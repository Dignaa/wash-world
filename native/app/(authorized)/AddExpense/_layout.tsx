import { Stack } from "expo-router";

export default function AddExpenseLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Add New Expense",
                }}
            />
            <Stack.Screen
                name="Categories"
                options={{
                    headerTitle: "Manage Categories",
                }}
            />
        </Stack>
    );
}
