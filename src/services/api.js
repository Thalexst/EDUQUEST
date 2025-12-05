import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000
});

// --- 1. TIENDA (SOLO COSAS PAGAS) ---
// Aquí NO deben estar las medallas de logros
const SHOP_ITEMS = [
  // Temas
  { id: "theme_dracula", type: "theme", name: "Drácula", cost: 150, description: "Oscuro y elegante.", value: "dracula", icon: "🧛" },
  { id: "theme_matrix", type: "theme", name: "Matrix", cost: 300, description: "Código verde.", value: "matrix", icon: "💻" },
  { id: "theme_synth", type: "theme", name: "Synthwave", cost: 250, description: "Neón retro.", value: "synthwave", icon: "🌆" },
  { id: "theme_hacker", type: "theme", name: "Hacker", cost: 200, description: "Terminal antigua.", value: "hacker", icon: "📟" },
  // Marcos
  { id: "frame_gold", type: "frame", name: "Marco Oro", cost: 500, description: "Lujo puro.", value: "gold", icon: "👑" },
  { id: "frame_fire", type: "frame", name: "Marco Fuego", cost: 400, description: "Estás en racha.", value: "fire", icon: "🔥" },
  { id: "frame_neon", type: "frame", name: "Marco Neón", cost: 350, description: "Futurista.", value: "neon", icon: "🤖" },
  { id: "frame_magic", type: "frame", name: "Marco Mágico", cost: 450, description: "Místico.", value: "magic", icon: "✨" },
  // Power Ups
  { id: "power_streak", type: "powerup", name: "Escudo Racha", cost: 200, description: "Protege tu racha.", value: "shield", icon: "🛡️" },
  { id: "power_doublexp", type: "powerup", name: "Doble XP", cost: 150, description: "XP x2 (1h).", value: "2x", icon: "⚡" }
];

// --- 2. LOGROS (AUTOMÁTICOS) ---
// Estos aparecerán en el perfil, no en la tienda
const MEDALS = [
  { id: "medal_hello", name: "Hola Mundo", description: "Completa el Nivel 1.", icon: "🚀" },
  { id: "medal_streak_3", name: "En Llamas", description: "Logra una racha de 3 días.", icon: "🔥" },
  { id: "medal_rich", name: "Magnate", description: "Acumula 500 monedas.", icon: "💎" },
  { id: "medal_shopper", name: "Fashionista", description: "Compra tu primer objeto.", icon: "🛍️" },
  { id: "medal_brain", name: "Cerebro Galáctico", description: "Alcanza 1000 XP.", icon: "🧠" }
];

// --- FUNCIONES ---
export const findUserByEmail = (email) => API.get(`/users?email=${encodeURIComponent(email)}`).then(r => r.data);
export const getUsers = () => API.get("/users").then(r => r.data);
export const getUser = (id) => API.get(`/users/${id}`).then(r => r.data);
export const createUser = (user) => API.post(`/users`, user).then(r => r.data);
export const updateUser = (id, payload) => API.patch(`/users/${id}`, payload).then(r => r.data);
export const getArenas = () => API.get("/arenas").then(r => r.data);
export const getLevels = () => API.get("/levels").then(r => r.data);
export const getLevel = (id) => API.get(`/levels/${id}`).then(r => r.data);
export const getProgress = (userId) => API.get(`/progress?userId=${userId}`).then(r => r.data);
export const createProgress = (progress) => API.post("/progress", progress).then(r => r.data);
export const updateProgress = (id, payload) => API.patch(`/progress/${id}`, payload).then(r => r.data);
export const createTransaction = (tx) => API.post("/transactions", tx).then(r => r.data);

// Simular carga de datos constantes
export const getShopItems = async () => new Promise(r => setTimeout(() => r(SHOP_ITEMS), 100));
export const getMedals = async () => new Promise(r => setTimeout(() => r(MEDALS), 100));
export const getMedal = (id) => API.get(`/medals/${id}`).then(r => r.data);