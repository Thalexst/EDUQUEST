import React from "react";
import { Link } from "react-router-dom";

export default function LevelCard({ level }){
  return (
    <div className="level-card">
      <h4>{level.title}</h4>
      <p className="muted">{level.task}</p>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div className="muted">Recompensa: {level.coinReward} monedas</div>
        <Link to={`/level/${level.id}`} className="btn-small">Jugar</Link>
      </div>
    </div>
  );
}
