import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import Header from "../components/Header";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Componente visual de carga
const Skeleton = ({ width, height, borderRadius = "8px", style = {} }) => (
  <div style={{
      width, height, borderRadius, backgroundColor: "rgba(255,255,255,0.08)",
      animation: "pulse 1.5s infinite ease-in-out", marginBottom: 10, ...style
  }} />
);

// Estilos de marcos
const FRAME_STYLES = {
  gold: { border: "4px solid #ffd700", shadow: "0 0 20px rgba(255, 215, 0, 0.6)" },
  fire: { border: "4px solid #ff4500", shadow: "0 0 20px rgba(255, 69, 0, 0.6)" },
  neon: { border: "4px solid #00ffff", shadow: "0 0 20px rgba(0, 255, 255, 0.6)" },
  magic: { border: "4px solid #9f7aea", shadow: "0 0 20px rgba(159, 122, 234, 0.6)" },
  default: { border: "4px solid #4a5568", shadow: "none" }
};

// Lista de Avatares
const AVATAR_SEEDS = [
  "Felix", "Aneka", "Zack", "Molly", "Buster", "Lily", "Cookie", "Bear",
  "Gizmo", "Trouble", "Cali", "Loki", "Socks", "Bandit", "Luna", "Shadow",
  "Coco", "Pepper", "Max", "Buddy", "Charlie", "Daisy", "Ginger", "Midnight",
  "Misty", "Oreo", "Princess", "Rocky", "Ruby", "Sadie", "Toby", "Zoey",
  "Jack", "Bella", "Simba", "Nala", "Chloe", "Sophie", "Willow", "Leo"
];

