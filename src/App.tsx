/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Sanctuary from './components/Sanctuary';
import MindfulLanding from './components/MindfulLanding';
import LabsTransitionWrapper from './pages/LabsTransitionWrapper';
import GenReflectProduct from './pages/GenReflectProduct';
import Philosophy from './pages/Philosophy';
import { Loader2 } from 'lucide-react';
import { useSystemTheme } from './hooks/useSystemTheme';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useSystemTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sanctuary-bg">
        <Loader2 className="w-8 h-8 text-sanctuary-muted animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/welcome" element={user ? <Navigate to="/" replace /> : <MindfulLanding />} />
      <Route path="/philosophy" element={<Philosophy />} />
      <Route path="/labs" element={<LabsTransitionWrapper />} />
      <Route path="/product" element={<GenReflectProduct />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={user ? <Sanctuary /> : <Navigate to="/welcome" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
