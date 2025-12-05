import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Arena from "./pages/Arena";
import Level from "./pages/Level";
import { GameContext } from "./context/GameContext";

export default function App() {
  const { user, dataLoaded } = useContext(GameContext);

  // si aún no cargó la data, mostramos pantalla de carga mínima
  if (!dataLoaded) {
    return <div style={{padding:20}}>Cargando datos del juego...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
      <Route path="/arena/:id" element={user ? <Arena /> : <Navigate to="/login" replace />} />
      <Route path="/level/:id" element={user ? <Level /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
    </Routes>
  );
}
