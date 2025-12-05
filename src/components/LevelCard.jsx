import React from "react";
import { Link } from "react-router-dom";

export default function LevelCard({ level, isCompleted, isLocked, theme, index }) {
  const borderColor = isLocked ? "var(--border)" : (theme?.color || "var(--theme-green)");
  const shadowColor = isLocked ? "var(--border)" : (theme?.shadow || "var(--theme-green-shadow)");

  return (
    <div
      className="level-card"
      style={{
        opacity: isLocked ? 0.6 : 1,
        position: "relative",
        border: `2px solid ${borderColor}`,
        boxShadow: `0 4px 0 ${shadowColor}`,
        borderRadius: 20,
        padding: 20,
        background: "var(--card-bg)",
        transition: "transform 0.1s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        {/* Level Number Circle */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isLocked ? "#37464f" : borderColor,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 18,
          boxShadow: `0 2px 0 rgba(0,0,0,0.2)`
        }}>
          {index}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: 18, color: isLocked ? "var(--muted)" : "#fff" }}>{level.title}</h4>
        </div>

        {isCompleted && <span style={{ fontSize: "1.5rem" }}>✅</span>}
        {isLocked && <span style={{ fontSize: "1.5rem" }}>🔒</span>}
      </div>

      <p className="muted" style={{ fontSize: "0.9rem", marginBottom: 16, minHeight: 40 }}>{level.task}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="muted" style={{ fontSize: "0.85rem" }}>
          <span style={{ color: "#fbbf24", marginRight: 4 }}>💰</span>
          {level.coinReward}
        </div>

        {isLocked ? (
          <button disabled className="btn-small" style={{ cursor: "not-allowed", background: "#37464f", boxShadow: "none", color: "#778899" }}>
            Bloqueado
          </button>
        ) : (
          <Link
            to={`/level/${level.id}`}
            className="btn-small"
            style={{
              background: borderColor,
              boxShadow: `0 4px 0 ${shadowColor}`,
              textDecoration: "none"
            }}
          >
            {isCompleted ? "Repetir" : "Jugar"}
          </Link>
        )}
      </div>
    </div>
  );
}
