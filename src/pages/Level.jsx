import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import * as api from "../services/api";
import Header from "../components/Header";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import useSound from "../hooks/useSound";

// --- DEFINICIÓN DE COLORES DE TEMAS ---
const THEMES = {
  dracula: { bg: "#282a36", color: "#f8f8f2", border: "#44475a" },
  matrix: { bg: "#000000", color: "#00ff00", border: "#003300" },
  synthwave: { bg: "#2b213a", color: "#ff79c6", border: "#bd93f9" },
  hacker: { bg: "#0f0f0f", color: "#ffb000", border: "#333" },
  default: { bg: "#1e1e1e", color: "#d4d4d4", border: "#333" }
};

export default function Level() {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const { user, markLevelCompleted, dataLoaded } = useContext(GameContext);
  const [code, setCode] = useState("// escribe tu solución aquí\n");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);
  const playSound = useSound();

  useEffect(() => {
    setStatus(null);
    setOutput("");
    setCode("// escribe tu solución aquí\n");
    api.getLevel(id).then(l => setLevel(l)).catch(() => { });
  }, [id]);

  const normalize = (str) => String(str || "").trim().replace(/\s+$/gm, "").replace(/\r\n/g, "\n");

  const runCode = () => {
    playSound("click");
    const logs = [];
    const originalConsoleLog = console.log;
    try {
      console.log = (...args) => { logs.push(args.map(a => String(a)).join(" ")); };
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      fn();
    } catch (err) {
      logs.push("Error: " + err.message);
      playSound("error");
    } finally {
      console.log = originalConsoleLog;
    }
    const result = logs.join("\n");
    setOutput(result);
    return result;
  };

  const submit = async () => {
    playSound("click");
    if (!level || !user) { toast.error("Error cargando"); return; }
    setStatus("running");
    const result = runCode();
    
    if (normalize(result) === normalize(level.expectedOutput)) {
      try {
        playSound("success");
        playSound("confetti");
        const { already } = await markLevelCompleted(level.id, level.coinReward);
        setStatus("passed");
        if (!already) toast.success(`¡Nivel completado! +${level.coinReward} monedas`);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) { setStatus("error"); }
    } else {
      playSound("error");
      setStatus("failed");
      toast.error("Resultado incorrecto");
    }
  };

  if (!dataLoaded || !level) return <div><Header /><div className="p-10">Cargando...</div></div>;

  // --- SELECCIONAR TEMA ACTIVO ---
  const activeTheme = THEMES[user?.activeTheme] || THEMES.default;

  return (
    <div>
      <Header />
      <div style={{ padding: "0 20px" }}>
        <Link to={`/arena/${level.arenaId}`} className="btn-ghost" style={{ display: "inline-block", marginTop: 10 }}>← Volver</Link>
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 style={{ marginTop: 8, fontSize: "2rem" }}>{level.title}</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}><strong>Tarea:</strong> {level.task}</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 20, marginTop: 12 }}>
          <div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
              style={{
                width: "100%",
                height: "400px",
                padding: 16,
                borderRadius: 8,
                // --- APLICAR COLORES DEL TEMA ---
                background: activeTheme.bg,
                color: activeTheme.color,
                border: `1px solid ${status === "failed" ? "#f56565" : activeTheme.border}`,
                // --------------------------------
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: "15px",
                lineHeight: "1.5",
                outline: "none",
                resize: "vertical"
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <button onClick={runCode} className="btn-ghost" style={{border: "1px solid #444"}}>▶ Ejecutar</button>
              <button onClick={submit} className="btn" style={{flex: 1}}>✅ Completar Nivel</button>
              <button onClick={() => { setCode("// escribe tu solución aquí\n"); setOutput(""); setStatus(null); }} className="btn-ghost">↺ Reset</button>
            </div>
            
            <div style={{ marginTop: 20, background: "#111", padding: 15, borderRadius: 8, border: "1px solid #333", minHeight: "100px" }}>
              <strong style={{ color: "#666", fontSize: "0.8rem", textTransform: "uppercase" }}>Consola</strong>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: 10, fontFamily: "monospace", color: output ? "#fff" : "#444" }}>{output || "// ..."}</pre>
            </div>
            {status === "failed" && (
                <div style={{ marginTop: 15, padding: 10, background: "rgba(245, 101, 101, 0.1)", border: "1px solid #f56565", borderRadius: 6, color: "#f56565" }}>
                    <strong>Salida incorrecta.</strong> Esperado: "{level.expectedOutput}"
                </div>
            )}
          </div>
           <div style={{ background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 12, height: "fit-content" }}>
            <h4 style={{marginTop: 0, borderBottom: "1px solid #333", paddingBottom: 10, marginBottom: 15}}>Detalles</h4>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10}}><span>💰 Recompensa:</span><span style={{color: "#fbbf24", fontWeight: "bold"}}>{level.coinReward}</span></div>
            <div style={{display: "flex", justifyContent: "space-between"}}><span>✨ XP:</span><span style={{color: "#60a5fa", fontWeight: "bold"}}>{level.xp}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}