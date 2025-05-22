// src/pages/EditRecipe.tsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EditRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // recipe ID from URL

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (user?.uid !== data.authorId) {
          alert("Vous n'avez pas la permission de modifier cette recette.");
          navigate('/');
          return;
        }

        setName(data.name || '');
        setIngredients(data.ingredients || '');
        setInstructions(data.instructions || '');
        setPhoto(data.photo || '');
        setAuthorId(data.authorId);
      } else {
        alert("Recette introuvable.");
        navigate('/');
      }
    };

    fetchRecipe();
  }, [id, navigate, user]);

  const handleUpdate = async () => {
    if (!user || user.uid !== authorId) {
      alert("Action non autorisée.");
      return;
    }

    if (!name || !ingredients || !instructions || !photo) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'recipes', id!), {
        name,
        ingredients,
        instructions,
        photo
      });
      alert("Recette mise à jour !");
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Échec de la mise à jour.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Modifier la recette</h2>
      <input
        type="text"
        placeholder="Nom de la recette"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <textarea
        placeholder="Ingrédients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={4}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={6}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <input
        type="text"
        placeholder="Image (ex: pasta.jpg)"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Mise à jour en cours...' : 'Mettre à jour la recette'}
      </button>
    </div>
  );
};

export default EditRecipe;
