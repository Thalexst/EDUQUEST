import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout, soundEnabled, toggleSound } = useContext(GameContext);
  const nav = useNavigate();

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'User'}`;

  return (
    <motion.header 
      className="header" 
      initial={{ y: -10, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "15px 30px", 
        // --- CAMBIOS AQUÍ ---
        background: "transparent", // Hacemos el fondo transparente
        borderBottom: "none"       // Eliminamos el borde inferior
        // --------------------
      }}
    >
      <div>
        <h1 className="brand" onClick={() => nav("/")} style={{ margin: 0, cursor: "pointer", fontSize: "1.5rem", color: "#48bb78" }}>EduQuest</h1>
        <div className="muted" style={{ fontSize: "0.8rem", color: "#a0aec0" }}>Aprende programando jugando</div> {/* Color de texto ajustado */}
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn-ghost"
          onClick={toggleSound}
          style={{ fontSize: "1.2rem", padding: "8px", background: "none", border: "none", cursor: "pointer" }}
          title={soundEnabled ? "Silenciar" : "Activar sonido"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>

        {user && (
            <button 
                onClick={() => nav("/shop")}
                className="btn-ghost"
                title="Ir a la Tienda"
                style={{ 
                    fontSize: "1.2rem", 
                    padding: "8px", 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer",
                    marginRight: "5px"
                }}
            >
                🛒
            </button>
        )}

        {/* Racha */}
        <div className="pill" style={{ color: "#ff9600", borderColor: "#ff9600", padding: "4px 12px", borderRadius: 20, border: "1px solid #ff9600", fontSize: "0.9rem" }}>
          🔥 {user?.streak || 0}
        </div>

        {/* PERFIL */}
        <div 
            className="pill" 
            onClick={() => nav("/profile")}
            style={{ 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                padding: "4px 12px 4px 4px",
                borderRadius: 20,
                border: "1px solid #48bb78", 
                background: "#1f2937", // Fondo del botón de perfil para que destaque
                color: "#e2e8f0"
            }}
            title="Ir a mi perfil"
        >
            <img 
                src={avatarUrl} 
                alt="Avatar" 
                style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#222" }} 
            />
            <span style={{ fontWeight: "bold" }}>{user?.name ?? "—"}</span>
        </div>

        {/* Monedas */}
        <div className="pill" style={{ color: "#fbbf24", borderColor: "#fbbf24", padding: "4px 12px", borderRadius: 20, border: "1px solid #fbbf24", fontSize: "0.9rem" }}>
          💰 {user?.coins ?? 0}
        </div>

        <button 
            className="btn-ghost" 
            onClick={() => { logout(); nav("/login"); }}
            style={{ fontSize: "0.8rem", background: "none", border: "none", color: "#a0aec0", cursor: "pointer" }}
        >
            Salir
        </button>
      </div>
    </motion.header>
  );
}