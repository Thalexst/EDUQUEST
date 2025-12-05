import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useContext(GameContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login({ email, password });
      nav("/");
    } catch (error) {
      setErr(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="center">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
        <h2>Iniciar sesión</h2>
        <form onSubmit={submit} className="card">
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit">Entrar</button>
          {err && <div className="error">{err}</div>}
          <div className="muted">¿No tienes cuenta? <Link to="/register">Regístrate</Link></div>
        </form>
      </motion.div>
    </div>
  );
}
