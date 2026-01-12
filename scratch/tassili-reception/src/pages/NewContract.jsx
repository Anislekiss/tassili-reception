import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { User, Phone, Mail, Calendar, Home, Utensils, Edit3, Save, CheckCircle, Upload, X } from 'lucide-react';

export default function NewContract() {
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', notes: '' });
    const [logistique, setLogistique] = useState({ jour: 'Samedi', salle: 'Salle Le Tassili' });
    const [participants, setParticipants] = useState({ adultes: 0, enfants: 0 });
    const [editMode, setEditMode] = useState(false);
    const [selections, setSelections] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    // DONNÉES PAR DÉFAUT (Pour éviter l'écran vide)
    const defaultData = {
        Entrées: Array(4).fill(0).map((_, i) => ({ id: `e${i}`, label: `Entrée ${i + 1}`, price: 10, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' })),
        Plats: Array(4).fill(0).map((_, i) => ({ id: `p${i}`, label: `Plat ${i + 1}`, price: 20, img: 'https://images.unsplash.com/photo-1585937421612-70a0f2d5c7e1?w=400' })),
        Desserts: Array(4).fill(0).map((_, i) => ({ id: `d${i}`, label: `Dessert ${i + 1}`, price: 8, img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' })),
        Options: Array(4).fill(0).map((_, i) => ({ id: `o${i}`, label: `Option ${i + 1}`, price: 15, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' }))
    };

    const [traiteurData, setTraiteurData] = useState(defaultData);

    // 1. RÉCUPÉRATION ROBUSTE
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "config", "traiteur"), (docSnap) => {
            if (docSnap.exists()) {
                setTraiteurData(docSnap.data());
            } else {
                // Si Firebase est vide, on injecte les données par défaut pour ne pas avoir d'écran blanc
                setDoc(doc(db, "config", "traiteur"), defaultData);
            }
        });
        return () => unsub();
    }, []);

    // 2. COMPRESSION D'IMAGE (ANTI-CRASH)
    const handleFileUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 400; canvas.height = 300;
                ctx.drawImage(img, 0, 0, 400, 300);
                setEditingItem({ ...editingItem, img: canvas.toDataURL('image/jpeg', 0.7) });
            };
        };
        reader.readAsDataURL(file);
    };

    // 3. SAUVEGARDE DÉFINITIVE
    const saveChange = async () => {
        const category = Object.keys(traiteurData).find(cat => traiteurData[cat].find(i => i.id === editingItem.id));
        const newData = { ...traiteurData, [category]: traiteurData[category].map(i => i.id === editingItem.id ? editingItem : i) };
        await setDoc(doc(db, "config", "traiteur"), newData);
        setEditingItem(null);
    };

    const totalDevis = useMemo(() => {
        const prixPlats = selections.reduce((sum, item) => sum + Number(item.price || 0), 0);
        return (Number(participants.adultes) * prixPlats) + (Number(participants.enfants) * 15);
    }, [participants, selections, traiteurData]);

    return (
        <div className="p-4 bg-[#020617] min-h-screen text-white pb-40 font-sans">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h1 className="text-xl font-black text-blue-500 uppercase italic">Nouveau Contrat</h1>
                <button onClick={() => setEditMode(!editMode)} className={`px-6 py-3 rounded-2xl font-bold transition-all ${editMode ? 'bg-red-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                    {editMode ? "Quitter l'édition" : "🔧 Configurer Prix/Photos"}
                </button>
            </div>

            {/* SECTION CLIENT & LOGISTIQUE SIMPLIFIÉE */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col gap-3">
                    <input placeholder="NOM CLIENT" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500 uppercase font-bold text-sm" onChange={e => setClient({ ...client, nom: e.target.value })} />
                    <input placeholder="TÉLÉPHONE" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" onChange={e => setClient({ ...client, tel: e.target.value })} />
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase text-center tracking-widest text-emerald-400">Choix de la salle</p>
                    <div className="flex gap-2">
                        {['Salle Le Tassili', 'Salle HR'].map(s => (
                            <button key={s} onClick={() => setLogistique({ ...logistique, salle: s })} className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-xs ${logistique.salle === s ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-900 border-slate-800 opacity-30'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </section>

            {/* GRILLE TRAITEUR */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(traiteurData).map(([cat, items]) => (
                    <div key={cat} className="space-y-4">
                        <h3 className="text-center font-black text-slate-500 text-[10px] uppercase tracking-[0.3em]">{cat}</h3>
                        {items.map((item) => (
                            <div key={item.id}
                                onClick={() => editMode ? setEditingItem(item) : setSelections(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item])}
                                className={`relative h-44 rounded-[2.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${selections.find(i => i.id === item.id) ? 'border-blue-500 scale-[1.03] shadow-2xl shadow-blue-500/20' : 'border-slate-800'}`}>
                                <img src={item.img || 'https://via.placeholder.com/400'} className="absolute inset-0 w-full h-full object-cover" />
                                <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 ${editMode ? 'bg-black/80 border-2 border-dashed border-white/20' : ''}`}>
                                    <p className="font-black text-[10px] uppercase tracking-widest">{item.label}</p>
                                    <p className="text-blue-400 font-black text-2xl">{item.price}€</p>
                                    {editMode && <Edit3 className="mt-2 text-white/50" size={16} />}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* MODALE D'ÉDITION ÉLÉGANTE */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 backdrop-blur-xl">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative group w-full h-48 rounded-[2rem] overflow-hidden">
                                <img src={editingItem.img} className="w-full h-full object-cover" />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer transition-all">
                                    <Upload size={30} /><span className="ml-2 font-bold text-xs uppercase">Changer Photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e.target.files[0])} />
                                </label>
                            </div>
                            <input className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center font-bold uppercase" value={editingItem.label} onChange={e => setEditingItem({ ...editingItem, label: e.target.value })} />
                            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 w-full">
                                <span className="font-bold text-slate-500 text-xs">PRIX €</span>
                                <input type="number" className="bg-transparent w-full text-right text-blue-400 font-black text-2xl outline-none" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: e.target.value })} />
                            </div>
                            <div className="flex gap-2 w-full pt-4">
                                <button onClick={() => setEditingItem(null)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-800">ANNULER</button>
                                <button onClick={saveChange} className="flex-1 py-4 rounded-2xl font-black bg-blue-600 shadow-lg shadow-blue-600/20 text-white">VALIDER</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CALCULATEUR FOOTER RÉDUIT */}
            <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800 p-6 flex justify-between items-center z-50">
                <div className="flex gap-2">
                    <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
                        <span className="text-[8px] text-slate-500 font-black">ADULTES</span>
                        <input type="number" className="bg-transparent w-10 text-xl font-black text-blue-400 text-center outline-none" value={participants.adultes} onChange={e => setParticipants({ ...participants, adultes: e.target.value })} />
                    </div>
                    <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
                        <span className="text-[8px] text-slate-500 font-black">ENFANTS (15€)</span>
                        <input type="number" className="bg-transparent w-10 text-xl font-black text-purple-400 text-center outline-none" value={participants.enfants} onChange={e => setParticipants({ ...participants, enfants: e.target.value })} />
                    </div>
                </div>
                <div className="text-right flex items-center gap-6">
                    <p className="text-4xl font-black tracking-tighter">{totalDevis}€</p>
                    <button className="bg-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-600/30">Valider Devis</button>
                </div>
            </footer>
        </div>
    );
}