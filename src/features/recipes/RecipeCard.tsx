import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteRecipeButton from '../../components/DeleteRecipeButton';
import { useAuth } from '../../context/AuthContext';

interface Recipe {
  id: string;
  name: string;
  photoURL: string;
  ingredients: string;
  description: string;
  authorId: string;
}

interface Props {
  recipe: Recipe;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.id}`}>
        <img
          src={`/img/${recipe.photoURL}`}
          alt={recipe.name}
          loading="lazy"
          className="recipe-image"
        />
      </Link>
      <h2>{recipe.name}</h2>

      {user?.uid === recipe.authorId && (
        <div className="action-buttons">
          <DeleteRecipeButton recipeId={recipe.id} authorId={user.uid} />
          <button onClick={() => navigate(`/edit/${recipe.id}`)} className="edit-button">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
