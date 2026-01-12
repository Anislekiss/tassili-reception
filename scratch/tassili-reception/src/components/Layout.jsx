import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Receipt, Wallet, LogOut, Calendar, FileText, Menu, X, Sparkles, Landmark, TrendingUp, Video, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// CONFIGURATION FACETIME (Admin IDs)
const FACETIME_IDS = ["0613316673", "0636172152"]; // Karim & Anis

export default function Layout({ children }) {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
        { path: '/finance', icon: TrendingUp, label: 'Pilotage Financier' },
        { path: '/vault', icon: Landmark, label: 'Coffre-fort' },
        { path: '/meeting', icon: Video, label: 'Quick Meeting', action: 'facetime' }, // Special Action
        { path: '/agenda', icon: Calendar, label: 'Agenda & Planning' },
        { path: '/documents', icon: FileText, label: 'Contrats & Factures' },
        { path: '/new-contract', icon: PlusCircle, label: 'Nouveau Contrat' },
        { path: '/clients', icon: Users, label: 'Fichier Clients' },
        { path: '/visits', icon: Eye, label: 'Visite Client' }, // NOUVEAU BOUTON AJOUTÉ ICI
        { path: '/expenses', icon: Receipt, label: 'Dépenses & Achats' },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-8 pb-10 flex items-center gap-4">
                {/* LOGO A&K CUSTOM */}
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white drop-shadow-sm" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21l9-18 9 18" />
                        <path d="M5 21l9-18" opacity="0.5" />
                        <path d="M15 21l0-18" opacity="0" />
                    </svg>
                    <span className="absolute text-[10px] font-black tracking-tighter text-white/90 top-[55%] leading-none transform -translate-y-1/2">
                        A&K
                    </span>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight font-sans">
                        A&K
                    </h1>
                    <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-[0.25em]">Manager</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    // SPECIAL ACTION: FACETIME
                    if (item.action === 'facetime') {
                        const facetimeUrl = `facetime:${FACETIME_IDS.join(',')}`;
                        return (
                            <a href={facetimeUrl} key={item.label} className="block mt-6 mb-2">
                                <div className="relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 hover:scale-[1.02] cursor-pointer">
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-green-500 rounded-r-full shadow-[0_0_10px_#22c55e]" />
                                    <Icon size={20} className="text-green-400 group-hover:text-green-300 transition-colors animate-pulse" />
                                    <span className="text-sm font-bold tracking-wide text-green-100 group-hover:text-white">
                                        {item.label}
                                    </span>
                                </div>
                            </a>
                        );
                    }

                    return (
                        <Link to={item.path} key={item.path}>
                            <div className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${isActive
                                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] flow-active'
                                    : 'hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-blue-400 rounded-r-full shadow-[0_0_10px_#60a5fa]"
                                    />
                                )}

                                <Icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-white'}`} />
                                <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                    <LogOut size={18} />
                    Déconnexion
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#0f1021] text-white font-sans overflow-hidden relative selection:bg-blue-500/30">

            {/* --- BACKGROUND AURORA --- */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Top Left Blue Orb */}
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />
                {/* Bottom Right Purple Orb */}
                <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px]" />
                {/* Center Subtle Glow */}
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[150px]" />
                {/* Grain Overlay */}
                <div className="absolute inset-0 bg-grain opacity-20" />
            </div>

            {/* --- MOBILE HEADER --- */}
            <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-[#0f1021]/80 backdrop-blur-xl border-b border-white/5 z-30 flex items-center justify-between px-4 pt-safe">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-white/70 active:text-white">
                        <Menu size={24} />
                    </button>
                    <span className="font-black text-xl text-white tracking-tight">A&K <span className="text-xs font-normal text-white/50 uppercase tracking-widest pl-1">Manager</span></span>
                </div>
            </div>

            {/* --- SIDEBAR (Glass Panel) --- */}
            <aside className="hidden lg:flex w-72 h-full flex-col z-20 glass-panel border-r-0 border-r-white/5 relative">
                <SidebarContent />
            </aside>

            {/* --- MOBILE DRAWER --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            className="fixed inset-y-0 left-0 w-80 bg-[#1a1b35] border-r border-white/10 z-50 lg:hidden flex flex-col"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-y-auto relative z-10 pt-16 lg:pt-0 no-scrollbar">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-full pb-24 lg:pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}