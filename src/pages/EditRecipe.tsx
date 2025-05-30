import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (user?.uid !== data.authorId) {
            setError("Vous n'êtes pas autorisé à modifier cette recette.");
          } else {
            setRecipe(data);
            setName(data.name);
            setDescription(data.description);
            setIngredients(data.ingredients);
            setPhotoURL(data.photoURL);
          }
        } else {
          setError("Recette non trouvée.");
        }
      } catch (err) {
        setError("Erreur lors du chargement de la recette.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    let imageName = photoURL; // valeur par défaut

    if (photoFile) {
      imageName = photoFile.name;
      // ⚠️ Ici tu dois copier manuellement l'image dans public/img/ après sélection.
    }

    try {
      await updateDoc(doc(db, 'recipes', id), {
        name,
        description,
        ingredients,
        photoURL: imageName,
      });
      navigate('/');
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="recipeAdd">
        <h2>Edit recipe</h2>
        <form onSubmit={handleUpdate} className="form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" required />
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ingrédients" required />
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
          {photoFile && <p>Image sélectionnée : {photoFile.name}</p>}
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
          <button type="submit">Update</button>
        </form>
        {photoURL && (
          <img
            src={photoURL.startsWith('http') ? photoURL : `/img/${photoURL}`}
            alt="Aperçu"
            style={{ width: '200px', marginTop: '10px' }}
          />
        )}
      </div>
    </div>
  );
};

export default EditRecipe;
