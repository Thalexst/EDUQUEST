import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import * as api from "../services/api";
import Header from "../components/Header";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import useSound from "../hooks/useSound"; // Import sound hook

export default function Level() {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const { user, markLevelCompleted, dataLoaded } = useContext(GameContext);
  const [code, setCode] = useState("// escribe tu solución aquí\n");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);
  const playSound = useSound(); // Init hook

  useEffect(() => {
    api.getLevel(id).then(setLevel).catch(() => { });
  }, [id]);

  const runCode = () => {
    playSound("click");
    const logs = [];
    const originalConsoleLog = console.log;
    try {
      console.log = (...args) => { logs.push(args.join(" ")); };
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      fn();
    } catch (err) {
      logs.push("Error: " + err.message);
      playSound("error");
    } finally {
      console.log = originalConsoleLog;
    }
    setOutput(logs.join("\n"));
    return logs.join("\n");
  };

  const submit = async () => {
    playSound("click");
    if (!level || !user) { toast.error("Asegúrate de estar logueado y que el nivel cargue"); return; }
    setStatus("running");
    const result = runCode();
    const expected = String(level.expectedOutput).trim();

    if (result.trim() === expected) {
      try {
        playSound("success");
        playSound("confetti");
        await markLevelCompleted(level.id, level.coinReward);
        setStatus("passed");
        toast.success(`¡Nivel completado! +${level.coinReward} monedas`);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        setStatus("error");
        toast.error(err.message || "Error al registrar progreso");
      }
    } else {
      playSound("error");
      setStatus("failed");
      toast.error("La salida no coincide. Revisa tu código.");
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
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck="false"
            style={{
              width: "100%",
              minHeight: 320,
              padding: 16,
              borderRadius: 8,
              background: "#1e1e1e",
              color: "#d4d4d4",
              border: "1px solid #333",
              fontFamily: "'Fira Code', 'Consolas', monospace",
              fontSize: "14px",
              lineHeight: "1.5",
              outline: "none",
              resize: "vertical"
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={runCode} className="btn-ghost">Ejecutar</button>
            <button onClick={submit} className="btn">Completar nivel</button>
            <button onClick={() => { setCode("// prueba: console.log('Hola Mundo')\n"); setOutput(""); setStatus(null); }} className="btn-ghost" style={{ color: "#aaa" }}>Reset</button>
          </div>
          <div style={{ marginTop: 12, background: "#111", padding: 12, borderRadius: 8, border: "1px solid #333" }}>
            <strong style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase" }}>Consola</strong>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8, fontFamily: "monospace", color: "#fff" }}>{output || <span style={{ color: "#444" }}>...</span>}</pre>
          </div>
          {status === "passed" && <div style={{ marginTop: 12, color: "#48bb78", fontWeight: "bold" }}>✅ Nivel completado</div>}
          {status === "failed" && <div style={{ marginTop: 12, color: "#f56565", fontWeight: "bold" }}>❌ Salida incorrecta</div>}
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
