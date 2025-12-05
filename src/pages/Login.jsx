import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ParticleBackground from "../components/ParticleBackground";

export default function Login() {
  const { login } = useContext(GameContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("¡Bienvenido de nuevo!");
      nav("/");
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#111", // Dark background
      padding: 20,
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <ParticleBackground />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
        style={{
          width: "100%",
          maxWidth: 400,
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: 60, marginBottom: 16, display: "inline-block" }}
          >
            🦉
          </motion.div>
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#fff", fontWeight: "800" }}>Ingresar</h1>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              background: "#1e1e1e", // Dark input
              border: "2px solid #333",
              color: "#fff",
              fontSize: "1.1rem",
              outline: "none",
              fontWeight: "600"
            }}
            onFocus={(e) => e.target.style.borderColor = "#58cc02"}
            onBlur={(e) => e.target.style.borderColor = "#333"}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              background: "#1e1e1e", // Dark input
              border: "2px solid #333",
              color: "#fff",
              fontSize: "1.1rem",
              outline: "none",
              fontWeight: "600"
            }}
            onFocus={(e) => e.target.style.borderColor = "#58cc02"}
            onBlur={(e) => e.target.style.borderColor = "#333"}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-duo"
            style={{
              marginTop: 16,
              width: "100%",
              background: "#58cc02",
              color: "#fff",
              border: "none",
              borderBottom: "4px solid #58a700",
              borderRadius: 16,
              fontSize: "1.1rem",
              fontWeight: "800",
              padding: "14px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              transition: "filter 0.1s, transform 0.1s"
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(2px)";
              e.target.style.borderBottomWidth = "2px";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.borderBottomWidth = "4px";
            }}
          >
            {loading ? "Cargando..." : "INGRESAR"}
          </button>
        </form>

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <Link to="/register" style={{
            display: "block",
            width: "100%",
            padding: "14px",
            borderRadius: 16,
            background: "transparent",
            border: "2px solid #333",
            borderBottom: "4px solid #333",
            color: "#58cc02",
            fontWeight: "800",
            textDecoration: "none",
            textTransform: "uppercase",
            fontSize: "1rem"
          }}>
            Crear cuenta
          </Link>

          <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: "bold" }}>
            AL INICIAR SESIÓN EN EDUQUEST, ACEPTAS NUESTROS TÉRMINOS Y POLÍTICAS.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
