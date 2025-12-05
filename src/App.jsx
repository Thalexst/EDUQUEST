import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Arena from "./pages/Arena";
import Level from "./pages/Level";
import { GameContext } from "./context/GameContext";
import PageWrapper from "./components/PageWrapper";

export default function App() {
  const { user, dataLoaded } = useContext(GameContext);
  const location = useLocation();

  // si aún no cargó la data, mostramos pantalla de carga mínima
  if (!dataLoaded) {
    return <div style={{ padding: 20 }}>Cargando datos del juego...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={user ? <PageWrapper><Home /></PageWrapper> : <Navigate to="/login" replace />} />
          <Route path="/arena/:id" element={user ? <PageWrapper><Arena /></PageWrapper> : <Navigate to="/login" replace />} />
          <Route path="/level/:id" element={user ? <PageWrapper><Level /></PageWrapper> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!user ? <PageWrapper><Login /></PageWrapper> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <PageWrapper><Register /></PageWrapper> : <Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
