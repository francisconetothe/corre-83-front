"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { ArrowLeft, Clock, User, Loader2 } from 'lucide-react';

export default function ArtigoCompleto() {
  const { id } = useParams();
  const router = useRouter();
  const [artigo, setArtigo] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Nome correto aqui

  useEffect(() => {
    async function loadArtigo() {
      try {
        const response = await api.get(`/artigos`);
        // Filtra o artigo específico pelo ID que veio na URL
        const encontrado = response.data.find((a: any) => a.id === id);
        setArtigo(encontrado);
      } catch (error) {
        console.error("Erro ao carregar artigo");
      } finally {
        setLoading(false); // Corrigido aqui: de setLoadingLoader para setLoading
      }
    }
    loadArtigo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-navy">
        <Loader2 className="text-brand-blue animate-spin" size={40} />
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light p-6 text-center">
        <h2 className="text-2xl font-black text-brand-navy uppercase italic">Artigo não encontrado</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-brand-blue font-bold uppercase italic underline">Voltar para o início</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* HEADER DO ARTIGO */}
      <header className="pt-32 pb-16 bg-brand-navy text-center px-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="text-brand-blue font-bold flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity uppercase italic text-xs tracking-widest"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          
          <span className="text-brand-blue font-black uppercase italic tracking-widest text-sm">
             {new Date(artigo.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mt-4 leading-tight tracking-tighter">
            {artigo.title}
          </h1>

          <div className="flex items-center justify-center gap-6 mt-8 text-white/60 font-bold uppercase text-[10px] tracking-widest italic">
            <span className="flex items-center gap-2">
              <User size={14} className="text-brand-blue"/> 
              {artigo.columnist?.name || artigo.columnistName}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-brand-blue"/> 
              Leitura rápida
            </span>
          </div>
        </div>
      </header>

      {/* IMAGEM DE CAPA */}
      <section className="max-w-5xl mx-auto -mt-10 px-6">
        <div className="relative h-[300px] md:h-[550px] w-full rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-100 border-4 border-white">
          {artigo.imageUrl ? (
            <Image 
              src={artigo.imageUrl} 
              alt={artigo.title} 
              fill 
              className="object-cover" 
              priority
              unoptimized={artigo.imageUrl.includes('localhost')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-200 font-black italic text-9xl">C83</div>
          )}
        </div>
      </section>

      {/* CONTEÚDO DO ARTIGO */}
      <article className="max-w-3xl mx-auto py-20 px-6">
        <div 
          className="prose prose-lg max-w-none text-zinc-600 font-medium leading-relaxed 
          prose-headings:text-brand-navy prose-headings:font-black prose-headings:italic prose-headings:uppercase
          prose-strong:text-brand-navy prose-strong:font-black
          prose-p:mb-6
          prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: artigo.content }}
        />
      </article>

      {/* FOOTER DO ARTIGO */}
      <footer className="bg-brand-light/30 py-20 border-t border-zinc-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-brand-blue rounded-2xl mx-auto flex items-center justify-center font-black italic text-white text-2xl mb-6 shadow-lg rotate-3">83</div>
          <h3 className="text-2xl font-black text-brand-navy italic uppercase">Correria 83 Crew</h3>
          <p className="text-zinc-500 mt-2 font-medium">Compartilhe esse conhecimento com outros atletas!</p>
        </div>
      </footer>
    </main>
  );
}