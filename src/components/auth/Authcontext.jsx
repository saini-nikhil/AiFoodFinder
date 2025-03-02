import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firbase/config';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Handle sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Handle sign up with email and password
  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Handle sign in with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // Handle sign out
  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;