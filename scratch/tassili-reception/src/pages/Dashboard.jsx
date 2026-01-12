import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Wallet, ShoppingCart, RotateCcw, Save, Trash2, History, Disc, Clock } from 'lucide-react';
import { resetAllData, runAutoBackup, getAvailableBackups, restoreBackup, saveCurrentState } from '../lib/audit';

const EditableText = ({ id, defaultText, className }) => {
    const [value, setValue] = useState(defaultText);
    useEffect(() => {
        const saved = localStorage.getItem(`dashboard_edit_${id}`);
        if (saved) setValue(saved);
    }, [id]);
    const handleChange = (e) => {
        setValue(e.target.value);
        localStorage.setItem(`dashboard_edit_${id}`, e.target.value);
    };
    return (
        <input
            value={value}
            onChange={handleChange}
            className={`bg-transparent border-none outline-none focus:ring-1 focus:ring-violet-500/50 rounded px-1 transition-all w-full ${className}`}
        />
    );
};

export default function Dashboard() {
    const [showBackups, setShowBackups] = useState(false);
    const [backups, setBackups] = useState([]);
    const [lastAutoSave, setLastAutoSave] = useState(null);

    useEffect(() => {
        // 1. Au démarrage
        runAutoBackup();
        setBackups(getAvailableBackups());

        // 2. PILOTE AUTOMATIQUE (Toutes les 60 secondes)
        const autoSaveTimer = setInterval(() => {
            saveCurrentState(true); // Mode silencieux
            const now = new Date();
            setLastAutoSave(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        }, 60000);

        return () => clearInterval(autoSaveTimer);
    }, []);

    return (
        <div className="p-6 md:p-10 min-h-screen pb-24 text-white relative">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Vue d'Ensemble</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-400">Consolidation financière en temps réel.</p>
                        {lastAutoSave && (
                            <span className="text-xs font-mono text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 animate-pulse">
                                <Clock size={10} />
                                Auto-Save : {lastAutoSave}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* --- LE fameux BOUTON VERT EST ICI --- */}
                    <button
                        onClick={() => {
                            saveCurrentState(false); // Faux = Affiche la popup de confirmation
                            setLastAutoSave(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400/30 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        title="Sauvegarder l'état actuel manuellement"
                    >
                        <Disc size={16} />
                        Sauvegarder
                    </button>

                    {/* BOUTON HISTORIQUE */}
                    <button
                        onClick={() => setShowBackups(!showBackups)}
                        className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <History size={16} />
                        {showBackups ? 'Fermer' : 'Restaurer'}
                    </button>

                    {/* BOUTON RESET */}
                    <button
                        onClick={resetAllData}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <Trash2 size={16} />
                        Reset
                    </button>
                </div>
            </div>

            {/* MENU DE RESTAURATION */}
            {showBackups && (
                <div className="mb-8 p-6 rounded-3xl bg-blue-900/20 border border-blue-500/30 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-blue-100 mb-4 flex items-center gap-2">
                        <Save size={20} /> Choisir une date à restaurer
                    </h3>

                    {backups.length === 0 ? (
                        <p className="text-gray-400 text-sm">Aucune sauvegarde trouvée.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {backups.map(key => (
                                <button
                                    key={key}
                                    onClick={() => restoreBackup(key)}
                                    className="p-3 rounded-xl bg-[#0F1219] border border-white/10 hover:border-blue-400 hover:bg-blue-500/10 text-left transition-all group"
                                >
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Sauvegarde du</span>
                                    <span className="text-white font-mono font-bold flex items-center gap-2">
                                        <RotateCcw size={14} className="text-blue-400 group-hover:rotate-180 transition-transform" />
                                        {key.replace('backup_', '')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                    <p className="mt-4 text-xs text-blue-300/60 flex items-center gap-1">
                        <Clock size={12} />
                        Système actif : Sauvegarde auto toutes les 60s + Sauvegarde manuelle disponible.
                    </p>
                </div>
            )}

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0F1219] group hover:border-violet-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp size={14} className="text-blue-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">C.A. GLOBAL</span>
                    </div>
                    <EditableText id="card1_amount" defaultText="0,00 €" className="text-3xl font-bold text-white mb-2" />
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0F1219] group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Wallet size={14} className="text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ENCAISSÉ (CASH)</span>
                    </div>
                    <EditableText id="card2_amount" defaultText="0,00 €" className="text-3xl font-bold text-white mb-2" />
                    <div className="text-xs text-orange-400 font-medium">
                        Reste : <EditableText id="card2_reste" defaultText="0 €" className="inline-block w-20 text-orange-400" />
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0F1219] group hover:border-rose-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                            <ShoppingCart size={14} className="text-rose-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">DÉPENSES</span>
                    </div>
                    <EditableText id="card3_amount" defaultText="0,00 €" className="text-3xl font-bold text-white mb-2" />
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <TrendingUp size={14} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-white/80 uppercase tracking-wider">BÉNÉFICE NET</span>
                    </div>
                    <EditableText id="card4_amount" defaultText="0,00 €" className="text-3xl font-bold text-white mb-2" />
                </div>
            </div>

            {/* GRAPHIQUE */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0F1219]">
                <h3 className="text-lg font-bold text-white mb-6">Répartition par Salle</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2 text-sm font-medium">
                            <span className="text-gray-300">HR Réception</span>
                            <EditableText id="perf_val1" defaultText="0 €" className="text-right w-24 text-gray-300" />
                        </div>
                        <div className="h-2 bg-white/5 rounded-full"><div className="h-full bg-blue-500 w-0 rounded-full"></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2 text-sm font-medium">
                            <span className="text-gray-300">Tassili Réception</span>
                            <EditableText id="perf_val2" defaultText="0 €" className="text-right w-24 text-gray-300" />
                        </div>
                        <div className="h-2 bg-white/5 rounded-full"><div className="h-full bg-orange-500 w-0 rounded-full"></div></div>
                    </div>
                </div>
            </div>

        </div>
    );
}