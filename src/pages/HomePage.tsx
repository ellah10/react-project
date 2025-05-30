import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navigation from '../components/Navigation';
import RecipeList from '../features/recipes/RecipeList';
import SearchBar from '../components/SearchBar';
import RecipeSkeleton from '../components/Skeleton'; 

interface Recipe {
  id: string;
  name: string;
  photoURL: string;
  ingredients: string;
  description: string;
  authorId: string;
}

function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 5;
  const [selectedIngredient, setSelectedIngredient] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const uniqueIngredients = Array.from(
    new Set(
      recipes.flatMap((recipe) =>
        recipe.ingredients.split(',').map((ing) => ing.trim().toLowerCase())
      )
    )
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'recipes'));
        const recipeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Recipe, 'id'>),
        }));
        setRecipes(recipeList);
      } catch (error: any) {
        setError("Failed to load recipes");
        console.error("Firestore error:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIngredient =
      selectedIngredient === 'All' ||
      recipe.ingredients.toLowerCase().includes(selectedIngredient.toLowerCase());

    return matchesSearch && matchesIngredient;
  });

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div className="items">
      <Navigation />
      <h1>Food Recipe Platform</h1>
      <div className="searchBox">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <label htmlFor="ingredient-filter">Filter by ingredient:</label>
        <select
          id="ingredient-filter"
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
        >
          <option value="All">All</option>
          {uniqueIngredients.map((ingredient) => (
            <option key={ingredient} value={ingredient}>
              {ingredient}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="recipe-list">
          {[...Array(5)].map((_, i) => <RecipeSkeleton key={i} />)}
        </div>
      ) : (
        <RecipeList recipes={currentRecipes} />
      )}
      {!isLoading && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
