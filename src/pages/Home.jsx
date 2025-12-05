import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import ArenaCard from "../components/ArenaCard";
import Header from "../components/Header";
import Leaderboard from "../components/Leaderboard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  const { arenas, dataLoaded, getArenaProgress, user } = useContext(GameContext);
  
  if (!dataLoaded) return <div style={{ padding: 40, color: "#a0aec0", textAlign: "center" }}>Cargando ecosistema...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e2e8f0" }}>
      <Header />

      <div className="container" style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        
        {/* BANNER DE BIENVENIDA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
            borderRadius: 24,
            padding: "40px",
            marginBottom: 40,
            border: "1px solid #374151",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden"
          }}
        >
            {/* Elemento decorativo de fondo */}
            <div style={{position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "#48bb78", filter: "blur(100px)", opacity: 0.1}} />

            <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800 }}>
                Hola, <span style={{ background: "linear-gradient(90deg, #48bb78, #38b2ac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {user?.name}
                </span> 👋
            </h1>
            <p style={{ marginTop: 10, fontSize: "1.1rem", color: "#a0aec0", maxWidth: "600px" }}>
                ¿Listo para escribir código hoy? Continúa tu progreso y domina las arenas.
            </p>
            
            <div style={{ display: "flex", gap: 15, marginTop: 25 }}>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 12, fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                    🔥 Racha: <strong>{user?.streak || 0} días</strong>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 12, fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                    ⚡ Nivel Actual: <strong>{Math.floor((user?.xp || 0) / 100) + 1}</strong>
                </div>
            </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 30 }}>
          
          {/* SECCIÓN PRINCIPAL: ARENAS */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Arenas de Combate</h2>
                <span style={{ fontSize: "0.9rem", color: "#718096" }}>{arenas.length} Disponibles</span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {Array.isArray(arenas) && arenas.length > 0 ? (
                arenas.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ArenaCard
                      arena={a}
                      progress={getArenaProgress(a.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="muted">No hay arenas disponibles por el momento.</p>
              )}
            </div>
          </div>

          {/* SIDEBAR: LEADERBOARD */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ background: "#1f2937", padding: 25, borderRadius: 20, border: "1px solid #374151", position: "sticky", top: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: "1.5rem" }}>🏆</span>
                    <h3 style={{ margin: 0 }}>Top Jugadores</h3>
                </div>
                <Leaderboard />
                
                {/* Banner pequeño promocional de la tienda */}
                <div style={{ marginTop: 30, padding: 20, background: "linear-gradient(135deg, #2d3748, #1a202c)", borderRadius: 12, textAlign: "center", border: "1px solid #4a5568" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 10 }}>🛍️</div>
                    <h4 style={{ margin: "0 0 5px" }}>¡Personaliza tu Avatar!</h4>
                    <p style={{ fontSize: "0.8rem", color: "#a0aec0", marginBottom: 15 }}>Usa tus monedas para destacar.</p>
                    <Link to="/shop" className="btn" style={{ width: "100%", display: "block", textAlign: "center", textDecoration: "none", fontSize: "0.9rem" }}>Ir a la Tienda</Link>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}