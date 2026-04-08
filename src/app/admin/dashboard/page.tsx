"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Image as ImageIcon, Calendar, Newspaper, LogOut, 
  Loader2, Save, Globe, Upload, Trash2, X, Settings, Users,
  Bold, Italic, List, Heading1, Heading2 
} from 'lucide-react';
import api from '@/services/api'; // Sua instância configurada com process.env

// Imports do Editor TipTap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Referências
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);
  const provaFotoInputRef = useRef<HTMLInputElement>(null);
  const artigoFotoInputRef = useRef<HTMLInputElement>(null);

  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('banner');
  const [loadingSave, setLoadingSave] = useState(false);

  // Estados
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [aboutText, setAboutText] = useState('');
  const [previewAbout, setPreviewAbout] = useState('');
  const [selectedAboutFile, setSelectedAboutFile] = useState<File | null>(null);
  const [provas, setProvas] = useState<any[]>([]);
  const [previewProva, setPreviewProva] = useState('');
  const [selectedProvaFile, setSelectedProvaFile] = useState<File | null>(null);
  const [novaProva, setNovaProva] = useState({ name: '', date: '', city: '', category: 'Patos', link: '' });

  const [artigos, setArtigos] = useState<any[]>([]);
  const [previewArtigo, setPreviewArtigo] = useState(''); 
  const [selectedArtigoFile, setSelectedArtigoFile] = useState<File | null>(null);
  const [novoArtigo, setNovoArtigo] = useState({
    title: '',
    content: '',
    columnistName: 'Dr. João Silva'
  });

  // Editor TipTap
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      setNovoArtigo(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none min-h-[300px] p-4 bg-brand-light rounded-b-2xl font-medium border-x border-b border-zinc-100',
      },
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('@Correria83:token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
      loadInitialData();
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'provas') loadProvas();
    if (activeTab === 'artigos') loadArtigos();
  }, [activeTab]);

  const loadInitialData = async () => {
    try {
      // 🛠️ Removido http://localhost:3001
      const response = await api.get('/settings/banner');
      if (response.data) setAboutText(response.data.content || '');
    } catch (error) { console.error("Erro ao carregar dados iniciais"); }
  };

  const loadProvas = async () => {
    try {
      // 🛠️ Removido http://localhost:3001
      const response = await api.get('/provas');
      setProvas(response.data);
    } catch (error) { console.error("Erro ao carregar provas"); }
  };

  const loadArtigos = async () => {
    try {
      // 🛠️ Removido http://localhost:3001
      const response = await api.get('/artigos');
      setArtigos(response.data);
    } catch (error) { console.error("Erro ao carregar artigos"); }
  };

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedLogo(file); setPreviewLogo(URL.createObjectURL(file)); }
  };
  const handleAboutFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedAboutFile(file); setPreviewAbout(URL.createObjectURL(file)); }
  };
  const handleProvaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedProvaFile(file); setPreviewProva(URL.createObjectURL(file)); }
  };
  const handleArtigoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedArtigoFile(file); setPreviewArtigo(URL.createObjectURL(file)); }
  };

  // Funções de Save
  const handleSaveBanner = async () => {
    if (!selectedFile) return;
    setLoadingSave(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // 🛠️ Removido http://localhost:3001
      await api.post('/settings/banner', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Banner enviado!"); window.location.reload();
    } catch (error) { alert("Erro ao subir banner."); } finally { setLoadingSave(false); }
  };

  const handleSaveLogo = async () => {
    if (!selectedLogo) return;
    setLoadingSave(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedLogo);
      // 🛠️ Removido http://localhost:3001
      await api.post('/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Logo atualizada!"); window.location.reload();
    } catch (error) { alert("Erro ao subir logo."); } finally { setLoadingSave(false); }
  };

  const handleSaveAbout = async () => {
    setLoadingSave(true);
    try {
      // 🛠️ Removido http://localhost:3001
      await api.post('/settings/about-text', { content: aboutText });
      if (selectedAboutFile) {
        const formData = new FormData();
        formData.append('file', selectedAboutFile);
        await api.post('/settings/about-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      alert("Quem Somos atualizado!"); window.location.reload();
    } catch (error) { alert("Erro ao atualizar."); } finally { setLoadingSave(false); }
  };

  const handleSaveProva = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSave(true);
    try {
      const formData = new FormData();
      formData.append('name', novaProva.name);
      formData.append('date', novaProva.date);
      formData.append('city', novaProva.city);
      formData.append('category', novaProva.category);
      formData.append('link', novaProva.link);
      if (selectedProvaFile) formData.append('file', selectedProvaFile);
      // 🛠️ Removido http://localhost:3001
      await api.post('/provas', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Prova cadastrada!"); setNovaProva({ name: '', date: '', city: '', category: 'Patos', link: '' }); setPreviewProva(''); setSelectedProvaFile(null); loadProvas();
    } catch (error) { alert("Erro ao cadastrar."); } finally { setLoadingSave(false); }
  };

  const handleSaveArtigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSave(true);
    try {
      const formData = new FormData();
      formData.append('title', novoArtigo.title);
      formData.append('content', novoArtigo.content);
      formData.append('columnistName', novoArtigo.columnistName);
      if (selectedArtigoFile) formData.append('file', selectedArtigoFile);

      // 🛠️ Removido http://localhost:3001
      await api.post('/artigos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Artigo publicado!");
      setNovoArtigo({ title: '', content: '', columnistName: 'Dr. João Silva' });
      setPreviewArtigo('');
      setSelectedArtigoFile(null);
      editor?.commands.setContent('');
      loadArtigos();
    } catch (error) { alert("Erro ao publicar artigo."); } finally { setLoadingSave(false); }
  };

  const handleDeleteProva = async (id: string) => {
    if (!confirm("Excluir esta prova?")) return;
    try { await api.delete(`/provas/${id}`); loadProvas(); } catch (error) { alert("Erro."); }
  };

  const handleDeleteArtigo = async (id: string) => {
    if (!confirm("Excluir este artigo?")) return;
    try { await api.delete(`/artigos/${id}`); loadArtigos(); } catch (error) { alert("Erro."); }
  };

  const clearSelection = () => { setPreviewUrl(''); setSelectedFile(null); };
  const clearLogoSelection = () => { setPreviewLogo(''); setSelectedLogo(null); };
  const clearAboutSelection = () => { setPreviewAbout(''); setSelectedAboutFile(null); };

  if (!authorized) return <div className="min-h-screen bg-brand-navy flex items-center justify-center"><Loader2 className="text-brand-blue animate-spin" size={40} /></div>;

  return (
    <div className="min-h-screen bg-brand-light flex animate-in fade-in duration-500">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-brand-navy p-6 flex flex-col shadow-2xl shrink-0">
        <div className="mb-10 px-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-black italic text-white text-xs">83</div>
          <span className="text-white font-black italic text-xl tracking-tighter uppercase">Admin</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('banner')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm italic uppercase tracking-widest ${activeTab === 'banner' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/70 hover:bg-white/10'}`}><ImageIcon size={20} /> Banner Principal</button>
          <button onClick={() => setActiveTab('identidade')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm italic uppercase tracking-widest ${activeTab === 'identidade' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/70 hover:bg-white/10'}`}><Settings size={20} /> Identidade Visual</button>
          <button onClick={() => setActiveTab('quem-somos')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm italic uppercase tracking-widest ${activeTab === 'quem-somos' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/70 hover:bg-white/10'}`}><Users size={20} /> Quem Somos</button>
          <button onClick={() => setActiveTab('provas')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm italic uppercase tracking-widest ${activeTab === 'provas' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/70 hover:bg-white/10'}`}><Calendar size={20} /> Provas</button>
          <button onClick={() => setActiveTab('artigos')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm italic uppercase tracking-widest ${activeTab === 'artigos' ? 'bg-brand-blue text-white shadow-lg' : 'text-white/70 hover:bg-white/10'}`}><Newspaper size={20} /> Artigos</button>
        </nav>
        <button onClick={() => { localStorage.removeItem('@Correria83:token'); router.push('/admin/login'); }} className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-300 p-3 font-bold text-sm uppercase tracking-widest"><LogOut size={20} /> Sair</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        
        {activeTab === 'banner' && (
          <section className="animate-in slide-in-from-bottom-2 duration-500 max-w-2xl">
            <header className="mb-10 flex justify-between items-center"><h1 className="text-3xl font-black text-brand-navy italic uppercase">Banner Principal</h1><a href="/" target="_blank" className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest hover:underline"><Globe size={16} /> Ver site</a></header>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 space-y-8"><div onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border-2 border-dashed border-zinc-200 cursor-pointer"><Upload size={20} className="text-brand-blue" /><p className="text-brand-navy font-black italic uppercase text-sm">Selecionar Banner</p></div>{previewUrl && <div className="relative w-48 h-28 rounded-xl overflow-hidden border-2 border-brand-blue shadow-lg"><img src={previewUrl} className="w-full h-full object-cover" alt="Preview" /><button onClick={clearSelection} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg"><X size={14} /></button></div>}<input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" /><button onClick={handleSaveBanner} disabled={loadingSave || !selectedFile} className="w-full bg-brand-navy text-white py-4 rounded-2xl font-black uppercase italic shadow-lg">{loadingSave ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Publicar no Site'}</button></div>
          </section>
        )}

        {activeTab === 'identidade' && (
          <section className="animate-in slide-in-from-bottom-2 duration-500 max-w-2xl">
            <header className="mb-10"><h1 className="text-3xl font-black text-brand-navy italic uppercase">Identidade Visual</h1></header>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 space-y-8"><div onClick={() => logoInputRef.current?.click()} className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border-2 border-dashed border-zinc-200 cursor-pointer"><Upload size={20} className="text-brand-blue" /><p className="text-brand-navy font-black italic uppercase text-sm">Selecionar Logo</p></div>{previewLogo && <div className="p-6 bg-brand-navy rounded-xl inline-block relative border-2 border-brand-blue"><img src={previewLogo} className="h-12 w-auto object-contain" alt="Logo Preview" /><button onClick={clearLogoSelection} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-lg"><X size={12} /></button></div>}<input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" /><button onClick={handleSaveLogo} disabled={loadingSave || !selectedLogo} className="w-full bg-brand-navy text-white py-4 rounded-2xl font-black uppercase italic shadow-lg">{loadingSave ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Atualizar Logo'}</button></div>
          </section>
        )}

        {activeTab === 'quem-somos' && (
          <section className="animate-in slide-in-from-bottom-2 duration-500 max-w-2xl">
            <header className="mb-10"><h1 className="text-3xl font-black text-brand-navy italic uppercase">Quem Somos</h1></header>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 space-y-8"><textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={6} className="w-full p-4 bg-brand-light rounded-2xl border-2 border-zinc-100 outline-none focus:border-brand-blue font-medium text-zinc-600" placeholder="Conte sobre a assessoria..." /><div onClick={() => aboutInputRef.current?.click()} className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border-2 border-dashed border-zinc-200 cursor-pointer"><Upload size={20} className="text-brand-blue" /><p className="text-brand-navy font-black italic uppercase text-sm">Selecionar Foto Lateral</p></div>{previewAbout && <div className="relative w-48 h-28 rounded-xl overflow-hidden border-2 border-brand-blue shadow-lg"><img src={previewAbout} className="w-full h-full object-cover" alt="About" /><button onClick={clearAboutSelection} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg"><X size={14} /></button></div>}<input type="file" ref={aboutInputRef} onChange={handleAboutFileChange} accept="image/*" className="hidden" /><button onClick={handleSaveAbout} disabled={loadingSave} className="w-full bg-brand-navy text-white py-4 rounded-2xl font-black uppercase italic shadow-lg flex items-center justify-center gap-2">{loadingSave ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}Salvar Alterações</button></div>
          </section>
        )}

        {activeTab === 'provas' && (
          <section className="animate-in slide-in-from-bottom-2 duration-500 max-w-5xl">
            <header className="mb-10"><h1 className="text-3xl font-black text-brand-navy italic uppercase">Calendário de Provas</h1></header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1"><form onSubmit={handleSaveProva} className="bg-white p-6 rounded-[2rem] shadow-xl border border-zinc-100 space-y-4 sticky top-24"><h3 className="font-black italic uppercase text-brand-navy text-xs mb-2">Nova Prova</h3><div onClick={() => provaFotoInputRef.current?.click()} className="group relative w-full h-32 bg-brand-light rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue transition-all overflow-hidden">{previewProva ? <img src={previewProva} className="w-full h-full object-cover" alt="Prova" /> : <><Upload size={20} className="text-brand-blue mb-1" /><span className="text-[10px] font-bold text-zinc-400 uppercase">Capa da Prova</span></>}</div><input type="file" ref={provaFotoInputRef} onChange={handleProvaFileChange} accept="image/*" className="hidden" /><input type="text" placeholder="Nome da Prova" className="w-full p-3 bg-brand-light rounded-xl border-none outline-none focus:ring-2 ring-brand-blue" value={novaProva.name} onChange={e => setNovaProva({...novaProva, name: e.target.value})} required /><input type="date" className="w-full p-3 bg-brand-light rounded-xl border-none outline-none focus:ring-2 ring-brand-blue" value={novaProva.date} onChange={e => setNovaProva({...novaProva, date: e.target.value})} required /><input type="text" placeholder="Cidade" className="w-full p-3 bg-brand-light rounded-xl border-none outline-none focus:ring-2 ring-brand-blue" value={novaProva.city} onChange={e => setNovaProva({...novaProva, city: e.target.value})} required /><select className="w-full p-3 bg-brand-light rounded-xl border-none outline-none focus:ring-2 ring-brand-blue font-bold uppercase text-[10px]" value={novaProva.category} onChange={e => setNovaProva({...novaProva, category: e.target.value})}><option value="Patos">Patos</option><option value="Região">Região</option></select><input type="url" placeholder="Link de Inscrição" className="w-full p-3 bg-brand-light rounded-xl border-none outline-none focus:ring-2 ring-brand-blue" value={novaProva.link} onChange={e => setNovaProva({...novaProva, link: e.target.value})} /><button type="submit" disabled={loadingSave} className="w-full bg-brand-blue text-white py-4 rounded-xl font-black uppercase italic shadow-lg hover:bg-brand-navy transition-all flex items-center justify-center gap-2">{loadingSave ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Cadastrar</button></form></div>
              <div className="lg:col-span-2 space-y-4">{provas.length > 0 ? provas.map((prova) => (<div key={prova.id} className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex justify-between items-center group"><div className="flex items-center gap-4"><div className="w-14 h-14 bg-brand-light rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-zinc-50 text-zinc-300">{prova.imageUrl ? <img src={prova.imageUrl} alt={prova.name} className="w-full h-full object-cover" /> : <ImageIcon size={16} />}</div><div className="flex items-center gap-4"><div className="bg-brand-light p-3 rounded-xl text-center min-w-[60px]"><p className="text-brand-blue font-black text-lg leading-none">{new Date(prova.date).getUTCDate()}</p><p className="text-zinc-400 font-bold uppercase text-[9px]">{new Date(prova.date).toLocaleString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '')}</p></div><div><h4 className="text-brand-navy font-black uppercase italic text-sm leading-tight">{prova.name}</h4><p className="text-zinc-400 text-xs font-medium">{prova.city} • <span className="text-brand-blue font-bold">{prova.category}</span></p></div></div></div><button onClick={() => handleDeleteProva(prova.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button></div>)) : (<div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-zinc-100"><p className="text-zinc-400 font-bold italic uppercase text-xs">Nenhuma prova cadastrada</p></div>)}</div>
            </div>
          </section>
        )}

        {activeTab === 'artigos' && (
          <section className="animate-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
            <header className="mb-10"><h1 className="text-3xl font-black text-brand-navy italic uppercase">Novo Artigo</h1><p className="text-zinc-500 font-medium">Use o editor abaixo para formatar suas dicas técnicas.</p></header>
            
            <form onSubmit={handleSaveArtigo} className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 space-y-6 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Título do Artigo" className="p-4 bg-brand-light rounded-2xl outline-none focus:ring-2 ring-brand-blue font-bold uppercase italic" value={novoArtigo.title} onChange={e => setNovoArtigo({...novoArtigo, title: e.target.value})} required />
                <input type="text" placeholder="Nome do Colunista" className="p-4 bg-brand-light rounded-2xl outline-none focus:ring-2 ring-brand-blue font-bold italic" value={novoArtigo.columnistName} onChange={e => setNovoArtigo({...novoArtigo, columnistName: e.target.value})} required />
              </div>

              <div onClick={() => artigoFotoInputRef.current?.click()} className="w-full h-48 bg-brand-light rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue transition-all overflow-hidden group">
                {previewArtigo ? (
                  <img src={previewArtigo} className="w-full h-full object-cover" alt="Artigo" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-brand-blue mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase text-zinc-400">Adicionar Foto de Capa</span>
                  </>
                )}
              </div>
              <input type="file" ref={artigoFotoInputRef} onChange={handleArtigoFileChange} accept="image/*" className="hidden" />

              <div className="border border-zinc-100 rounded-2xl overflow-hidden">
                <div className="bg-zinc-50 p-2 border-b border-zinc-100 flex flex-wrap gap-1">
                  <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor?.isActive('bold') ? 'bg-brand-blue text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}><Bold size={18} /></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor?.isActive('italic') ? 'bg-brand-blue text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}><Italic size={18} /></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded-lg transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'bg-brand-blue text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}><Heading1 size={18} /></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-brand-blue text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}><Heading2 size={18} /></button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-colors ${editor?.isActive('bulletList') ? 'bg-brand-blue text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}><List size={18} /></button>
                </div>
                <EditorContent editor={editor} />
              </div>

              <button type="submit" disabled={loadingSave} className="w-full bg-brand-navy text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-brand-blue transition-all shadow-lg flex items-center justify-center gap-3">
                {loadingSave ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                Publicar Artigo
              </button>
            </form>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-brand-navy italic uppercase border-l-4 border-brand-blue pl-4">Artigos Publicados</h2>
              <div className="grid grid-cols-1 gap-4">
                {artigos.length > 0 ? artigos.map((artigo) => (
                  <div key={artigo.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-100 flex gap-6 items-center group hover:shadow-md transition-all">
                    <div className="w-24 h-24 bg-brand-light rounded-2xl overflow-hidden shrink-0 border border-zinc-50">
                      {artigo.imageUrl ? <img src={artigo.imageUrl} className="w-full h-full object-cover" alt="Artigo" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold">C83</div>}
                    </div>
                    <div className="flex-1">
                      <span className="text-brand-blue font-black uppercase text-[10px] italic">
                        {new Date(artigo.createdAt).toLocaleDateString('pt-BR')} • {artigo.columnistName}
                      </span>
                      <h4 className="text-brand-navy font-black uppercase italic text-lg leading-tight mt-1">{artigo.title}</h4>
                      <div className="text-zinc-400 text-sm mt-1 line-clamp-1 opacity-70" dangerouslySetInnerHTML={{ __html: artigo.content }} />
                    </div>
                    <button onClick={() => handleDeleteArtigo(artigo.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-zinc-100"><p className="text-zinc-400 font-bold italic uppercase text-xs">Nenhum artigo publicado</p></div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}