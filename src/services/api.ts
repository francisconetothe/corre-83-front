import axios from 'axios';

const api = axios.create({
  // Se houver uma variável de ambiente definida na Vercel, usa ela.
  // Caso contrário (em desenvolvimento local), usa o localhost.
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', 
});

// Interceptor: Anexa o token em todas as requisições futuras
api.interceptors.request.use((config) => {
  // Verificação de segurança para o Next.js (evita erro no lado do servidor)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@Correria83:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;