import React from 'react';
import HomePage from './HomePage';
import { useNavigate } from 'react-router-dom';

type RecipeDetailProps = {
  name: string;
  photo: string;
  description: string;
  ingredients: string;
};


const RecipeDetail: React.FC<RecipeDetailProps> = ({ name, photo, description, ingredients }) => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/'); 
  };
  return (
    <>
      <div className="recipe-card">
        <img
          src={process.env.PUBLIC_URL + '/img/' + photo}
          alt={name}
          className="recipe-image"
        />
        <h2>{name}</h2>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Ingredients:</strong> {ingredients}</p>
      </div>
      <button onClick={goHome} className='return'>return to homepage</button>
    </>
  );
};

export default RecipeDetail;
