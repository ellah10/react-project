import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navigation = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <div className="header">
      <ul>
        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        ) : (
          <>
            <li style={{ color: 'green', fontWeight: 'bold', listStyle: 'none' }}>
              Welcome, {user.email}
            </li>
            <li><Link to="/add">Add Recipe</Link></li>
            <li><button onClick={handleLogout} className='logout'>Logout</button></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
