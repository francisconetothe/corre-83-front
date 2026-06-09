"use client";

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Calendar, MapPin, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';


export default function CalendarioCompleto() {
  const [provas, setProvas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProvas() {
      try {
        const response = await api.get('/provas');
        
        // Ordenação: Datas mais próximas primeiro
        const ordenadas = response.data.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setProvas(ordenadas);
      } catch (error) {
        console.error("Erro ao carregar calendário");
      } finally {
        setLoading(false);
      }
    }
    loadProvas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="text-brand-blue animate-spin" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-light/30">
      <Navbar />

      {/* HEADER */}
      <header className="pt-32 pb-20 bg-brand-navy px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase italic text-xs tracking-widest mb-6 hover:opacity-70 transition-all">
            <ArrowLeft size={16} /> Voltar ao início
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">
            Calendário <span className="text-brand-blue not-italic">2026</span>
          </h1>
          <p className="text-white/50 font-medium mt-4 uppercase tracking-[0.2em] text-sm">
            As melhores provas de Patos e Região
          </p>
        </div>
      </header>

      {/* LISTAGEM */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 gap-6">
          {provas.length > 0 ? (
            provas.map((prova) => (
              <div 
                key={prova.id} 
                className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-center gap-8 group"
              >
                {/* IMAGEM DA PROVA */}
                <div className="relative w-full md:w-64 h-48 rounded-[2rem] overflow-hidden shrink-0 bg-brand-light">
                  {prova.imageUrl ? (
                    <Image 
                      src={prova.imageUrl} 
                      alt={prova.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      unoptimized={prova.imageUrl.includes('localhost')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <Calendar size={48} className="text-brand-navy" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-brand-blue text-white px-4 py-1 rounded-full text-[10px] font-black uppercase italic shadow-lg">
                    {prova.category}
                  </div>
                </div>

                {/* INFO DATA */}
                <div className="text-center md:text-left min-w-[100px]">
                  <span className="block text-5xl font-black text-brand-navy italic leading-none tracking-tighter">
                    {new Date(prova.date).getUTCDate()}
                  </span>
                  <span className="block text-brand-blue font-black uppercase italic tracking-widest text-sm mt-1">
                    {new Date(prova.date).toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' })}
                  </span>
                </div>

                {/* INFO NOME/LOCAL */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-brand-navy italic uppercase leading-tight group-hover:text-brand-blue transition-colors">
                    {prova.name}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mt-2 font-bold uppercase text-xs tracking-widest">
                    <MapPin size={16} className="text-brand-blue" /> {prova.city}
                  </div>
                </div>

                {/* BOTÃO AÇÃO */}
                <div className="w-full md:w-auto">
                  {prova.link ? (
                    <a 
                      href={prova.link} 
                      target="_blank" 
                      className="inline-flex items-center justify-between md:justify-center gap-4 w-full bg-brand-navy text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm tracking-tighter hover:bg-brand-blue transition-all shadow-lg group/btn"
                    >
                      Inscrever-se
                      <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <div className="bg-zinc-100 text-zinc-400 px-10 py-5 rounded-2xl font-black uppercase italic text-sm text-center">
                      Em breve
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 font-black uppercase italic">Nenhuma prova cadastrada para este ano.</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white text-center border-t border-zinc-100">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 Correria 83 - Calendário Oficial de Provas
        </p>
      </footer>
    </main>
  );
}