export default function Profile() {
  const { user, levels, medals, userProgress, updateUserProfile } = useContext(GameContext);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const skeletonStyleTag = (<style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e2e8f0" }}>
        {skeletonStyleTag}<Header />
        <div className="container" style={{ maxWidth: 1000, margin: "40px auto", padding: "20px" }}>
           <Skeleton width={120} height={20} />
           <div style={{ background: "#1f2937", borderRadius: 20, padding: 40, marginTop: 20 }}>
              <Skeleton width="100%" height={200} />
           </div>
        </div>
      </div>
    );
  }

  // Cálculos
  const getRank = (xp) => {
    if (xp < 100) return { title: "Novato", color: "#a0aec0" };
    if (xp < 500) return { title: "Aprendiz", color: "#63b3ed" };
    if (xp < 1000) return { title: "Desarrollador", color: "#f6ad55" };
    return { title: "Arquitecto", color: "#9f7aea" };
  };
  const rank = getRank(user.xp || 0);
  const levelsCompleted = userProgress.filter(p => p.completed).length;
  const totalLevels = levels.length > 0 ? levels.length : 1; 
  const progressPercent = Math.round((levelsCompleted / totalLevels) * 100);
  
  const activeFrameStyle = FRAME_STYLES[user.activeFrame] || FRAME_STYLES.default;
  const currentAvatar = user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`;

  const handleAvatarSelect = async (seed) => {
    const newAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    try { await updateUserProfile({ avatar: newAvatar }); toast.success("Avatar actualizado"); setEditingAvatar(false); } catch (e) { toast.error("Error"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e2e8f0" }}>
      <Header />
      
      <div className="container" style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
        <Link to="/" className="btn-ghost" style={{marginBottom: 20, display: "inline-block"}}>← Volver al Inicio</Link>

        {/* TARJETA SUPERIOR */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: "#1f2937", borderRadius: 20, padding: 40, display: "grid", gridTemplateColumns: "minmax(250px, 1fr) 2fr", gap: 40, border: "1px solid #374151" }}>
          
          {/* Columna Izquierda: Avatar */}
          <div style={{ textAlign: "center", borderRight: "1px solid #374151", paddingRight: 20 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <img src={currentAvatar} alt="Avatar" style={{ width: 180, height: 180, borderRadius: "50%", background: "#2d3748", border: activeFrameStyle.border, boxShadow: activeFrameStyle.shadow, transition: "transform 0.2s" }} />
                <button onClick={() => setEditingAvatar(!editingAvatar)} style={{ position: "absolute", bottom: 10, right: 10, background: "#48bb78", border: "2px solid #222", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: "1.2rem" }}>✏️</button>
            </div>
            <h1 style={{ margin: "20px 0 5px", fontSize: "2rem" }}>{user.name}</h1>
            <span style={{ color: rank.color, border: `1px solid ${rank.color}`, padding: "2px 10px", borderRadius: 12, fontSize: "0.8rem", textTransform: "uppercase" }}>{rank.title}</span>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 15 }}>
                <div style={{background: "#2d3748", padding: "5px 15px", borderRadius: 8}}>🔥 {user.streak || 0}</div>
                <div style={{background: "#2d3748", padding: "5px 15px", borderRadius: 8}}>⚡ {user.xp || 0} XP</div>
            </div>
          </div>

          {/* Columna Derecha: Stats y Selector */}
          <div>
            {editingAvatar && (
                <div style={{ background: "#2d3748", padding: 20, borderRadius: 12, marginBottom: 20, border: "1px solid #48bb78" }}>
                    <h3 style={{ marginTop: 0 }}>Elige tu Avatar</h3>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxHeight: 200, overflowY: "auto" }}>
                        {AVATAR_SEEDS.map(seed => (
                            <img key={seed} src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} alt={seed} onClick={() => handleAvatarSelect(seed)} style={{ width: 50, height: 50, borderRadius: "50%", cursor: "pointer", background: "#1a202c", border: "2px solid transparent" }} 
                            onMouseOver={e=>e.currentTarget.style.border="2px solid #48bb78"} onMouseOut={e=>e.currentTarget.style.border="transparent"}/>
                        ))}
                    </div>
                </div>
            )}

            <h3 style={{marginBottom: 10}}>Progreso General</h3>
            <div style={{ width: "100%", height: 10, background: "#2d3748", borderRadius: 5, overflow: "hidden", marginBottom: 5 }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", background: "#48bb78" }} />
            </div>
            <p style={{color: "#a0aec0", fontSize: "0.9rem", marginTop: 0}}>{levelsCompleted} de {levels.length} niveles completados</p>
            
            {/* --- ESTADÍSTICAS (Logros Totales y Riqueza) --- */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 25, marginBottom: 25 }}>
                <div style={{ background: "#2d3748", padding: 15, borderRadius: 12 }}>
                    <h4 style={{ margin: "0 0 5px", fontSize: "0.8rem", color: "#a0aec0", textTransform: "uppercase" }}>LOGROS TOTALES</h4>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        {user.medals?.length || 0} <span style={{fontSize: "1rem", color: "#718096"}}>/ {medals.length}</span>
                    </div>
                </div>
                <div style={{ background: "#2d3748", padding: 15, borderRadius: 12 }}>
                    <h4 style={{ margin: "0 0 5px", fontSize: "0.8rem", color: "#a0aec0", textTransform: "uppercase" }}>RIQUEZA ACUMULADA</h4>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fbbf24" }}>
                        {user.coins || 0} 💰
                    </div>
                </div>
            </div>

            {/* --- ACTIVIDAD RECIENTE (CORREGIDA) --- */}
            <h3 style={{marginBottom: 15}}>Última Actividad</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {userProgress.slice(-3).reverse().map(prog => {
                   
                    const lvl = levels.find(l => String(l.id) === String(prog.levelId));
                    
                    if (!lvl) return null;
                    return (
                      <div key={prog.id} style={{fontSize: "0.9rem", color: "#e2e8f0", display: "flex", alignItems: "center", gap: 10, padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: 8}}>
                        <span style={{color: "#48bb78", fontSize: "1.2rem"}}>✓</span> 
                        <span>Completaste <strong>{lvl.title}</strong></span>
                      </div>
                    )
                })}
                {userProgress.length === 0 && <span style={{color:"#718096", fontStyle: "italic"}}>Aún no hay actividad reciente.</span>}
            </div>

          </div>
        </motion.div>

        {/* --- SECCIÓN INFERIOR: TODOS LOS LOGROS --- */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginTop: 40 }}>
            <h2 style={{borderBottom: "1px solid #374151", paddingBottom: 15, marginBottom: 25}}>🏆 Todos los Logros</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {medals.map(medal => {
                    const isUnlocked = (user.medals || []).includes(medal.id);
                    return (
                        <div 
                            key={medal.id} 
                            style={{ 
                                background: isUnlocked ? "linear-gradient(145deg, #2d3748, #1a202c)" : "#1a202c", 
                                border: isUnlocked ? "1px solid #fbbf24" : "1px dashed #4a5568",
                                borderRadius: 16, padding: 20,
                                display: "flex", alignItems: "center", gap: 15,
                                opacity: isUnlocked ? 1 : 0.5, 
                                filter: isUnlocked ? "none" : "grayscale(100%)",
                                position: "relative", overflow: "hidden"
                            }}
                        >
                            {isUnlocked && <div style={{position:"absolute", top:0, right:0, background:"#fbbf24", color:"#000", fontSize:"0.6rem", padding:"2px 8px", borderBottomLeftRadius:8, fontWeight:"bold"}}>DESBLOQUEADO</div>}
                            <div style={{ fontSize: "2.5rem" }}>{medal.icon}</div>
                            <div>
                                <h4 style={{ margin: "0 0 5px", color: isUnlocked ? "#fbbf24" : "#a0aec0" }}>{medal.name}</h4>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#718096" }}>{medal.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>

      </div>
    </div>
  );
}