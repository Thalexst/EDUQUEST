import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import * as api from "../services/api";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function Level() {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const { user, markLevelCompleted, dataLoaded } = useContext(GameContext);
  const [code, setCode] = useState("// escribe tu solución aquí\n");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.getLevel(id).then(setLevel).catch(() => { });
  }, [id]);

  const runCode = () => {
    const logs = [];
    const originalConsoleLog = console.log;
    try {
      console.log = (...args) => { logs.push(args.join(" ")); };
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      fn();
    } catch (err) {
      logs.push("Error: " + err.message);
    } finally {
      console.log = originalConsoleLog;
    }
    setOutput(logs.join("\n"));
    return logs.join("\n");
  };

  const submit = async () => {
    if (!level || !user) { alert("Asegúrate de estar logueado y que el nivel cargue"); return; }
    setStatus("running");
    const result = runCode();
    const expected = String(level.expectedOutput).trim();
    if (result.trim() === expected) {
      try {
        await markLevelCompleted(level.id, level.coinReward);
        setStatus("passed");
        alert(`¡Bien! Nivel completado. Has ganado ${level.coinReward} monedas.`);
      } catch (err) {
        setStatus("error");
        alert(err.message || "Error al registrar progreso");
      }
    } else {
      setStatus("failed");
      alert("La salida no coincide con lo esperado.\nSalida: " + result + "\nEsperado: " + expected);
    }
  };

  if (!dataLoaded) return <div><Header /><p>Cargando...</p></div>;
  if (!level) return <div><Header /><p>Este nivel no existe</p></div>;

  return (
    <div>
      <Header />
      <Link to={`/arena/${level.arenaId}`} className="btn-ghost" style={{ display: "inline-block", marginTop: 10, textDecoration: "none" }}>← Volver al Arena</Link>
      <motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginTop: 8 }}>{level.title}</motion.h2>
      <p><strong>Tarea:</strong> {level.task}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 12, marginTop: 12 }}>
        <div>
          <textarea value={code} onChange={e => setCode(e.target.value)} style={{ width: "100%", minHeight: 320, padding: 12, borderRadius: 8, background: "#0b1220", color: "#e6eef6", border: "1px solid rgba(255,255,255,0.04)" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={runCode}>Ejecutar</button>
            <button onClick={submit}>Completar nivel</button>
            <button onClick={() => { setCode("// prueba: console.log('Hola Mundo')\n"); setOutput(""); setStatus(null); }}>Reset</button>
          </div>
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}>
            <strong>Salida (console.log):</strong>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{output}</pre>
          </div>
          {status === "passed" && <div style={{ marginTop: 12, color: "#9ae6b4" }}>✅ Nivel completado</div>}
          {status === "failed" && <div style={{ marginTop: 12, color: "#feb2b2" }}>❌ Salida incorrecta</div>}
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}>
          <h4>Información</h4>
          <p><strong>Recompensa:</strong> {level.coinReward} monedas</p>
          <p><strong>XP:</strong> {level.xp}</p>
          <p className="muted">Al completar este nivel, el progreso será guardado y recibirás las monedas automáticamente.</p>
          <div style={{ marginTop: 12 }}>
            <strong>Consejo:</strong>
            <p className="muted">Para imprimir, usa <code>console.log('...')</code>. La comparación es exacta (sin comillas).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
