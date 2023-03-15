import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_KEY_DEV + import.meta.env.VITE_API_PORT
      : import.meta.env.VITE_API_KEY,
});

export default api;
