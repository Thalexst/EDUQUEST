import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import Header from "../components/Header";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Shop() {
  const { user, shopItems, buyItem, equipItem } = useContext(GameContext);
  const [filter, setFilter] = useState("all");

  const items = shopItems || [];

  // FILTRO DE SEGURIDAD: Solo permitimos estos tipos.
  // Esto expulsa cualquier "medal" o "logro" que se intente colar.
  const ALLOWED_TYPES = ["theme", "frame", "powerup"];
  
  const displayItems = items.filter(item => ALLOWED_TYPES.includes(item.type));

  const filteredItems = filter === "all" 
    ? displayItems 
    : displayItems.filter(i => i.type === filter);

  const hasItem = (id) => (user?.inventory || []).includes(id);
  const isEquipped = (value) => user?.activeTheme === value || user?.activeFrame === value;

  const handleBuy = async (item) => {
    try {
        await buyItem(item.id);
        toast.success(`¡Compraste ${item.name}!`, { icon: '🛍️' });
        if (item.type === 'theme') handleEquip('activeTheme', item.value);
        if (item.type === 'frame') handleEquip('activeFrame', item.value);
    } catch (err) {
        toast.error(err.message);
    }
  };

  const handleEquip = async (field, value) => {
      await equipItem(field, value);
      toast.success("¡Equipado!", { icon: '✨' });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e2e8f0" }}>
      <Header />
      
      <div className="container" style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
        
        <Link to="/" className="btn-ghost" style={{marginBottom: 20, display: "inline-block"}}>← Volver al Inicio</Link>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={{ fontSize: "2.5rem", margin: "0 0 10px" }}>Tienda</h1>
            <p className="muted">Personaliza tu experiencia.</p>
        </div>

        {/* Pestañas */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 30, flexWrap: "wrap" }}>
            {[
                { id: "all", label: "Todo" },
                { id: "theme", label: "Temas" },
                { id: "frame", label: "Marcos" },
                { id: "powerup", label: "Power-ups" }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    style={{
                        background: filter === tab.id ? "#48bb78" : "#1f2937",
                        color: filter === tab.id ? "#000" : "#fff",
                        border: "none", padding: "8px 20px", borderRadius: 20,
                        cursor: "pointer", fontWeight: "bold", transition: "all 0.2s"
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Grid de Productos */}
        {displayItems.length === 0 ? (
            <div style={{textAlign: "center", padding: 40}}>Cargando productos...</div>
        ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 25 }}>
                {filteredItems.map(item => {
                    const owned = hasItem(item.id);
                    const equipped = item.type === 'theme' ? user?.activeTheme === item.value : user?.activeFrame === item.value;
                    const canAfford = (user?.coins || 0) >= item.cost;

                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                background: "#1f2937", borderRadius: 16, padding: 20,
                                border: equipped ? "2px solid #48bb78" : "1px solid #374151",
                                position: "relative", overflow: "hidden"
                            }}
                        >
                            {equipped && <div style={{position: "absolute", top: 10, right: 10, background: "#48bb78", color: "#000", fontSize: "0.7rem", padding: "2px 8px", borderRadius: 10, fontWeight: "bold"}}>EQUIPADO</div>}

                            <div style={{ fontSize: "3rem", marginBottom: 15, textAlign: "center" }}>
                                {item.icon}
                            </div>
                            
                            <h3 style={{ margin: "0 0 5px", fontSize: "1.2rem" }}>{item.name}</h3>
                            <p style={{ color: "#a0aec0", fontSize: "0.9rem", height: 40, marginBottom: 10 }}>{item.description}</p>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                                <div style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "1.1rem" }}>
                                    {item.cost} 💰
                                </div>

                                {owned ? (
                                    item.type !== 'powerup' ? (
                                        <button 
                                            onClick={() => item.type === 'theme' ? handleEquip('activeTheme', item.value) : handleEquip('activeFrame', item.value)}
                                            disabled={equipped}
                                            className="btn"
                                            style={{ 
                                                background: equipped ? "#2d3748" : "#3182ce", 
                                                opacity: equipped ? 0.6 : 1, cursor: equipped ? "default" : "pointer", padding: "8px 16px"
                                            }}
                                        >
                                            {equipped ? "En uso" : "Usar"}
                                        </button>
                                    ) : (
                                        <div style={{color: "#48bb78", fontWeight: "bold", fontSize: "0.9rem"}}>Comprado</div>
                                    )
                                ) : (
                                    <button 
                                        onClick={() => handleBuy(item)}
                                        disabled={!canAfford}
                                        className="btn"
                                        style={{ 
                                            background: canAfford ? "#48bb78" : "#2d3748",
                                            cursor: canAfford ? "pointer" : "not-allowed",
                                            opacity: canAfford ? 1 : 0.5, padding: "8px 16px"
                                        }}
                                    >
                                        Comprar
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}