"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Camera,
  Play,
  Handshake,
  UserCircle,
} from "lucide-react";

export default function Home() {
  // Estados para os dados dinâmicos do banco
  const [bannerUrl, setBannerUrl] = useState("");
  const [provas, setProvas] = useState<any[]>([]);
  const [artigos, setArtigos] = useState<any[]>([]);
  const [colunistas, setColunistas] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState({
    content: "",
    aboutImageUrl: "",
  });

  // Busca todas as informações ao carregar a página
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Busca Configurações (Banner, Quem Somos)
        const responseSettings = await api.get("/settings/banner");
        if (responseSettings.data) {
          if (responseSettings.data.imageUrl)
            setBannerUrl(responseSettings.data.imageUrl);
          setAboutData({
            content: responseSettings.data.content || "",
            aboutImageUrl: responseSettings.data.aboutImageUrl || "",
          });
        }

        // 2. Busca Provas do Calendário (3 primeiras para a Home)
        const responseProvas = await api.get("/provas");
        if (responseProvas.data) {
          setProvas(responseProvas.data.slice(0, 3));
        }

        // 3. Busca Artigos do Colunista (3 primeiros para a Home)
        const responseArtigos = await api.get("/artigos");
        if (responseArtigos.data) {
          setArtigos(responseArtigos.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Erro ao carregar dados principais do banco.");
      }

      // 4. Busca Parceiros (5 primeiros para a Home) - Separado para não quebrar o resto se a rota não existir
      try {
        const responseParceiros = await api.get("/parceiros");
        if (responseParceiros.data) {
          setParceiros(responseParceiros.data.slice(0, 5));
        }
      } catch (error) {
        console.error(
          "Erro ao carregar parceiros (rota possivelmente não criada ainda).",
        );
        // Fallback temporário para você visualizar o design na Home
        setParceiros([
          { id: "1", name: "Loja Exemplo", logoUrl: "" },
          { id: "2", name: "Marca 2", logoUrl: "" },
          { id: "3", name: "Apoio 3", logoUrl: "" },
        ]);
      }

      // 5. Busca Colunistas (5 primeiros para a Home)
      try {
        const responseColunistas = await api.get("/colunistas");
        if (responseColunistas.data) {
          setColunistas(responseColunistas.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Erro ao carregar colunistas.");
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 1. BANNER DINÂMICO */}
      <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-brand-navy">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt="Banner Correria 83"
            fill
            priority
            className="object-cover object-center animate-in fade-in duration-700"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <span className="text-white font-black italic text-9xl tracking-tighter">
              C83
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
      </section>

      {/* 2. BOTÕES DE AÇÃO */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6">
          <button className="flex-1 min-w-[280px] max-w-sm bg-brand-blue text-white px-8 py-6 rounded-2xl font-black uppercase tracking-tighter italic text-xl shadow-xl hover:bg-brand-navy transition-all flex items-center justify-between group">
            Nossos Planos
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>

          <Link
            href="/provas"
            className="flex-1 min-w-[280px] max-w-sm bg-brand-navy text-white px-8 py-6 rounded-2xl font-black uppercase tracking-tighter italic text-xl shadow-xl hover:bg-brand-blue transition-all flex items-center justify-between group"
          >
            <span className="flex items-center gap-3">
              <Calendar size={24} />
              Calendário de Provas
            </span>
            <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 3. QUEM SOMOS (DINÂMICO) */}
      <section
        id="quem-somos"
        className="py-20 bg-brand-light/30 border-y border-zinc-100"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-blue font-bold tracking-widest uppercase text-xs italic">
              DNA Esportivo
            </span>
            <h2 className="text-5xl font-black text-brand-navy italic uppercase mt-2">
              Quem Somos
            </h2>
            <div className="w-16 h-2 bg-brand-blue mt-4 mb-8"></div>
            <p className="text-zinc-500 text-lg leading-relaxed font-medium whitespace-pre-line">
              {aboutData.content || (
                <>
                  O{" "}
                  <span className="text-brand-navy font-bold italic underline decoration-brand-blue">
                    CORRERIA 83
                  </span>{" "}
                  é a assessoria que conecta atletas em Patos e Região. Focamos
                  em técnica, performance e comunidade.
                </>
              )}
            </p>
          </div>
          <div className="aspect-video bg-white rounded-3xl flex items-center justify-center border border-zinc-100 shadow-2xl relative overflow-hidden">
            {aboutData.aboutImageUrl ? (
              <Image
                src={aboutData.aboutImageUrl}
                alt="Quem Somos"
                fill
                className="object-cover animate-in fade-in duration-500"
              />
            ) : (
              <>
                <span className="text-brand-navy/5 font-black text-[12rem] italic absolute -right-10 select-none">
                  C83
                </span>
                <p className="text-brand-navy font-black italic z-10 uppercase tracking-widest">
                  Correria 83 Crew
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. PROVAS DO MÊS DINÂMICAS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-brand-blue font-black italic uppercase text-sm tracking-widest">
                Calendário
              </span>
              <h2 className="text-5xl font-black text-brand-navy italic uppercase leading-none mt-1">
                Provas do Mês
              </h2>
            </div>
            <Link
              href="/provas"
              className="hidden md:flex items-center gap-2 text-brand-navy font-bold hover:text-brand-blue transition-colors uppercase text-xs tracking-widest"
            >
              Ver calendário completo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {provas.length > 0 ? (
              provas.map((prova) => (
                <div
                  key={prova.id}
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-brand-light">
                    {prova.imageUrl ? (
                      <Image
                        src={prova.imageUrl}
                        alt={prova.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <span className="text-brand-navy font-black italic text-6xl">
                          C83
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-brand-navy uppercase tracking-tighter shadow-xl">
                      {prova.category}
                    </div>
                    <div className="absolute -bottom-1 left-6 bg-brand-blue text-white p-4 rounded-t-2xl shadow-lg text-center min-w-[70px]">
                      <span className="block text-xl font-black italic leading-none">
                        {new Date(prova.date).getUTCDate()}
                      </span>
                      <span className="block text-[10px] font-bold uppercase tracking-widest mt-1">
                        {new Date(prova.date)
                          .toLocaleString("pt-BR", {
                            month: "short",
                            timeZone: "UTC",
                          })
                          .replace(".", "")}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 pt-10 flex flex-col flex-1">
                    <h3 className="text-2xl font-black text-brand-navy leading-tight group-hover:text-brand-blue transition-colors uppercase italic tracking-tighter">
                      {prova.name}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-400 mt-4 font-semibold text-sm">
                      <MapPin size={18} className="text-brand-blue" />{" "}
                      {prova.city}
                    </div>

                    <div className="mt-auto pt-8">
                      {prova.link ? (
                        <a
                          href={prova.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between w-full bg-brand-navy text-white px-6 py-4 rounded-2xl font-black uppercase italic text-sm tracking-tighter hover:bg-brand-blue transition-all group/btn shadow-lg"
                        >
                          Inscreva-se
                          <ChevronRight
                            size={18}
                            className="group-hover/btn:translate-x-1 transition-transform"
                          />
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-zinc-100 text-zinc-400 px-6 py-4 rounded-2xl font-black uppercase italic text-sm cursor-not-allowed"
                        >
                          Em breve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 font-bold italic uppercase">
                Aguardando novas provas...
              </p>
            )}
          </div>
          <div className="mt-8 flex justify-center md:hidden">
            <Link
              href="/provas"
              className="flex items-center gap-2 text-brand-blue font-bold uppercase text-xs tracking-widest bg-brand-light px-6 py-3 rounded-full"
            >
              Ver calendário completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. COLUNISTAS E ARTIGOS RECENTES (DINÂMICO) */}
      <section className="py-20 bg-brand-navy rounded-[3rem] mx-4 overflow-hidden shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          {/* --- DESTAQUE DOS 5 ESPECIALISTAS --- */}
          <div className="mb-16 border-b border-white/10 pb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase text-center mb-12">
              Nossos{" "}
              <span className="text-brand-blue not-italic">Especialistas</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
              {colunistas.length > 0 ? (
                colunistas.map((colunista) => (
                  <Link
                    href={`/colunista/${colunista.id}`}
                    key={colunista.id}
                    className="group flex flex-col items-center text-center cursor-pointer w-full"
                  >
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-brand-blue transition-all duration-300 bg-white/5 flex items-center justify-center shadow-xl mb-4 shrink-0">
                      {colunista.photoUrl ? (
                        <Image
                          src={
                            colunista.photoUrl?.startsWith("http")
                              ? colunista.photoUrl
                              : `http://localhost:3001${colunista.photoUrl}`
                          }
                          alt={colunista.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <UserCircle size={48} className="text-white/20" />
                      )}
                    </div>
                    <h3 className="text-white text-sm md:text-base font-black uppercase italic group-hover:text-brand-blue transition-colors leading-tight">
                      {colunista.name}
                    </h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1 line-clamp-1">
                      Ver Perfil
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-white/40 italic text-sm col-span-full text-center">
                  Carregando especialistas...
                </p>
              )}
            </div>
          </div>
          {/* ---------------------------------- */}

          {/* --- TÍTULO DOS ARTIGOS RECENTES --- */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6">
            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase">
              Artigos{" "}
              <span className="text-brand-blue not-italic">Recentes</span>
            </h2>
            <Link
              href="/artigos"
              className="flex items-center gap-2 text-brand-blue font-bold hover:text-white transition-colors uppercase text-xs tracking-widest border-b border-brand-blue pb-1"
            >
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </div>

          {/* --- LISTAGEM DOS ARTIGOS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {artigos.length > 0 ? (
              artigos.map((artigo) => (
                <Link
                  href={`/artigo/${artigo.id}`}
                  key={artigo.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group flex flex-col h-full cursor-pointer"
                >
                  <div className="relative w-full h-48 rounded-[2rem] overflow-hidden mb-6 bg-brand-navy shrink-0">
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
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <span className="text-white font-black italic text-4xl">
                          C83
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-brand-blue mb-4 text-xs font-black uppercase italic">
                    <Clock size={14} />{" "}
                    {new Date(artigo.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:underline line-clamp-2">
                    {artigo.title}
                  </h3>

                  <div
                    className="text-white/60 text-sm mb-8 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: artigo.content }}
                  />

                  <div className="flex items-center gap-3 border-t border-white/10 pt-6 mt-auto">
                    <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-brand-blue/50">
                      {artigo.columnist?.photoUrl ? (
                        <img
                          src={
                            artigo.columnist.photoUrl?.startsWith("http")
                              ? artigo.columnist.photoUrl
                              : `http://localhost:3001${artigo.columnist.photoUrl}`
                          }
                          alt={artigo.columnist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-black italic text-white text-xs">
                          83
                        </span>
                      )}
                    </div>
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest italic line-clamp-1">
                      {artigo.columnist?.name ||
                        artigo.columnistName ||
                        "Colunista C83"}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white/40 italic col-span-full">
                Novas dicas em breve...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 6. PARCEIROS (DINÂMICO) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-brand-blue font-black italic uppercase text-sm tracking-widest">
                Nossa Rede
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-navy italic uppercase leading-none mt-1">
                Parceiros
              </h2>
            </div>
            <Link
              href="/parceiros"
              className="hidden md:flex items-center gap-2 text-brand-navy font-bold hover:text-brand-blue transition-colors uppercase text-xs tracking-widest"
            >
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {parceiros.length > 0 ? (
              parceiros.map((parceiro) => (
                <a
                  key={parceiro.id}
                  href={parceiro.website || parceiro.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-light/30 border border-zinc-100 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition-all duration-300 group cursor-pointer block"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white mb-4 border-4 border-white shadow-sm group-hover:scale-105 transition-transform flex shrink-0 items-center justify-center">
                    {parceiro.logoUrl ? (
                      <Image
                        src={
                          parceiro.logoUrl?.startsWith("http")
                            ? parceiro.logoUrl
                            : `http://localhost:3001${parceiro.logoUrl}`
                        }
                        alt={parceiro.name}
                        fill
                        className="object-cover p-2"
                      />
                    ) : (
                      <Handshake size={32} className="text-brand-navy/20" />
                    )}
                  </div>
                  <h3 className="text-[11px] font-black text-brand-navy uppercase italic group-hover:text-brand-blue transition-colors line-clamp-2">
                    {parceiro.name}
                  </h3>
                </a>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-zinc-400 font-bold italic uppercase">
                  Carregando parceiros...
                </p>
              </div>
            )}
          </div>

          {/* Botão Ver Todos no Mobile */}
          <div className="mt-8 flex justify-center md:hidden">
            <Link
              href="/parceiros"
              className="flex items-center gap-2 text-brand-blue font-bold uppercase text-xs tracking-widest bg-brand-light px-6 py-3 rounded-full"
            >
              Ver todos os parceiros <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. REDES SOCIAIS */}
      <section className="py-20 bg-brand-light/50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-brand-navy italic uppercase tracking-tighter leading-none">
              Acompanhe a{" "}
              <span className="text-brand-blue not-italic">Correria</span>
            </h2>
            <p className="text-zinc-500 font-medium text-sm mt-2">
              Treinos, resultados e os bastidores da nossa comunidade.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="flex items-center gap-3 bg-white border border-zinc-100 px-8 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-blue transition-all group"
            >
              <Camera
                className="text-brand-navy group-hover:text-brand-blue transition-colors"
                size={24}
              />
              <span className="font-black text-brand-navy uppercase italic text-sm tracking-widest">
                @correria83
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 bg-white border border-zinc-100 px-8 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-blue transition-all group"
            >
              <Play
                className="text-brand-navy group-hover:text-brand-blue transition-colors"
                size={24}
              />
              <span className="font-black text-brand-navy uppercase italic text-sm tracking-widest">
                YouTube
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white text-center border-t border-zinc-50">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 Correria 83 - Assessoria Esportiva.
        </p>
      </footer>
    </main>
  );
}
