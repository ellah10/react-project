// src/components/DeleteRecipeButton.tsx
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface DeleteRecipeButtonProps {
  recipeId: string;
  authorId: string;
  onDelete?: () => void;
}

const DeleteRecipeButton: React.FC<DeleteRecipeButtonProps> = ({ recipeId, authorId, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user || user.uid !== authorId) {
      alert("Unauthorized action.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe.");
    }
  };

  if (!user || user.uid !== authorId) return null;

  return (
    <button className='delBtn' onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeleteRecipeButton;
