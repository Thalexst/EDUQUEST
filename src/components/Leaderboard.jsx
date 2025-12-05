import React, { useEffect, useState, useContext } from "react";
import * as api from "../services/api";
import { GameContext } from "../context/GameContext";

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const { user: currentUser } = useContext(GameContext);

    useEffect(() => {
        api.getUsers().then(all => {
            // Sort by XP (descending)
            const sorted = all.sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
            setUsers(sorted);
        });
    }, []);

    return (
        <div className="card" style={{ width: "100%", background: "var(--card-bg)", border: "2px solid var(--border)" }}>
            <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🏆</span> Tabla de Líderes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {users.map((u, i) => {
                    const isMe = currentUser && currentUser.id === u.id;
                    return (
                        <div
                            key={u.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px 12px",
                                background: isMe ? "rgba(88, 204, 2, 0.2)" : "rgba(255,255,255,0.05)",
                                borderRadius: 12,
                                border: isMe ? "2px solid var(--theme-green)" : "1px solid transparent"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <strong style={{ color: i === 0 ? "#ffc800" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "var(--muted)" }}>
                                    #{i + 1}
                                </strong>
                                <span style={{ fontWeight: isMe ? "bold" : "normal" }}>{u.name}</span>
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "var(--theme-blue)" }}>
                                {u.xp || 0} XP
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
