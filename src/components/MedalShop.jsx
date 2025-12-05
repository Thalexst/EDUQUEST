import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";

export default function MedalShop(){
  const { medals = [], redeemMedal } = useContext(GameContext);
  const [list, setList] = useState([]);

  useEffect(()=> setList(medals || []), [medals]);

  const buy = async (id) => {
    try {
      await redeemMedal(id);
      alert("Medalla canjeada!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
      {list.map(m => (
        <div key={m.id} className="card" style={{width:260}}>
          <h4>{m.name}</h4>
          <div className="muted">{m.description}</div>
          <div style={{marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>Precio: {m.costCoins} monedas</div>
            <button onClick={()=>buy(m.id)} className="btn-small">Canjear</button>
          </div>
        </div>
      ))}
    </div>
  );
}
