
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, Image, StyleSheet,
  SafeAreaView, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const initialRecipes = [
  {
    id: '1', name: 'Veg Pizza', category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    ingredients: ['Pizza base', 'Cheese', 'Tomato', 'Capsicum'],
    instructions: ['Prepare the pizza base', 'Add toppings', 'Add cheese', 'Bake for 15 minutes'],
    time: '25 min', servings: '2', calories: '280', difficulty: 'Easy'
  },
  {
    id: '2', name: 'Pasta', category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600',
    ingredients: ['Pasta', 'Tomato sauce', 'Garlic', 'Cheese'],
    instructions: ['Boil pasta', 'Prepare sauce', 'Mix pasta and sauce', 'Serve hot'],
    time: '20 min', servings: '2', calories: '320', difficulty: 'Easy'
  },
  {
    id: '3', name: 'Burger', category: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    ingredients: ['Burger bun', 'Patty', 'Lettuce', 'Cheese'],
    instructions: ['Cook the patty', 'Toast the bun', 'Add vegetables', 'Assemble burger'],
    time: '30 min', servings: '1', calories: '450', difficulty: 'Medium'
  },
  {
    id: '4', name: 'Chocolate Cake', category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    ingredients: ['Flour', 'Cocoa powder', 'Sugar', 'Milk'],
    instructions: ['Mix ingredients', 'Pour into a cake pan', 'Bake for 30 minutes'],
    time: '45 min', servings: '4', calories: '390', difficulty: 'Medium'
  },
  {
    id: '5', name: 'Fresh Salad', category: 'Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Olive oil'],
    instructions: ['Wash vegetables', 'Chop vegetables', 'Mix and serve'],
    time: '10 min', servings: '2', calories: '120', difficulty: 'Easy'
  },
  {
    id: '6', name: 'Chicken Biryani', category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600',
    ingredients: ['Rice', 'Chicken', 'Onion', 'Spices'],
    instructions: ['Marinate chicken', 'Cook onions and spices', 'Add rice', 'Cook until done'],
    time: '50 min', servings: '3', calories: '520', difficulty: 'Hard'
  },
  {
    id: '7', name: 'Pancakes', category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600',
    ingredients: ['Flour', 'Milk', 'Egg', 'Sugar'],
    instructions: ['Mix ingredients', 'Heat a pan', 'Pour batter', 'Cook both sides'],
    time: '15 min', servings: '2', calories: '220', difficulty: 'Easy'
  },
  {
    id: '8', name: 'Orange Juice', category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600',
    ingredients: ['Oranges', 'Water', 'Sugar'],
    instructions: ['Peel oranges', 'Extract juice', 'Serve chilled'],
    time: '5 min', servings: '1', calories: '110', difficulty: 'Easy'
  },
  {
    id: '9', name: 'French Fries', category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600',
    ingredients: ['Potatoes', 'Salt', 'Oil'],
    instructions: ['Cut potatoes', 'Heat oil', 'Fry until golden', 'Add salt'],
    time: '20 min', servings: '2', calories: '300', difficulty: 'Easy'
  },
  {
    id: '10', name: 'Ice Cream', category: 'Ice Cream',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600',
    ingredients: ['Milk', 'Cream', 'Sugar', 'Vanilla'],
    instructions: ['Mix ingredients', 'Freeze the mixture', 'Serve chilled'],
    time: '4 hours', servings: '3', calories: '250', difficulty: 'Easy'
  }
];

