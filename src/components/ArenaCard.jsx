import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ArenaCard({ arena }){
  return (
    <motion.div whileHover={{ scale:1.02 }} className="arena-card" style={{minWidth:240}}>
      <h3>{arena.name}</h3>
      <p className="muted">{arena.description}</p>
      <Link to={`/arena/${arena.id}`} className="btn">Entrar</Link>
    </motion.div>
  );
}
