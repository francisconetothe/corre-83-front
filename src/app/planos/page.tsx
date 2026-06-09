"use client";

import { useEffect, useState } from 'react';
import { Check, Trophy, Zap, Star, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';

export default function PlanosPage() {
  const router = useRouter();
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlanos() {
      try {
        const response = await api.get('/plans');
        setPlanos(response.data);
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlanos();
  }, []);

  // Função para definir o ícone baseado no nome ou ordem (opcional)
  const getIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('bronze') || n.includes('start')) return <Zap className="text-orange-500" size={32} />;
    if (n.includes('ouro') || n.includes('black')) return <Star className="text-yellow-500" size={32} />;
    return <Trophy className="text-slate-400" size={32} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="text-brand-blue animate-spin" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-4 pt-32"> 
        
        {/* Botão Voltar */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-brand-navy font-bold hover:text-brand-blue transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-brand-light group-hover:bg-brand-blue group-hover:text-white transition-all">
            <ArrowLeft size={20} />
          </div>
          VOLTAR
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy mb-4 italic tracking-tighter uppercase">
            NOSSOS <span className="text-brand-blue not-italic">PLANOS</span>
          </h1>
          <div className="h-1 w-20 bg-brand-blue mx-auto mb-6"></div>
          <p className="text-zinc-500 max-w-xl mx-auto font-medium text-lg">
            Escolha o plano que mais combina com seu ritmo e venha correr com a gente.
          </p>
        </div>

        {/* Grid de Planos Dinâmico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pb-20">
          {planos.map((plano) => (
            <div 
              key={plano.id}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-500 flex flex-col ${
                plano.isFeatured 
                ? 'border-4 border-brand-blue shadow-2xl scale-105 z-10 py-12' 
                : 'border border-zinc-100 shadow-lg hover:shadow-xl'
              }`}
            >
              {plano.isFeatured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  MAIS PROCURADO
                </div>
              )}

              <div className="bg-brand-light w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {getIcon(plano.name)}
              </div>
              
              <h2 className="text-3xl font-black text-brand-navy mb-1 italic tracking-tight uppercase">
                {plano.name}
              </h2>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-brand-navy uppercase">R${plano.price}</span>
                <span className="text-zinc-400 font-bold italic">/mês</span>
              </div>

              {/* Descrição do Plano */}
              <p className="text-zinc-500 text-sm mb-6 font-medium">
                {plano.description}
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {/* Aqui convertemos a string "beneficio1|beneficio2" em um array */}
                {plano.benefits?.split('|').map((beneficio: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 text-sm font-bold text-brand-navy uppercase tracking-tight">
                    <Check size={18} className="text-brand-blue" strokeWidth={3} />
                    {beneficio}
                  </li>
                ))}
              </ul>

              <Link 
                href={`https://wa.me/5583999999999?text=Olá! Tenho interesse no plano ${plano.name}`}
                className={`block text-center py-4 rounded-2xl font-black uppercase tracking-tighter transition-all ${
                  plano.isFeatured 
                  ? 'bg-brand-navy text-white hover:bg-brand-blue' 
                  : 'bg-brand-blue text-white hover:opacity-90'
                }`}
              >
                QUERO ESSE PLANO
              </Link>
            </div>
          ))}
        </div>

        {planos.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-zinc-400 font-bold italic uppercase">Nenhum plano disponível no momento.</p>
          </div>
        )}
      </div>
    </main>
  );
}