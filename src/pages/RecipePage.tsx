import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';
import { doc, getDoc } from 'firebase/firestore';
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
        console.error("Erreur lors du chargement de la recette :", error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!recipe) return <p>Recette non trouvée.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Détails de la recette</h1>
      <RecipeDetail
        name={recipe.name}
        photo={recipe.photoURL}
        description={recipe.description}
        ingredients={recipe.ingredients}
      />
    </div>
  );
};

export default RecipePage;
