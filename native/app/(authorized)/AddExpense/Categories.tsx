import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  deleteCategory,
  createCategory,
} from '@/features/categories/categoriesSlice';
import { Ionicons } from '@expo/vector-icons';

class CategoryEntity {
  id: number | undefined;
  constructor(public title: string) {}
}

export default function Categories() {
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [newCategory, setNewCategory] = useState('');

  const handleDelete = (id: number | undefined) => {
    if (id !== undefined) {
      dispatch(deleteCategory(id));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      dispatch(createCategory(new CategoryEntity(newCategory)));
      setNewCategory('');
    }
  };

  const renderItem = ({ item }: { item: CategoryEntity }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.title}</Text>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter category title"
        placeholderTextColor="#aaa"
        value={newCategory}
        onChangeText={setNewCategory}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>
      {categories && categories.length > 0 && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id?.toString() ?? ''}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f8d7da',
    marginLeft: 10,
  },
});
