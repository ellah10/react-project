import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DeleteRecipeButton from '../components/DeleteRecipeButton';

interface Recipe {
  id: string;
  name: string;
  photoURL: string;
  description: string;
  ingredients: string;
  authorId: string;
}

function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔽 Récupération des recettes depuis Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const fetchedRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recipe[];
      setRecipes(fetchedRecipes);
    };

    fetchRecipes();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="items">
      <div className="header">
        <ul>
          {!user ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          ) : (
            <>
              <li style={{ color: 'green', fontWeight: 'bold', listStyle: 'none' }}>
                Welcome, {authUser?.email}
              </li>
              <li><Link to="/add">Add recipe</Link></li>
              <li><button onClick={handleLogout} className="logout">Logout</button></li>
            </>
          )}
        </ul>
      </div>
      <h1>Food Recipe Platform</h1>
      <div className="recipe-list">
        {recipes.map((item) => (
          <Link to={`/recipe/${item.id}`} key={item.id} className="recipe-card">
            <img
              src={process.env.PUBLIC_URL + '/img/' + item.photoURL}
              alt={item.name}
              className="recipe-image"
            />
            <h2>{item.name}</h2>
            {user && (
              <DeleteRecipeButton recipeId={item.id} authorId={item.authorId} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
