import React from 'react';
import RecipeCard from './RecipeCard';

interface Recipe {
  id: string;
  name: string;
  photoURL: string;
  ingredients: string;
  description: string;
  authorId: string;
}

interface Props {
  recipes: Recipe[];
}

const RecipeList: React.FC<Props> = ({ recipes }) => {
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
