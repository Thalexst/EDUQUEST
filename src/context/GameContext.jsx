import { createContext, useState, useEffect } from "react";
import * as api from "../services/api";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [arenas, setArenas] = useState([]);
  const [levels, setLevels] = useState([]);
  const [medals, setMedals] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, l, m] = await Promise.all([api.getArenas(), api.getLevels(), api.getMedals()]);
        setArenas(a || []);
        setLevels(l || []);
        setMedals(m || []);
        setDataLoaded(true);
      } catch (err) {
        console.error("Error cargando data:", err);
        setDataLoaded(true);
      }
    };
    load();

    const savedId = localStorage.getItem("userId");
    if (savedId) {
      api.getUser(savedId)
        .then(u => { if (u && u.id) setUser(u); else localStorage.removeItem("userId"); })
        .catch(()=>localStorage.removeItem("userId"));
    }
  }, []);

  const register = async ({ name, email, password }) => {
    const found = await api.findUserByEmail(email);
    if (found.length > 0) throw new Error("Email ya registrado");
    const newUser = await api.createUser({ name, email, password, coins: 0, medals: [] });
    localStorage.setItem("userId", newUser.id);
    setUser(newUser);
    return newUser;
  };

  const login = async ({ email, password }) => {
    setLoadingAuth(true);
    try {
      const found = await api.findUserByEmail(email);
      const userFound = found.find(u => u.password === password);
      if (!userFound) throw new Error("Credenciales inválidas");
      localStorage.setItem("userId", userFound.id);
      setUser(userFound);
      setLoadingAuth(false);
      return userFound;
    } catch (err) {
      setLoadingAuth(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  const earnCoins = async (amount) => {
    if (!user) throw new Error("No hay usuario");
    const updated = await api.updateUser(user.id, { coins: (user.coins || 0) + amount });
    setUser(updated);
    await api.createTransaction({ userId: user.id, type: "earn", amount, date: new Date().toISOString() });
    return updated;
  };

  const spendCoins = async (amount) => {
    if (!user) throw new Error("No hay usuario");
    if ((user.coins || 0) < amount) throw new Error("No tienes suficientes monedas");
    const updated = await api.updateUser(user.id, { coins: user.coins - amount });
    setUser(updated);
    await api.createTransaction({ userId: user.id, type: "spend", amount, date: new Date().toISOString() });
    return updated;
  };

  const redeemMedal = async (medalId) => {
    const medal = await api.getMedal(medalId);
    if (!medal) throw new Error("Medalla no existe");
    await spendCoins(medal.costCoins);
    const newMedals = [...(user.medals || []), medal.id];
    const updated = await api.updateUser(user.id, { medals: newMedals });
    setUser(updated);
    return updated;
  };

  const markLevelCompleted = async (levelId, coinReward) => {
    if (!user) throw new Error("No user");
    const existing = await api.getProgress(user.id);
    const p = (existing || []).find(x => x.levelId === Number(levelId));
    if (p && p.completed) return { already: true };
    if (p) {
      await api.updateProgress(p.id, { completed: true });
    } else {
      await api.createProgress({ userId: user.id, levelId: Number(levelId), completed: true });
    }
    const updatedUser = await earnCoins(coinReward);
    return { already: false, user: updatedUser };
  };

  return (
    <GameContext.Provider value={{
      user,
      loadingAuth,
      dataLoaded,
      login,
      register,
      logout,
      arenas,
      levels,
      medals,
      earnCoins,
      redeemMedal,
      markLevelCompleted
    }}>
      {children}
    </GameContext.Provider>
  );
}
