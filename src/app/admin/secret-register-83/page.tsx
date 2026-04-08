"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { UserPlus, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

export default function SecretRegister() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setDone(true);
    } catch (err) {
      alert("Erro ao cadastrar. Verifique se o e-mail já existe.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6">
      <div className="text-center text-white">
        <CheckCircle size={80} className="text-brand-blue mx-auto mb-6" />
        <h1 className="text-3xl font-black italic uppercase">Admin Criado!</h1>
        <button onClick={() => window.location.href='/admin/login'} className="mt-6 bg-brand-blue px-8 py-3 rounded-xl font-bold uppercase italic text-sm">Ir para Login</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl">
        <h1 className="text-2xl font-black text-brand-navy italic uppercase mb-8 flex items-center gap-3">
          <UserPlus className="text-brand-blue" /> Novo Admin
        </h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <input 
            placeholder="Nome Completo" 
            className="w-full bg-brand-light p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue font-medium"
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full bg-brand-light p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue font-medium"
            onChange={e => setForm({...form, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Senha Secreta" 
            className="w-full bg-brand-light p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue font-medium"
            onChange={e => setForm({...form, password: e.target.value})}
            required
          />
          <button disabled={loading} className="w-full bg-brand-blue text-white p-5 rounded-2xl font-black uppercase italic tracking-tighter text-lg hover:bg-brand-navy transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
          </button>
        </form>
      </div>
    </main>
  );
}