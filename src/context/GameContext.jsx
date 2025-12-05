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
  const [userProgress, setUserProgress] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => setSoundEnabled(prev => !prev);

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
        .then(u => {
          if (u && u.id) {
            setUser(u);
            // Load progress
            api.getProgress(u.id).then(p => setUserProgress(p || []));
          } else {
            localStorage.removeItem("userId");
          }
        })
        .catch(() => localStorage.removeItem("userId"));
    }
  }, []);

  const register = async ({ name, email, password }) => {
    const found = await api.findUserByEmail(email);
    if (found.length > 0) throw new Error("Email ya registrado");
    const newUser = await api.createUser({ name, email, password, coins: 0, medals: [] });
    localStorage.setItem("userId", newUser.id);
    setUser(newUser);
    setUserProgress([]);
    return newUser;
  };

  const login = async ({ email, password }) => {
    setLoadingAuth(true);
    try {
      const found = await api.findUserByEmail(email);
      const userFound = found.find(u => u.password === password);
      if (!userFound) throw new Error("Credenciales inválidas");

      // Streak Logic
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = userFound.lastLogin;

      let newStreak = userFound.streak || 0;

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastLogin === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset if missed a day
        }

        // Update user
        const updated = await api.updateUser(userFound.id, {
          lastLogin: today,
          streak: newStreak
        });
        userFound.streak = newStreak;
        userFound.lastLogin = today;
      }

      localStorage.setItem("userId", userFound.id);
      setUser(userFound);
      const p = await api.getProgress(userFound.id);
      setUserProgress(p || []);
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
    setUserProgress([]);
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
    const existing = userProgress.find(x => x.levelId === Number(levelId));

    if (existing && existing.completed) return { already: true };

    if (existing) {
      await api.updateProgress(existing.id, { completed: true });
    } else {
      await api.createProgress({ userId: user.id, levelId: Number(levelId), completed: true });
    }

    // Update local state immediately
    const newProg = await api.getProgress(user.id);
    setUserProgress(newProg);

    const updatedUser = await earnCoins(coinReward);
    return { already: false, user: updatedUser };
  };

  // --- Helpers for UI ---
  const isLevelCompleted = (levelId) => {
    return userProgress.some(p => p.levelId === Number(levelId) && p.completed);
  };

  const isLevelUnlocked = (levelId) => {
    // If it's the first level (ID 1), it's always unlocked
    if (Number(levelId) === 1) return true;

    // Check if previous level is completed
    // Assuming level IDs are sequential 1, 2, 3...
    // If your IDs are not sequential, you need a 'prevLevelId' field in your DB
    const prevId = Number(levelId) - 1;
    return isLevelCompleted(prevId);
  };

  const getArenaProgress = (arenaId) => {
    const arenaLevels = levels.filter(l => Number(l.arenaId) === Number(arenaId));
    if (arenaLevels.length === 0) return 0;

    const completedCount = arenaLevels.filter(l => isLevelCompleted(l.id)).length;
    return Math.round((completedCount / arenaLevels.length) * 100);
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
      markLevelCompleted,
      userProgress,
      isLevelCompleted,
      isLevelUnlocked,
      isLevelUnlocked,
      getArenaProgress,
      soundEnabled,
      toggleSound
    }}>
      {children}
    </GameContext.Provider>
  );
}
