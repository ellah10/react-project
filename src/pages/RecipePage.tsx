import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';
import { doc, getDoc } from 'firebase/firestore';
import CommentsSection from '../components/CommentsSection';
import { db } from '../firebase';

interface Recipe {
  id: string;
  name: string;
  photoURL: string;
  description: string;
  ingredients: string;
  authorId: string;
}

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() } as Recipe);
        } else {
          setRecipe(null);
        }
      } catch (error) {
        console.error("error on recipe loading.... :", error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Recipe information</h1>
      <RecipeDetail
        name={recipe.name}
        photo={recipe.photoURL}
        description={recipe.description}
        ingredients={recipe.ingredients}
      />
      <CommentsSection recipeId={id!} />
    </div>
  );
};

export default RecipePage;
