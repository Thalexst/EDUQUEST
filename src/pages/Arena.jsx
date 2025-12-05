import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import LevelCard from "../components/LevelCard";
import Header from "../components/Header";
import { motion } from "framer-motion";

const THEMES = [
  { color: "var(--theme-green)", shadow: "var(--theme-green-shadow)", icon: "🚀" },
  { color: "var(--theme-blue)", shadow: "var(--theme-blue-shadow)", icon: "⚡" },
  { color: "var(--theme-purple)", shadow: "var(--theme-purple-shadow)", icon: "🐍" },
  { color: "var(--theme-orange)", shadow: "var(--theme-orange-shadow)", icon: "🧠" },
  { color: "var(--theme-red)", shadow: "var(--theme-red-shadow)", icon: "🔥" },
];

export default function Arena() {
  const { id } = useParams();
  const arenaId = Number(id); // <-- aseguramos número

  const { arenas = [], levels = [], dataLoaded, isLevelCompleted, isLevelUnlocked } = useContext(GameContext);

  if (!dataLoaded) {
    return (
      <div>
        <Header />
        <p style={{ padding: 12 }}>Cargando arena...</p>
      </div>
    );
  }

  // --- Normalizamos IDs para evitar problemas ---
  const normalizedArenas = arenas.map(a => ({
    ...a,
    id: Number(a.id)
  }));

  const normalizedLevels = levels.map(l => ({
    ...l,
    id: Number(l.id),
    arenaId: Number(l.arenaId)
  }));
  // ------------------------------------------------

  const arena = normalizedArenas.find(a => a.id === arenaId);

  if (!arena) {
    return (
      <div>
        <Header />
        <p style={{ padding: 12, color: "red", fontWeight: "bold" }}>
          Arena no encontrada
        </p>
      </div>
    );
  }

  const arenaLevels = normalizedLevels.filter(l => l.arenaId === arenaId);

  // Calculate Theme
  const themeIndex = (arenaId - 1) % THEMES.length;
  const theme = THEMES[themeIndex] || THEMES[0];

  return (
    <div>
      <Header />

      <Link to="/" className="btn-ghost" style={{ display: "inline-block", marginTop: 10, textDecoration: "none" }}>
        ← Volver
      </Link>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            fontSize: 60,
            background: theme.color,
            width: 100,
            height: 100,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            boxShadow: `0 6px 0 ${theme.shadow}`
          }}
        >
          {theme.icon}
        </motion.div>
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: 8, fontSize: 32, color: theme.color }}
        >
          {arena.name}
        </motion.h2>
        <p style={{ fontSize: 18, color: "var(--muted)" }}>{arena.description}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          marginTop: 12
        }}
      >
        {arenaLevels.map((l, index) => (
          <LevelCard
            key={l.id}
            level={l}
            index={index + 1}
            isCompleted={isLevelCompleted(l.id)}
            isLocked={!isLevelUnlocked(l.id)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
