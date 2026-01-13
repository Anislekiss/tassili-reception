import React, { useState, useMemo, useEffect, memo } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { User, Calendar, Home, Utensils, Calculator, Plus, Minus, CheckCircle } from 'lucide-react';

// OPTIMISATION : Ce composant ne se recharge QUE si on clique dessus (Zéro lag sur macOS/iPhone)
const MenuBubble = memo(({ item, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(item)}
        className={`relative h-32 md:h-44 rounded-[2rem] overflow-hidden cursor-pointer border-4 transition-all duration-200 ${isSelected ? 'border-blue-500 scale-105 shadow-xl' : 'border-slate-800 hover:border-slate-700'
            }`}
    >
        <img src={item.img} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest">{item.label}</p>
            <p className="text-lg md:text-2xl font-black text-orange-400">{item.price}€</p>
        </div>
    </div>
));

export default function NewContract() {
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selections, setSelections] = useState([]);
    const [traiteurData, setTraiteurData] = useState({ Entrées: [], Plats: [], Desserts: [], Options: [] });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "config", "traiteur"), (docSnap) => {
            if (docSnap.exists()) setTraiteurData(docSnap.data());
        });
        return () => unsub();
    }, []);

    const totalDevis = useMemo(() => {
        const prixBulles = selections.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        return (Number(adults) * prixBulles) + (Number(children) * 15);
    }, [adults, children, selections]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#020617] text-white">
            {/* GAUCHE : FORMULAIRE (Défilement sur iPhone, Fixe sur macOS) */}
            <div className="flex-1 p-4 md:p-8 pb-60 lg:pb-8 overflow-y-auto">
                <h1 className="text-3xl font-black text-blue-500 mb-8 uppercase italic tracking-tighter">Nouveau Contrat</h1>

                <section className="mb-10 space-y-4 bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-800">
                    <h2 className="text-blue-400 font-bold flex items-center gap-2"><User size={20} /> Client</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="NOM" className="bg-slate-900 p-4 rounded-2xl border border-slate-800 outline-none focus:border-blue-500 transition-all" onChange={e => setClient({ ...client, nom: e.target.value })} />
                        <input placeholder="PRÉNOM" className="bg-slate-900 p-4 rounded-2xl border border-slate-800 outline-none focus:border-blue-500 transition-all" onChange={e => setClient({ ...client, prenom: e.target.value })} />
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(traiteurData).map(([cat, items]) => (
                        <div key={cat} className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">{cat}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {items.map(item => (
                                    <MenuBubble
                                        key={item.id}
                                        item={item}
                                        isSelected={selections.find(i => i.id === item.id)}
                                        onSelect={(it) => setSelections(prev => prev.find(i => i.id === it.id) ? prev.filter(i => i.id !== it.id) : [...prev, it])}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DROITE : CALCULATEUR (Fixe sur macOS, Flottant sur iPhone) */}
            <aside className="lg:w-[400px] bg-slate-900/50 backdrop-blur-3xl border-l border-slate-800 p-8 hidden lg:block">
                <div className="sticky top-8 space-y-8">
                    <h2 className="text-2xl font-black text-blue-400 flex items-center gap-3"><Calculator /> Récapitulatif</h2>
                    <div className="space-y-4 bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
                        <div className="flex justify-between items-center font-bold text-slate-400">
                            <span>Adultes</span>
                            <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl">
                                <button onClick={() => setAdults(Math.max(0, adults - 1))}><Minus size={18} /></button>
                                <span className="text-xl text-blue-400 w-8 text-center">{adults}</span>
                                <button onClick={() => setAdults(adults + 1)}><Plus size={18} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="text-center pt-10">
                        <p className="text-8xl font-black tracking-tighter text-white">{totalDevis}€</p>
                        <button className="w-full mt-8 bg-blue-600 py-6 rounded-3xl font-black text-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30">VALIDER LE DEVIS</button>
                    </div>
                </div>
            </aside>

            {/* BARRE MOBILE (Uniquement iPhone) */}
            <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-4 z-50">
                <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                    <div className="text-3xl font-black">{totalDevis}€</div>
                    <button className="bg-blue-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20">Valider</button>
                </div>
            </footer>
        </div>
    );
}