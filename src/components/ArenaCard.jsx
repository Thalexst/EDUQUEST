import React from "react";
import { Link } from "react-router-dom";
import TiltCard from "./TiltCard";

const THEMES = [
  { color: "var(--theme-green)", shadow: "var(--theme-green-shadow)", icon: "🚀" },
  { color: "var(--theme-blue)", shadow: "var(--theme-blue-shadow)", icon: "⚡" },
  { color: "var(--theme-purple)", shadow: "var(--theme-purple-shadow)", icon: "🐍" },
  { color: "var(--theme-orange)", shadow: "var(--theme-orange-shadow)", icon: "🧠" },
  { color: "var(--theme-red)", shadow: "var(--theme-red-shadow)", icon: "🔥" },
];

export default function ArenaCard({ arena, progress = 0 }) {
  // Pick a theme based on ID (cycling through themes)
  const themeIndex = (Number(arena.id) - 1) % THEMES.length;
  const theme = THEMES[themeIndex] || THEMES[0];

  return (
    <TiltCard
      className="arena-card"
      style={{ borderColor: theme.border || "var(--border)" }}
    >
      {/* Big Icon Circle */}
      <div className="arena-icon" style={{ background: theme.color, boxShadow: `0 4px 0 ${theme.shadow}` }}>
        {theme.icon}
      </div>

      <h3>{arena.name}</h3>
      <p className="muted" style={{ fontSize: "0.9rem", marginBottom: 16 }}>{arena.description}</p>

      {/* Progress Bar */}
      <div style={{ width: "100%", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "800", marginBottom: 4, color: theme.color }}>
          <span>PROGRESO</span>
          <span>{progress}%</span>
        </div>
        <div style={{ width: "100%", height: 12, background: "#37464f", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: theme.color,
            boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.2)` // Inner shadow for depth
          }} />
        </div>
      </div>

      <Link
        to={`/arena/${arena.id}`}
        className="btn"
        style={{
          width: "100%",
          background: theme.color,
          boxShadow: `0 4px 0 ${theme.shadow}`
        }}
      >
        ENTRAR
      </Link>
    </TiltCard>
  );
}
