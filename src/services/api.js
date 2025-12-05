import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000
});

export const findUserByEmail = (email) =>
  API.get(`/users?email=${encodeURIComponent(email)}`).then(r => r.data);

export const getUser = (id) =>
  API.get(`/users/${id}`).then(r => r.data);

export const createUser = (user) =>
  API.post(`/users`, user).then(r => r.data);

export const updateUser = (id, payload) =>
  API.patch(`/users/${id}`, payload).then(r => r.data);

export const getArenas = () =>
  API.get("/arenas").then(r => r.data);

export const getLevels = () =>
  API.get("/levels").then(r => r.data);

export const getLevel = (id) =>
  API.get(`/levels/${id}`).then(r => r.data);

export const getProgress = (userId) =>
  API.get(`/progress?userId=${userId}`).then(r => r.data);

export const createProgress = (progress) =>
  API.post("/progress", progress).then(r => r.data);

export const updateProgress = (id, payload) =>
  API.patch(`/progress/${id}`, payload).then(r => r.data);

export const createTransaction = (tx) =>
  API.post("/transactions", tx).then(r => r.data);

export const getMedals = () =>
  API.get("/medals").then(r => r.data);

export const getMedal = (id) =>
  API.get(`/medals/${id}`).then(r => r.data);
