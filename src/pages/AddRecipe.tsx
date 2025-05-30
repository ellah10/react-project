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
      console.error("Error adding recipe:", error);
      alert("An error has occurred");
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file.name); 
    }
  };

  return (
    <div className='recipeAdd'>
      <h2>Add Recipe</h2>

      <input
        type="text"
        placeholder="Recipe name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Ingredients (separated by commas)"
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
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
      />

      {photo && (
        <div>
          <strong>Selected image:</strong> {photo}
          <div>
            <img
              src={`/img/${photo}`}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 200, marginTop: 10 }}
              onError={(e) =>
                (e.currentTarget.src = '/img/placeholder.jpg') 
              }
            />
          </div>
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Addition in progress...' : 'Add recipe'}
      </button>
    </div>
  );
};

export default AddRecipe;
