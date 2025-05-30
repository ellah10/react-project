import React, { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

interface Comment {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  createdAt: any;
}

type Props = {
  recipeId: string;
};

const CommentsSection: React.FC<Props> = ({ recipeId }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'recipes', recipeId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, 'id'>),
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [recipeId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addDoc(collection(db, 'recipes', recipeId, 'comments'), {
      text: commentText,
      userId: user?.uid,
      userEmail: user?.email,
      createdAt: serverTimestamp(),
    });

    setCommentText('');
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.userEmail}</strong>: {c.text}
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p>You must be logged in to comment.</p>
      )}
    </div>
  );
};

export default CommentsSection;
