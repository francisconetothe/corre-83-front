"use client";

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';

export default function ListagemArtigos() {
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtigos() {
      try {
        const response = await api.get('/artigos');
        // Ordena pelos mais recentes
        const ordenados = response.data.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setArtigos(ordenados);
      } catch (error) {
        console.error("Erro ao carregar artigos");
      } finally {
        setLoading(false);
      }
    }
    loadArtigos();
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
            Dicas do <span className="text-brand-blue not-italic">Colunista</span>
          </h1>
          <p className="text-white/50 font-medium mt-4 uppercase tracking-[0.2em] text-sm">
            Conteúdo técnico e bastidores da Correria 83
          </p>
        </div>
      </header>

      {/* GRID DE ARTIGOS */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {artigos.map((artigo) => (
            <Link 
              href={`/artigo/${artigo.id}`} 
              key={artigo.id} 
              className="bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col"
            >
              <div className="relative h-64 w-full overflow-hidden bg-brand-navy">
                {artigo.imageUrl ? (
                  <Image 
                    src={artigo.imageUrl} 
                    alt={artigo.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    unoptimized={artigo.imageUrl.includes('localhost')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <span className="text-white font-black italic text-6xl">C83</span>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-brand-blue mb-4 text-[10px] font-black uppercase italic tracking-widest">
                  <Clock size={14} /> {new Date(artigo.createdAt).toLocaleDateString('pt-BR')}
                </div>

                <h3 className="text-2xl font-black text-brand-navy leading-tight group-hover:text-brand-blue transition-colors uppercase italic mb-4">
                  {artigo.title}
                </h3>

                <div 
                  className="text-zinc-500 text-sm line-clamp-3 mb-6 font-medium"
                  dangerouslySetInnerHTML={{ __html: artigo.content }}
                />

                <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    Por: {artigo.columnistName}
                  </span>
                  <div className="text-brand-blue font-black uppercase italic text-[10px] flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    Ler tudo <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-12 bg-white text-center border-t border-zinc-100">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 Correria 83 - Blog & Colunista
        </p>
      </footer>
    </main>
  );
}