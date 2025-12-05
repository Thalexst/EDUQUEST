import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

// --- IMPORTACIÓN DE PÁGINAS ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Arena from "./pages/Arena";
import Level from "./pages/Level";
import Profile from "./pages/Profile"; 
import Shop from "./pages/Shop"; // <--- FALTABA ESTA IMPORTACIÓN

import { GameContext } from "./context/GameContext";
import PageWrapper from "./components/PageWrapper";

export default function App() {
  const { user, dataLoaded } = useContext(GameContext);
  const location = useLocation();

  // Pantalla de carga simple
  if (!dataLoaded) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", background: "#0d1117" }}>
        Cargando datos del juego...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* --- RUTAS PROTEGIDAS (Solo si hay usuario) --- */}
          <Route path="/" element={user ? <PageWrapper><Home /></PageWrapper> : <Navigate to="/login" replace />} />
          <Route path="/arena/:id" element={user ? <PageWrapper><Arena /></PageWrapper> : <Navigate to="/login" replace />} />
          <Route path="/level/:id" element={user ? <PageWrapper><Level /></PageWrapper> : <Navigate to="/login" replace />} />
          
          <Route path="/profile" element={user ? <PageWrapper><Profile /></PageWrapper> : <Navigate to="/login" replace />} />
          
          {/* FALTABA ESTA RUTA PARA QUE LA TIENDA CARGUE */}
          <Route path="/shop" element={user ? <PageWrapper><Shop /></PageWrapper> : <Navigate to="/login" replace />} />

          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/login" element={!user ? <PageWrapper><Login /></PageWrapper> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <PageWrapper><Register /></PageWrapper> : <Navigate to="/" replace />} />
          
          {/* Redirección por defecto si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>
    </>
  );
}