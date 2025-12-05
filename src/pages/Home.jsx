import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import ArenaCard from "../components/ArenaCard";
import Header from "../components/Header";
import MedalShop from "../components/MedalShop";
import Leaderboard from "../components/Leaderboard";
import { motion } from "framer-motion";

export default function Home() {
  const { arenas, dataLoaded, getArenaProgress } = useContext(GameContext);
  if (!dataLoaded) return <div style={{ padding: 20 }}>Cargando datos...</div>;

  return (
    <div>
      <Header />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Main Content: Arenas */}
        <div>
          <motion.h2 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>Arenas</motion.h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            {Array.isArray(arenas) && arenas.length > 0 ? (
              arenas.map(a => (
                <ArenaCard
                  key={a.id}
                  arena={a}
                  progress={getArenaProgress(a.id)}
                />
              ))
            ) : (
              <p style={{ marginLeft: 12 }}>No hay arenas disponibles.</p>
            )}
          </div>

          <h3 style={{ marginTop: 32 }}>Tienda de Power-ups</h3>
          <MedalShop />
        </div>

        {/* Sidebar: Leaderboard */}
        <div style={{ marginTop: 56 }}>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