const categories = [
  'All', 'Breakfast', 'Pizza', 'Pasta', 'Burger',
  'Dessert', 'Salad', 'Biryani', 'Drinks',
  'Snacks', 'Ice Cream', 'Favorites', 'My Food'
];

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const displayedRecipes = recipes.filter(r => {
    if (category === 'Favorites') return favorites.includes(r.id);
    if (category === 'My Food') return r.custom === true;
    if (category === 'All') return true;
    return r.category === category;
  });

  const toggleFavorite = (id) => {
    setFavorites(old =>
      old.includes(id) ? old.filter(x => x !== id) : [...old, id]
    );
  };

  const openForm = (recipe = null) => {
    setEditing(recipe);
    setName(recipe ? recipe.name : '');
    setImage(recipe ? recipe.image : '');
    setIngredients(recipe ? recipe.ingredients.join('\n') : '');
    setInstructions(recipe ? recipe.instructions.join('\n') : '');
    setPage('form');
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveRecipe = () => {
    if (!name.trim() || !ingredients.trim() || !instructions.trim() || !image.trim()) {
      Alert.alert('Missing details', 'Please enter all fields and select an image.');
      return;
    }

    const recipe = {
      id: editing ? editing.id : Date.now().toString(),
      name: name.trim(),
      category: editing ? editing.category : 'My Food',
      image,
      ingredients: ingredients.split('\n').filter(x => x.trim()),
      instructions: instructions.split('\n').filter(x => x.trim()),
      time: editing ? editing.time : '20 min',
      servings: editing ? editing.servings : '2',
      calories: editing ? editing.calories : '250',
      difficulty: editing ? editing.difficulty : 'Easy',
      custom: true
    };

    if (editing) {
      setRecipes(old => old.map(r => r.id === editing.id ? recipe : r));
      if (selected?.id === editing.id) setSelected(recipe);
    } else {
      setRecipes(old => [recipe, ...old]);
    }

    setCategory('My Food');
    setPage('home');
    Alert.alert('Success', 'Recipe saved successfully!');
  };

  const deleteRecipe = (id) => {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setRecipes(old => old.filter(r => r.id !== id));
          setFavorites(old => old.filter(x => x !== id));
          setPage('home');
          setCategory('My Food');
        }
      }
    ]);
  };

  const back = () => {
    if (page === 'detail') {
      setPage('home');
    } else {
      setPage('home');
    }
  };

  const field = (label, value, setter, placeholder, multiline = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        multiline={multiline}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {page !== 'home' && (
          <TouchableOpacity onPress={back}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.logo}>🍴 Foodie</Text>
        <Text style={styles.tagline}>Discover delicious recipes!</Text>
      </View>

      {page === 'home' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.categories}>
            {categories.map(c => (
              <TouchableOpacity key={c}
                style={[styles.category, category === c && styles.activeCategory]}
                onPress={() => {
                  setCategory(c);
                  if (c === 'My Food') setPage('home');
                }}>
                <Text style={[styles.categoryText, category === c && styles.activeText]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.feed}>
            <Text style={styles.heading}>
              {category === 'All' ? 'Explore Recipes' : category}
            </Text>

            {category === 'My Food' && (
              <TouchableOpacity style={styles.addButton} onPress={() => openForm()}>
                <Text style={styles.addText}>＋ Add New Recipe</Text>
              </TouchableOpacity>
            )}

            {displayedRecipes.length === 0 && (
              <Text style={styles.empty}>No recipes found. Add a new recipe!</Text>
            )}

            <View style={styles.grid}>
              {displayedRecipes.map(recipe => (
                <TouchableOpacity key={recipe.id}
                  style={styles.card}
                  onPress={() => {
                    setSelected(recipe);
                    setPage('detail');
                  }}>
                  <Image source={{ uri: recipe.image }} style={styles.foodImage} />
                  <TouchableOpacity style={styles.heart}
                    onPress={() => toggleFavorite(recipe.id)}>
                    <Text style={{ fontSize: 23 }}>
                      {favorites.includes(recipe.id) ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.foodName}>{recipe.name}</Text>
                  <Text style={styles.small}>{recipe.time} • {recipe.difficulty}</Text>
                  {category === 'My Food' && (
                    <View style={styles.actions}>
                      <TouchableOpacity onPress={() => openForm(recipe)}>
                        <Text style={styles.edit}>✏️ Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteRecipe(recipe.id)}>
                        <Text style={styles.delete}>🗑 Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {page === 'detail' && selected && (
        <ScrollView contentContainerStyle={styles.detail}>
          <Image source={{ uri: selected.image }} style={styles.detailImage} />
          <Text style={styles.detailTitle}>{selected.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(selected.id)}>
            <Text style={styles.favoriteButton}>
              {favorites.includes(selected.id) ? '❤️ Remove Favorite' : '🤍 Add to Favorites'}
            </Text>
          </TouchableOpacity>

          <View style={styles.info}>
            <Text>⏱ {selected.time}</Text>
            <Text>🍽 {selected.servings} servings</Text>
            <Text>🔥 {selected.calories} cal</Text>
            <Text>⭐ {selected.difficulty}</Text>
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {selected.ingredients.map((item, i) => (
            <Text style={styles.listText} key={i}>• {item}</Text>
          ))}

          <Text style={styles.sectionTitle}>Instructions</Text>
          {selected.instructions.map((item, i) => (
            <Text style={styles.listText} key={i}>{i + 1}. {item}</Text>
          ))}

          {selected.custom && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.addButton}
                onPress={() => openForm(selected)}>
                <Text style={styles.addText}>Edit Recipe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}
                onPress={() => deleteRecipe(selected.id)}>
                <Text style={styles.addText}>Delete Recipe</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {page === 'form' && (
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.heading}>
            {editing ? 'Edit Recipe' : 'Add New Recipe'}
          </Text>

          {field('Recipe Name', name, setName, 'Enter recipe name')}

          <Text style={styles.label}>Recipe Image</Text>
          <TouchableOpacity style={styles.upload} onPress={pickImage}>
            <Text style={styles.uploadText}>📷 Choose Image from Gallery</Text>
          </TouchableOpacity>
          {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

          {field('Ingredients (one per line)', ingredients, setIngredients,
            'Example:\nTomato\nOnion\nSalt', true)}

          {field('Instructions (one step per line)', instructions, setInstructions,
            'Example:\nWash vegetables\nChop vegetables\nCook well', true)}

          <TouchableOpacity style={styles.addButton} onPress={saveRecipe}>
            <Text style={styles.addText}>Save Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F3' },
  header: { padding: 18, backgroundColor: '#FFF0E4' },
  logo: { fontSize: 29, fontWeight: 'bold', color: '#E65B35' },
  tagline: { color: '#777', marginTop: 4 },
  back: { fontSize: 17, color: '#E65B35', marginBottom: 8 },
  categories: { maxHeight: 58, paddingHorizontal: 10 },
  category: {
    paddingHorizontal: 16, paddingVertical: 11,
    backgroundColor: '#F1E5DA', borderRadius: 22,
    margin: 5, alignSelf: 'center'
  },
  activeCategory: { backgroundColor: '#E65B35' },
  categoryText: { color: '#444', fontWeight: '600' },
  activeText: { color: 'white' },
  feed: { padding: 15 },
  heading: { fontSize: 23, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: 'white', borderRadius: 14,
    marginBottom: 15, padding: 8, elevation: 3
  },
  foodImage: { width: '100%', height: 125, borderRadius: 10 },
  heart: { position: 'absolute', right: 12, top: 12 },
  foodName: { fontSize: 16, fontWeight: 'bold', marginTop: 9 },
  small: { fontSize: 12, color: '#888', marginTop: 5 },
  addButton: {
    backgroundColor: '#E65B35', padding: 15,
    borderRadius: 12, alignItems: 'center', marginVertical: 10
  },
  addText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 30, color: '#777' },
  detail: { padding: 18, paddingBottom: 40 },
  detailImage: { width: '100%', height: 220, borderRadius: 15 },
  detailTitle: { fontSize: 26, fontWeight: 'bold', marginTop: 15 },
  favoriteButton: { color: '#E65B35', fontSize: 16, marginVertical: 12 },
  info: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', backgroundColor: '#FFE8D9',
    padding: 15, borderRadius: 12, gap: 12
  },
  sectionTitle: { fontSize: 21, fontWeight: 'bold', marginTop: 22, marginBottom: 10 },
  listText: { fontSize: 16, lineHeight: 27, color: '#444' },
  form: { padding: 18, paddingBottom: 50 },
  field: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#444' },
  input: {
    backgroundColor: 'white', borderWidth: 1, borderColor: '#DDD',
    borderRadius: 10, padding: 13, fontSize: 15
  },
  multiline: { height: 115, textAlignVertical: 'top' },
  upload: {
    backgroundColor: '#FFE8D9', padding: 16,
    borderRadius: 10, alignItems: 'center', marginBottom: 12
  },
  uploadText: { color: '#D95732', fontWeight: 'bold' },
  preview: { width: '100%', height: 160, borderRadius: 12, marginBottom: 15 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  edit: { color: '#1675B9', fontWeight: 'bold', padding: 8 },
  delete: { color: '#D32F2F', fontWeight: 'bold', padding: 8 },
  deleteButton: { backgroundColor: '#C62828', padding: 15, borderRadius: 12 }
});
