import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const initialRecipes = [
  {
    name: "Spaghetti Bolognese",
    photoURL: "Spaghetti_Bolognese.jpg",
    ingredients: "Spaghetti, Ground beef, Onions",
    description: "A classic Italian dish, perfect for a family meal.",
    authorId: "anonymous",
  },
  {
    name: "Fresh Chicken Salad",
    photoURL: "Fresh_Chicken_Salad.jpg",
    ingredients: "Grilled chicken breast, Cherry tomatoes, Avocado",
    description: "A light and balanced salad, perfect for summer.",
    authorId: "anonymous",
  },
  {
    name: "Chewy Chocolate Chip Cookies",
    photoURL: "Chewy_Chocolate_Chip_Cookies.jpg",
    ingredients: "Flour, Butter, Brown sugar",
    description: "Homemade cookies, crispy on the outside and soft on the inside.",
    authorId: "anonymous",
  },
  {
    name: "Vegetable Curry",
    photoURL: "Vegetable_Curry.jpg",
    ingredients: "Potatoes,Carrots, Chickpeas, Coconut milk",
    description: "A flavorful vegetarian dish, easy to prepare.",
    authorId: "anonymous",
  },
];

const AddInitialRecipes = () => {
  const handleAddRecipes = async () => {
  try {
    for (const recipe of initialRecipes) {
      console.log("Adding the recipe:", recipe.name);
      await addDoc(collection(db, "recipes"), recipe);
      console.log("✅ Recipe added:", recipe.name);
    }
    alert("All recipes have been added !");
  } catch (error) {
    console.error("❌ Error adding recipes:", error);
    alert("Error: see console");
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleAddRecipes}>Ajouter les recettes initiales</button>
    </div>
  );
};

export default AddInitialRecipes;
