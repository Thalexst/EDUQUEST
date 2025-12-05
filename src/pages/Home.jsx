import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import ArenaCard from "../components/ArenaCard";
import Header from "../components/Header";
import MedalShop from "../components/MedalShop";
import { motion } from "framer-motion";

export default function Home(){
  const { arenas, dataLoaded } = useContext(GameContext);
  if (!dataLoaded) return <div style={{padding:20}}>Cargando datos...</div>;

  return (
    <div>
      <Header />
      <motion.h2 initial={{ x: -20, opacity:0 }} animate={{ x:0, opacity:1 }}>Arenas</motion.h2>
      <div style={{display:"flex", gap:16, flexWrap:"wrap", marginTop:12}}>
        {Array.isArray(arenas) && arenas.length > 0 ? (
          arenas.map(a => <ArenaCard key={a.id} arena={a} />)
        ) : (
          <p style={{marginLeft:12}}>No hay arenas disponibles.</p>
        )}
      </div>

      <h3 style={{marginTop:24}}>Tienda de medallas</h3>
      <MedalShop />
    </div>
  );
}
