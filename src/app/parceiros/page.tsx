"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowLeft, Loader2, Handshake, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Parceiros() {
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParceiros() {
      try {
        // 🛠️ Certifique-se de ter essa rota criada na sua API do NestJS!
        const response = await api.get("/parceiros");
        setParceiros(response.data);
      } catch (error) {
        console.error("Erro ao carregar parceiros");
        // Fallback temporário para você ver o layout enquanto a API não tem a rota
        setParceiros([
          {
            id: "1",
            name: "Loja do Corredor",
            category: "Equipamentos",
            description:
              "A melhor loja de tênis e acessórios para corrida da Paraíba.",
            imageUrl: "",
            link: "https://instagram.com",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadParceiros();
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase italic text-xs tracking-widest mb-6 hover:opacity-70 transition-all"
          >
            <ArrowLeft size={16} /> Voltar ao início
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-4">
            <Handshake size={56} className="text-brand-blue hidden md:block" />
            Nossos <span className="text-brand-blue not-italic">Parceiros</span>
          </h1>
          <p className="text-white/50 font-medium mt-4 uppercase tracking-[0.2em] text-sm">
            Marcas que correm lado a lado com a gente
          </p>
        </div>
      </header>

      {/* GRID DE PARCEIROS */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parceiros.length > 0 ? (
            parceiros.map((parceiro) => (
              <div
                key={parceiro.id}
                className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center group"
              >
                {/* LOGO DO PARCEIRO */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden shrink-0 bg-brand-light mb-6 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
                  {parceiro.imageUrl ? (
                    <Image
                      src={parceiro.imageUrl}
                      alt={parceiro.name}
                      fill
                      className="object-cover"
                      unoptimized={parceiro.imageUrl.includes("localhost")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <Handshake size={48} className="text-brand-navy" />
                    </div>
                  )}
                </div>

                {/* CATEGORIA (TAG) */}
                {parceiro.category && (
                  <span className="bg-brand-blue/10 text-brand-blue px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest mb-4">
                    {parceiro.category}
                  </span>
                )}

                {/* INFO */}
                <h3 className="text-2xl font-black text-brand-navy italic uppercase leading-tight group-hover:text-brand-blue transition-colors mb-3">
                  {parceiro.name}
                </h3>

                {parceiro.description && (
                  <p className="text-zinc-500 text-sm mb-8 line-clamp-3">
                    {parceiro.description}
                  </p>
                )}

                {/* ESPAÇADOR PARA EMPURRAR O BOTÃO PARA BAIXO */}
                <div className="flex-grow"></div>

                {/* BOTÃO AÇÃO */}
                {parceiro.link ? (
                  <a
                    href={parceiro.link}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full bg-brand-navy text-white px-6 py-4 rounded-2xl font-black uppercase italic text-sm tracking-tighter hover:bg-brand-blue transition-all shadow-lg group/btn"
                  >
                    Visitar Parceiro
                    <ExternalLink
                      size={16}
                      className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform"
                    />
                  </a>
                ) : (
                  <div className="w-full bg-zinc-100 text-zinc-400 px-6 py-4 rounded-2xl font-black uppercase italic text-sm text-center">
                    Parceiro Oficial
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-zinc-400 font-black uppercase italic">
                Nenhum parceiro cadastrado no momento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white text-center border-t border-zinc-100">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 Correria 83 - Parceiros Oficiais
        </p>
      </footer>
    </main>
  );
}
