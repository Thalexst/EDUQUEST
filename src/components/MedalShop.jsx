import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function MedalShop() {
  const { medals = [], redeemMedal, user } = useContext(GameContext);
  const [list, setList] = useState([]);

  useEffect(() => setList(medals || []), [medals]);

  const buy = async (item) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }
    if (user.coins < item.costCoins) {
      toast.error("No tienes suficientes monedas");
      return;
    }

    try {
      await redeemMedal(item.id);
      toast.success(`¡Compraste ${item.name}!`);
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FFFFFF'] // Gold colors
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      {list.map(item => {
        const isAffordable = user && user.coins >= item.costCoins;
        const isOwned = user && user.medals && user.medals.includes(item.id);

        return (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            className="card"
            style={{
              width: "100%",
              background: "linear-gradient(145deg, #202f36, #1a262c)",
              border: "2px solid #37464f",
              boxShadow: "0 8px 0 #131f24",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Type Badge */}
            <div style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "0.7rem",
              background: "rgba(255,255,255,0.1)",
              padding: "4px 8px",
              borderRadius: 12,
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#aaa"
            }}>
              {item.type === "powerup" ? "Power-up" : item.type === "skin" ? "Skin" : "Medalla"}
            </div>

            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{
                fontSize: 60,
                marginBottom: 12,
                filter: isOwned ? "grayscale(0%)" : "drop-shadow(0 4px 4px rgba(0,0,0,0.3))"
              }}>
                {item.icon || "🏅"}
              </div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#fff" }}>{item.name}</h4>
              <p className="muted" style={{ fontSize: "0.9rem", minHeight: 40 }}>{item.description}</p>
            </div>

            <button
              onClick={() => !isOwned && buy(item)}
              className="btn"
              disabled={isOwned}
              style={{
                width: "100%",
                background: isOwned ? "#37464f" : (isAffordable ? "#ffc800" : "#37464f"),
                color: isOwned ? "#aaa" : (isAffordable ? "#5d3a00" : "#aaa"),
                boxShadow: isOwned ? "none" : (isAffordable ? "0 4px 0 #e5a500" : "none"),
                cursor: isOwned ? "default" : (isAffordable ? "pointer" : "not-allowed"),
                opacity: isOwned ? 0.7 : 1
              }}
            >
              {isOwned ? "COMPRADO" : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {item.costCoins} <span style={{ fontSize: "1.1rem" }}>💰</span>
                </span>
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
