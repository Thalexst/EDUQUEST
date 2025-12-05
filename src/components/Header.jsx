import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout } = useContext(GameContext);
  const nav = useNavigate();

  return (
    <motion.header className="header" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div>
        <h1 className="brand" onClick={() => nav("/")} style={{ margin: 0 }}>Coders Arena</h1>
        <div className="muted">Aprende programando jugando</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="pill">Usuario: {user?.name ?? "—"}</div>
        <div className="pill">Monedas: {user?.coins ?? 0}</div>
        <button className="btn-ghost" onClick={() => { logout(); nav("/login"); }}>Salir</button>
      </div>
    </motion.header>
  );
}
