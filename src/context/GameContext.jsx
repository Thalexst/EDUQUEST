import { createContext, useState, useEffect } from "react";
import * as api from "../services/api";
import toast from "react-hot-toast"; // Importante para notificar logros

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [arenas, setArenas] = useState([]);
  const [levels, setLevels] = useState([]);
  const [medals, setMedals] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => setSoundEnabled(prev => !prev);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, l, m, s] = await Promise.all([
            api.getArenas(), 
            api.getLevels(), 
            api.getMedals(),
            api.getShopItems() 
        ]);
        
        setArenas(a || []);
        const sortedLevels = (l || []).sort((a, b) => Number(a.id) - Number(b.id));
        setLevels(sortedLevels);
        setMedals(m || []); // Cargamos la lista de logros posibles
        setShopItems(s || []);
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
            api.getProgress(u.id).then(p => setUserProgress(p || []));
          } else {
            localStorage.removeItem("userId");
          }
        })
        .catch(() => localStorage.removeItem("userId"));
    }
  }, []);

  // --- FUNCIÓN INTELIGENTE: VERIFICAR LOGROS ---
  const checkAchievements = async (currentUser, currentProgress = userProgress) => {
    if (!currentUser) return;

    // Lista actual de medallas del usuario
    const myMedals = currentUser.medals || [];
    const newMedals = [];

    // LOGRO 1: "Hola Mundo" (Completar nivel 1)
    if (!myMedals.includes("medal_hello")) {
        const hasCompletedLvl1 = currentProgress.some(p => p.levelId === 1 && p.completed);
        if (hasCompletedLvl1) newMedals.push("medal_hello");
    }

    // LOGRO 2: "En Llamas" (Racha >= 3)
    if (!myMedals.includes("medal_streak_3")) {
        if ((currentUser.streak || 0) >= 3) newMedals.push("medal_streak_3");
    }

    // LOGRO 3: "Magnate" (Monedas >= 500)
    if (!myMedals.includes("medal_rich")) {
        if ((currentUser.coins || 0) >= 500) newMedals.push("medal_rich");
    }

    // LOGRO 4: "Cerebro Galáctico" (XP >= 1000)
    if (!myMedals.includes("medal_brain")) {
        if ((currentUser.xp || 0) >= 1000) newMedals.push("medal_brain");
    }

    // LOGRO 5: "Fashionista" (Tener algo en inventario)
    if (!myMedals.includes("medal_shopper")) {
        if ((currentUser.inventory || []).length > 0) newMedals.push("medal_shopper");
    }

    // Si encontramos logros nuevos, actualizamos y notificamos
    if (newMedals.length > 0) {
        const updatedList = [...myMedals, ...newMedals];
        
        // Guardamos en base de datos
        const updatedUser = await api.updateUser(currentUser.id, { medals: updatedList });
        setUser(updatedUser);

        // Mostramos notificaciones épicas
        newMedals.forEach(medalId => {
            const medalInfo = medals.find(m => m.id === medalId);
            if (medalInfo) {
                toast(`¡LOGRO DESBLOQUEADO!\n${medalInfo.icon} ${medalInfo.name}`, {
                    duration: 5000,
                    style: {
                        background: '#333',
                        color: '#fbbf24',
                        border: '1px solid #fbbf24',
                        fontWeight: 'bold'
                    },
                    icon: '🏆'
                });
            }
        });
    }
  };

  const register = async ({ name, email, password }) => {
    const found = await api.findUserByEmail(email);
    if (found.length > 0) throw new Error("Email ya registrado");
    
    const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`;
    
    const newUser = await api.createUser({ 
        name, email, password, coins: 0, medals: [], avatar: defaultAvatar,
        inventory: [], activeTheme: 'default', xp: 0
    });

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
          newStreak = 1; 
        }

        const updated = await api.updateUser(userFound.id, {
          lastLogin: today,
          streak: newStreak
        });
        userFound.streak = newStreak;
        userFound.lastLogin = today;
        
        // Verificar logros al login (ej: Racha)
        checkAchievements(updated); 
      } else {
        checkAchievements(userFound);
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
    // Verificamos si alcanzó meta de monedas
    checkAchievements(updated); 
    return updated;
  };

  // Helper para ganar XP
  const earnXP = async (amount) => {
      if (!user) return;
      const updated = await api.updateUser(user.id, { xp: (user.xp || 0) + amount });
      setUser(updated);
      checkAchievements(updated);
      return updated;
  };

  const spendCoins = async (amount) => {
    if (!user) throw new Error("No hay usuario");
    if ((user.coins || 0) < amount) throw new Error("No tienes suficientes monedas");
    const updated = await api.updateUser(user.id, { coins: user.coins - amount });
    setUser(updated);
    return updated;
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
    try {
        const updated = await api.updateUser(user.id, updates);
        setUser(updated);
        return updated;
    } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
    }
  };

  const buyItem = async (itemId) => {
    if (!user) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item) throw new Error("Item no existe");

    const inventory = user.inventory || [];
    if (inventory.includes(itemId)) {
        throw new Error("Ya tienes este artículo");
    }

    if ((user.coins || 0) < item.cost) {
        throw new Error("No tienes suficientes monedas");
    }

    await spendCoins(item.cost);

    const newInventory = [...inventory, itemId];
    const updatedUser = await api.updateUser(user.id, { inventory: newInventory });
    setUser(updatedUser);
    
    // Verificar logro de compra
    checkAchievements(updatedUser);

    return updatedUser;
  };

  const equipItem = async (type, value) => {
      if (!user) return;
      const updates = {};
      updates[type] = value;
      const updated = await api.updateUser(user.id, updates);
      setUser(updated);
  };

  const redeemMedal = async (medalId) => {
    // Función obsoleta (ya que ahora es automático), 
    // pero la dejamos vacía o con un mensaje para no romper código antiguo.
    console.log("Los logros ahora son automáticos");
  };

  const markLevelCompleted = async (levelId, coinReward) => {
    if (!user) throw new Error("No user");
    const lId = Number(levelId);
    
    const existing = userProgress.find(x => x.levelId === lId);
    if (existing && existing.completed) return { already: true };

    // Buscamos cuánto XP da el nivel (si no tiene, damos 10 por defecto)
    const levelInfo = levels.find(l => Number(l.id) === lId);
    const xpReward = levelInfo ? (levelInfo.xp || 10) : 10;

    if (existing) {
      await api.updateProgress(existing.id, { completed: true });
    } else {
      await api.createProgress({ userId: user.id, levelId: lId, completed: true });
    }

    const newProg = await api.getProgress(user.id);
    setUserProgress(newProg);
    
    // Damos monedas y XP
    await earnCoins(coinReward);
    const updatedUser = await earnXP(xpReward);

    // Verificar logros de nivel y XP
    checkAchievements(updatedUser, newProg);

    return { already: false, user: updatedUser };
  };

  const isLevelCompleted = (levelId) => {
    return userProgress.some(p => p.levelId === Number(levelId) && p.completed);
  };

  const isLevelUnlocked = (levelId) => {
    const currentId = Number(levelId);
    const currentLevel = levels.find(l => Number(l.id) === currentId);
    if (!levels.length || !currentLevel) return false;

    const arenaLevels = levels
      .filter(l => Number(l.arenaId) === Number(currentLevel.arenaId))
      .sort((a, b) => Number(a.id) - Number(b.id));

    const index = arenaLevels.findIndex(l => Number(l.id) === currentId);
    if (index <= 0) return true;
    const prevLevel = arenaLevels[index - 1];
    return isLevelCompleted(prevLevel.id);
  };

  const getArenaProgress = (arenaId) => {
    const arenaLevels = levels.filter(l => Number(l.arenaId) === Number(arenaId));
    if (arenaLevels.length === 0) return 0;
    const completedCount = arenaLevels.filter(l => isLevelCompleted(l.id)).length;
    return Math.round((completedCount / arenaLevels.length) * 100);
  };

  return (
    <GameContext.Provider value={{
      user, loadingAuth, dataLoaded, login, register, logout,
      arenas, levels, medals, earnCoins, redeemMedal, markLevelCompleted, 
      updateUserProfile, userProgress, isLevelCompleted, isLevelUnlocked, getArenaProgress,
      soundEnabled, toggleSound,
      shopItems, buyItem, equipItem
    }}>
      {children}
    </GameContext.Provider>
  );
}