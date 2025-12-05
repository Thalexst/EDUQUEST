import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout, soundEnabled, toggleSound } = useContext(GameContext);
  const nav = useNavigate();

  return (
    <motion.header className="header" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div>
        <h1 className="brand" onClick={() => nav("/")} style={{ margin: 0 }}>EduQuest</h1>
        <div className="muted">Aprende programando jugando</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn-ghost"
          onClick={toggleSound}
          style={{ fontSize: "1.2rem", padding: "8px" }}
          title={soundEnabled ? "Silenciar" : "Activar sonido"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
        <div className="pill" style={{ color: "#ff9600", borderColor: "#ff9600" }}>
          🔥 {user?.streak || 0}
        </div>
        <div className="pill">👤 {user?.name ?? "—"}</div>
        <div className="pill" style={{ color: "#fbbf24", borderColor: "#fbbf24" }}>
          💰 {user?.coins ?? 0}
        </div>
        <button className="btn-ghost" onClick={() => { logout(); nav("/login"); }}>Salir</button>
      </div>
    </motion.header>
  );
}
