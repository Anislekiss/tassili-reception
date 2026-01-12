import React, { useState, useEffect } from 'react';
import { Shield, Plus, TrendingUp, History, Lock, Wallet, ArrowUpRight } from 'lucide-react';

export default function Vault() {
    // 1. On initialise le solde à 0 (ou on récupère ce qu'il y a en mémoire)
    const [balance, setBalance] = useState(() => {
        return parseFloat(localStorage.getItem('vault_balance') || '0');
    });

    // 2. On gère l'historique des versements
    const [history, setHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('vault_history') || '[]');
    });

    // Sauvegarde automatique à chaque changement
    useEffect(() => {
        localStorage.setItem('vault_balance', balance);
        localStorage.setItem('vault_history', JSON.stringify(history));
    }, [balance, history]);

    // Fonction pour ajouter de l'argent
    const handleDeposit = () => {
        const amountStr = window.prompt("Somme à verser au coffre (€) :");
        if (amountStr) {
            const amount = parseFloat(amountStr.replace(',', '.')); // Gère les virgules
            if (!isNaN(amount) && amount > 0) {
                setBalance(prev => prev + amount);

                const newTransaction = {
                    id: Date.now(),
                    label: "Versement Exceptionnel",
                    date: new Date().toLocaleDateString('fr-FR'),
                    amount: amount
                };
                setHistory([newTransaction, ...history]);
            }
        }
    };

    // Fonction secrète pour remettre à zéro (clic sur le cadenas)
    const handleResetVault = () => {
        if (window.confirm("Voulez-vous vider entièrement le coffre-fort ?")) {
            setBalance(0);
            setHistory([]);
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen pb-24 text-white">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <Lock className="text-emerald-400" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coffre-fort</h1>
                    <p className="text-gray-400">Réserve stratégique et épargne sécurisée.</p>
                </div>
            </div>

            {/* CARTE PRINCIPALE */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0F1219] to-[#13161c] relative overflow-hidden mb-10">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Shield size={120} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={16} className="text-emerald-400" />
                            <span
                                onClick={handleResetVault}
                                className="text-xs font-bold text-emerald-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                                title="Cliquez pour vider le coffre"
                            >
                                TOTAL SÉCURISÉ
                            </span>
                        </div>
                        {/* Affiche le montant dynamique */}
                        <div className="text-6xl font-bold text-white tracking-tight">
                            {balance.toLocaleString('fr-FR')} €
                        </div>
                        <p className="text-gray-400 mt-2 text-sm">Disponible pour investissement ou sécurité.</p>
                    </div>

                    <button
                        onClick={handleDeposit}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                        <Plus size={20} />
                        Verser au Coffre
                    </button>
                </div>
            </div>

            {/* HISTORIQUE */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-[#0F1219]">
                <div className="flex items-center gap-2 mb-6">
                    <History size={20} className="text-gray-400" />
                    <h3 className="text-lg font-bold text-white">Historique des mouvements</h3>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 border border-dashed border-white/5 rounded-2xl">
                        <Wallet className="mx-auto mb-3 opacity-20" size={32} />
                        <p>Aucun mouvement pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <ArrowUpRight size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{item.label}</h4>
                                        <span className="text-xs text-gray-400">{item.date}</span>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-emerald-400 text-lg">
                                    + {item.amount.toLocaleString('fr-FR')} €
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}