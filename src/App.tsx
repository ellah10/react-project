import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useAuth } from './context/AuthContext';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import DeleteRecipeButton from './components/DeleteRecipeButton';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipePage from './pages/RecipePage';
import HomePage from './components/HomePage';
import AddInitialRecipes from './AddInitialRecipes';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipe/:id" element={<RecipePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/add" element={<AddRecipe />} />
      <Route path="/init" element={<AddInitialRecipes />} />
    </Routes>
  );
}

export default App;
