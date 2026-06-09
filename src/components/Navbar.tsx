"use client";

import {
  Menu,
  X,
  ShoppingBag,
  Trophy,
  Users,
  Calendar,
  Newspaper,
  Handshake,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        // 🛠️ Removido o 'http://localhost:3001'.
        // Agora o axios usa automaticamente o baseURL configurado no services/api.ts
        const response = await api.get("/settings/banner");
        if (response.data && response.data.logoUrl) {
          setLogoUrl(response.data.logoUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar logo dinâmica:", error);
      }
    }
    loadSettings();
  }, []);

  const menuItems = [
    { name: "Quem somos", href: "/#quem-somos", icon: <Users size={18} /> },
    { name: "Nossos planos", href: "/planos", icon: <Trophy size={18} /> },
    {
      name: "Calendário de provas",
      href: "/provas",
      icon: <Calendar size={18} />,
    },
    { name: "Colunista", href: "/artigos", icon: <Newspaper size={18} /> },
    { name: "Parceiros", href: "/parceiros", icon: <Handshake size={18} /> }, // 👈 Novo item adicionado aqui!
  ];

  return (
    <nav className="w-full bg-white border-b border-zinc-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* LOGO ENVOLVIDA PELO LINK PARA HOME */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Correria 83"
                className="h-20 w-auto object-contain p-2"
              />
            ) : (
              <span className="text-2xl font-extrabold tracking-tighter italic text-brand-navy">
                CORRERIA <span className="text-brand-blue not-italic">83</span>
              </span>
            )}
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden xl:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[13px] font-bold text-brand-navy hover:text-brand-blue transition-colors uppercase tracking-tight"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* BOTÃO MOBILE */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-navy p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t border-zinc-100 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 p-3 text-brand-navy font-bold hover:bg-brand-light rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-brand-blue">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
