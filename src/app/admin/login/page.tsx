"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Envia os dados para o seu NestJS
      const response = await api.post('/auth/login', { email, password });

      // 2. Salva o token. 
      // IMPORTANTE: Verifique se o seu NestJS retorna 'token' ou 'access_token'
      const token = response.data.token || response.data.access_token;

      if (token) {
        localStorage.setItem('@Correria83:token', token);
        
        // 3. Sucesso! Manda o admin para o Dashboard
        router.push('/admin/dashboard');
      } else {
        throw new Error('Token não recebido do servidor.');
      }
      
    } catch (err: any) {
      // Trata erros de credenciais ou servidor offline
      const message = err.response?.data?.message || 'Erro ao conectar com o servidor. Verifique se o NestJS está rodando.';
      setError(Array.isArray(message) ? message[0] : message); // NestJS às vezes envia array de erros
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-light flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* LOGO ADMIN */}
        <div className="text-center mb-10">
          <div className="inline-block bg-brand-navy p-4 rounded-3xl shadow-xl mb-4">
            <span className="text-white font-black italic text-2xl tracking-tighter">C83</span>
          </div>
          <h1 className="text-3xl font-black text-brand-navy italic uppercase tracking-tighter">
            Painel <span className="text-brand-blue not-italic">Admin</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm mt-2 uppercase tracking-widest">
            Acesso Restrito - Correria 83
          </p>
        </div>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* CARD DE LOGIN */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* CAMPO EMAIL */}
            <div>
              <label className="block text-brand-navy font-bold text-xs uppercase tracking-widest mb-2 ml-1">
                E-mail do Administrador
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@correria83.com.br"
                  className="w-full bg-brand-light border-none p-4 pl-12 rounded-2xl text-brand-navy font-medium focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                />
              </div>
            </div>

            {/* CAMPO SENHA */}
            <div>
              <label className="block text-brand-navy font-bold text-xs uppercase tracking-widest mb-2 ml-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-light border-none p-4 pl-12 rounded-2xl text-brand-navy font-medium focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                />
              </div>
            </div>

            {/* BOTÃO DE ENTRAR */}
            <button 
              disabled={loading}
              className="w-full bg-brand-navy text-white p-5 rounded-2xl font-black uppercase italic tracking-tighter text-lg hover:bg-brand-blue transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* VOLTAR PRO SITE */}
        <div className="text-center mt-8">
          <a href="/" className="text-zinc-400 font-bold text-xs uppercase hover:text-brand-navy transition-colors tracking-widest">
            ← Voltar para o site público
          </a>
        </div>
      </div>
    </main>
  );
}