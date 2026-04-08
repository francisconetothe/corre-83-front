import axios from 'axios';

const api = axios.create({
  // Usa a variável da Vercel em produção ou localhost no PC
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Se você tiver o interceptor do Token (que enviamos antes), coloque-o aqui:
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@Correria83:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api; // IMPORTANTE: Exportar como default