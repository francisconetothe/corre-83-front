"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { ArrowLeft, Clock, UserCircle, Loader2 } from "lucide-react";

export default function ColunistaPage({ params }: { params: { id: string } }) {
  const [colunista, setColunista] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadColunista() {
      try {
        const response = await api.get(`/colunistas/${params.id}`);
        setColunista(response.data);
      } catch (error) {
        console.error("Erro ao carregar colunista.");
      } finally {
        setLoading(false);
      }
    }
    loadColunista();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <Loader2 className="text-brand-blue animate-spin" size={40} />
      </div>
    );
  }

  if (!colunista) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-black text-brand-navy italic uppercase">
          Colunista não encontrado
        </h1>
        <Link href="/" className="text-brand-blue font-bold hover:underline">
          Voltar para a Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-light pb-20">
      <Navbar />

      {/* HEADER DO PERFIL */}
      <section className="bg-brand-navy pt-32 pb-20 px-6 rounded-b-[4rem] shadow-2xl relative">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-brand-blue transition-colors font-bold uppercase text-xs tracking-widest mb-10"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 text-center md:text-left">
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-brand-blue shadow-2xl shrink-0 bg-white/10 flex items-center justify-center">
              {colunista.photoUrl ? (
                <Image
                  src={
                    colunista.photoUrl?.startsWith("http")
                      ? colunista.photoUrl
                      : `http://localhost:3001${colunista.photoUrl}`
                  }
                  alt={colunista.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <UserCircle size={80} className="text-white/20" />
              )}
            </div>

            <div className="pt-4">
              <span className="text-brand-blue font-black uppercase tracking-widest text-sm italic">
                Especialista Oficial C83
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic mt-2 leading-none mb-6">
                {colunista.name}
              </h1>
              <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                {colunista.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTIGOS DESTE COLUNISTA */}
      <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black text-brand-navy uppercase italic">
            Artigos Publicados{" "}
            <span className="text-brand-blue">
              ({colunista.articles?.length || 0})
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {colunista.articles && colunista.articles.length > 0 ? (
            colunista.articles.map((artigo: any) => (
              <Link
                href={`/artigo/${artigo.id}`}
                key={artigo.id}
                className="bg-white border border-zinc-100 p-6 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col"
              >
                <div className="relative w-full h-48 rounded-3xl overflow-hidden mb-6 bg-brand-light">
                  {artigo.imageUrl ? (
                    <Image
                      src={
                        artigo.imageUrl?.startsWith("http")
                          ? artigo.imageUrl
                          : `http://localhost:3001${artigo.imageUrl}`
                      }
                      alt={artigo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <span className="text-brand-navy font-black italic text-3xl">
                        C83
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-brand-blue mb-3 text-[10px] font-black uppercase italic">
                  <Clock size={12} />
                  {new Date(artigo.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <h3 className="text-lg font-black text-brand-navy mb-4 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2 uppercase italic">
                  {artigo.title}
                </h3>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 font-bold italic uppercase text-sm">
                Nenhum artigo publicado ainda.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
