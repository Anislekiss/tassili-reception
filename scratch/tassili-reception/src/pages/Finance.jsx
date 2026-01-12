import React, { useState, useEffect } from 'react';
import { Building, RefreshCw, ArrowUpRight, ArrowDownRight, Link, ShieldCheck, Activity } from 'lucide-react';

export default function Finance() {
    // 1. État pour les soldes (LCL et SG)
    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('finance_accounts');
        return saved ? JSON.parse(saved) : {
            lcl: { balance: 0, connected: false, lastUpdate: null },
            sg: { balance: 0, connected: false, lastUpdate: null }
        };
    });

    // 2. État pour l'animation de chargement
    const [isSyncing, setIsSyncing] = useState(false);

    // Sauvegarde auto
    useEffect(() => {
        localStorage.setItem('finance_accounts', JSON.stringify(accounts));
    }, [accounts]);

    // 3. Fonction de "Connexion / Synchronisation"
    const handleConnect = (bankKey, bankName) => {
        setIsSyncing(true); // Démarre l'animation

        // Simulation d'un délai réseau (pour faire "vrai")
        setTimeout(() => {
            const input = window.prompt(`CONNEXION SÉCURISÉE ${bankName}\n\nVeuillez entrer le solde réel actuel de votre compte (€) :`);

            if (input !== null) {
                const amount = parseFloat(input.replace(',', '.').replace(' ', ''));
                if (!isNaN(amount)) {
                    setAccounts(prev => ({
                        ...prev,
                        [bankKey]: {
                            balance: amount,
                            connected: true,
                            lastUpdate: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                        }
                    }));
                }
            }
            setIsSyncing(false); // Arrête l'animation
        }, 1500);
    };

    return (
        <div className="p-6 md:p-10 min-h-screen pb-24 text-white">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Pilotage Financier</h1>
                    <p className="text-gray-400">Flux de trésorerie multi-banques.</p>
                </div>
                {/* Indicateur global */}
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-orange-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                    <span className="text-xs font-bold text-emerald-400">
                        {isSyncing ? 'SYNCHRONISATION...' : 'SYSTÈME EN LIGNE'}
                    </span>
                </div>
            </div>

            {/* SECTION BANQUES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                {/* CARTE LCL */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#1e2330] to-[#0F1219] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building size={100} />
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                                <span className="font-bold text-blue-400 text-xs">LCL</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">LCL • RÉCEPTION RH</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    {accounts.lcl.connected ? (
                                        <>
                                            <ShieldCheck size={12} className="text-emerald-400" />
                                            <span>Connecté • Maj {accounts.lcl.lastUpdate}</span>
                                        </>
                                    ) : (
                                        <span>Non connecté</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BOUTON CONNECTER LCL */}
                        <button
                            onClick={() => handleConnect('lcl', 'LCL PRO')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95"
                            title="Synchroniser le compte"
                        >
                            {accounts.lcl.connected ? <RefreshCw size={18} className={isSyncing ? "animate-spin text-blue-400" : "text-blue-400"} /> : <Link size={18} className="text-gray-400" />}
                        </button>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold tracking-tight text-white block">
                            {accounts.lcl.balance.toLocaleString('fr-FR')} €
                        </span>
                        <span className="text-sm text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 mt-2 inline-block">
                            Solde réel disponible
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 rounded-xl bg-blue-600/10 text-blue-400 text-xs font-bold border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all">
                            VIREMENTS
                        </button>
                        <button className="py-2 rounded-xl bg-white/5 text-gray-400 text-xs font-bold border border-white/10 hover:bg-white/10 transition-all">
                            HISTORIQUE
                        </button>
                    </div>
                </div>

                {/* CARTE SOCIÉTÉ GÉNÉRALE */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#2a1b1b] to-[#0F1219] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building size={100} />
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center border border-red-500/30">
                                <span className="font-bold text-red-400 text-xs">SG</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">SOCIÉTÉ GÉNÉRALE • TASSILI</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    {accounts.sg.connected ? (
                                        <>
                                            <ShieldCheck size={12} className="text-emerald-400" />
                                            <span>Connecté • Maj {accounts.sg.lastUpdate}</span>
                                        </>
                                    ) : (
                                        <span>Non connecté</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BOUTON CONNECTER SG */}
                        <button
                            onClick={() => handleConnect('sg', 'SOCIÉTÉ GÉNÉRALE')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95"
                            title="Synchroniser le compte"
                        >
                            {accounts.sg.connected ? <RefreshCw size={18} className={isSyncing ? "animate-spin text-red-400" : "text-red-400"} /> : <Link size={18} className="text-gray-400" />}
                        </button>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-bold tracking-tight text-white block">
                            {accounts.sg.balance.toLocaleString('fr-FR')} €
                        </span>
                        <span className="text-sm text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20 mt-2 inline-block">
                            Solde réel disponible
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 rounded-xl bg-red-600/10 text-red-400 text-xs font-bold border border-red-600/20 hover:bg-red-600 hover:text-white transition-all">
                            VIREMENTS
                        </button>
                        <button className="py-2 rounded-xl bg-white/5 text-gray-400 text-xs font-bold border border-white/10 hover:bg-white/10 transition-all">
                            HISTORIQUE
                        </button>
                    </div>
                </div>

            </div>

            {/* GRAPHIQUE (DÉCORATIF MAIS MODERNE) */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0F1219]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-white">Analyse des flux (N & N-1)</h3>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Revenus
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Dépenses
                        </div>
                    </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {/* Simulation de barres de graphique */}
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                        <div key={i} className="w-full bg-white/5 rounded-t-lg relative group h-full flex items-end">
                            <div style={{ height: `${h}%` }} className="w-full bg-indigo-500/20 border-t border-indigo-500/50 rounded-t-lg transition-all group-hover:bg-indigo-500/40 relative"></div>
                            <div style={{ height: `${h / 2}%` }} className="absolute bottom-0 w-full bg-rose-500/20 border-t border-rose-500/50 rounded-t-lg transition-all group-hover:bg-rose-500/40"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                    <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
                    <span>Juil</span><span>Août</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
                </div>
            </div>

        </div>
    );
}