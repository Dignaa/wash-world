import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, useWindowDimensions, Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ExpenseEntity } from "@/features/expenses/expensesEntities";
import { PieChart } from "react-native-chart-kit";
import moment from "moment";

export default function ExpensesList() {
    const expenses = useSelector((state: RootState) => state.expense.expenses);
    const categories = useSelector((state: RootState) => state.category.categories);
    const [filteredExpenses, setFilteredExpenses] = useState<ExpenseEntity[]>([]);
    const { width } = useWindowDimensions();

    // Create a category ID-to-name map
    const categoryMap = categories.reduce(
        (acc, category) => {
            acc[category.id] = category.title;
            return acc;
        },
        {} as Record<string, string>
    );

    useEffect(() => {
        // Filter expenses for the current month
        const currentMonth = moment().month();
        const currentYear = moment().year();

        const monthlyExpenses = expenses
            .filter(
                (expense) =>
                    moment(expense.date).month() === currentMonth &&
                    moment(expense.date).year() === currentYear
            )
            .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()); // Sort by date (newest first)

        setFilteredExpenses(monthlyExpenses);
    }, [expenses]);

    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach((expense: ExpenseEntity) => {
        if (!categoryTotals[expense.categoryID]) {
            categoryTotals[expense.categoryID] = 0;
        }
        categoryTotals[expense.categoryID] += expense.price;
    });

    const pieData = Object.keys(categoryTotals).map((categoryID, index) => ({
        name: categoryMap[categoryID] || "Unknown", // Get category name
        amount: categoryTotals[categoryID],
        color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9F40"][index % 5], // Cycle colors
    }));

    const renderItem = ({ item }: { item: ExpenseEntity }) => (
        <View style={styles.expenseItem}>
            <View>
                <Text style={styles.expenseText}>💰 {item.price} USD</Text>
                <Text style={styles.expenseCategory}>
                    {categoryMap[item.categoryID] || "Unknown"}
                </Text>
                {item.img && (
                    <Image source={{ uri: item.img }} style={{ width: 100, height: 100 }} />
                )}
            </View>
            <Text style={styles.expenseDate}>{moment(item.date).format("MMM D, YYYY")}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>This Month's Expenses</Text>
            {filteredExpenses.length > 0 ? (
                <>
                    <PieChart
                        data={pieData}
                        width={width - 20}
                        height={200}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="10"
                    />

                    <FlatList
                        data={filteredExpenses}
                        keyExtractor={(item) => item.id?.toString() ?? ""}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            ) : (
                <Text style={styles.noExpenses}>No expenses recorded this month.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    listContainer: {
        width: "100%",
    },
    expenseItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    expenseText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#444",
    },
    expenseCategory: {
        fontSize: 14,
        color: "#666",
    },
    expenseDate: {
        fontSize: 14,
        color: "#777",
    },
    noExpenses: {
        marginTop: 20,
        fontSize: 16,
        color: "#888",
    },
});
