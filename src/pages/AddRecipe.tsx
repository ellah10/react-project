import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to add a recipe.");
      return;
    }

    if (!name || !ingredients || !instructions || !photo) {
      alert("All fields are mandatory.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'recipes'), {
        name,
        ingredients,
        instructions,
        photo,
        createdAt: Timestamp.now(),
        authorId: user.uid,
        authorEmail: user.email
      });
      alert("Recipe added!");
      navigate('/');
    } catch (error) {
      console.error("Error adding:", error);
      alert("an error has occurred");
    }
    setLoading(false);
  };

  return (
    <div className='recipeAdd' >
      <h2>Add Recipe</h2>
      <input
        type="text"
        placeholder="recipe name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Ingrédients (separated by commas)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={4}
      />
      <textarea
        placeholder="Preparation instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={6}
      />
      <input
        type="text"
        placeholder="Image file name(ex: pasta.jpg)"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Addition in progress...' : 'Add recipe'}
      </button>
    </div>
  );
};

export default AddRecipe;
