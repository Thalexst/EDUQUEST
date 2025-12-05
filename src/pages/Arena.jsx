import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import LevelCard from "../components/LevelCard";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function Arena() {
  const { id } = useParams();
  const arenaId = Number(id); // <-- aseguramos número

  const { arenas = [], levels = [], dataLoaded } = useContext(GameContext);

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

  return (
    <div>
      <Header />

      <Link to="/" className="btn-ghost" style={{ display: "inline-block", marginTop: 10, textDecoration: "none" }}>
        ← Volver
      </Link>

      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ marginTop: 8 }}
      >
        {arena.name}
      </motion.h2>

      <p>{arena.description}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 12,
          marginTop: 12
        }}
      >
        {arenaLevels.map(l => (
          <LevelCard key={l.id} level={l} />
        ))}
      </div>
    </div>
  );
}
