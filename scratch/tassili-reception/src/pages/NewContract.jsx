import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Phone, Mail, StickyNote, Calendar, Home, Utensils, Edit3, Save, CheckCircle, Upload } from 'lucide-react';

export default function NewContract() {
    // 1. SECTION : INFORMATIONS CLIENT (CRM)
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', notes: '' });

    // 2. SECTION : LOGISTIQUE
    const [logistique, setLogistique] = useState({ jour: 'Samedi', salle: 'Salle Le Tassili' });

    // 3. SECTION : TRAITEUR (INTERFACE BULLLES)
    const [editMode, setEditMode] = useState(false);
    const [traiteurData, setTraiteurData] = useState({
        Entrées: [
            { id: 'e1', label: 'Entrée 1', price: 0, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
            { id: 'e2', label: 'Entrée 2', price: 0, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
            { id: 'e3', label: 'Entrée 3', price: 0, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
            { id: 'e4', label: 'Entrée 4', price: 0, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' }
        ],
        Plats: [
            { id: 'p1', label: 'Plat 1', price: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a0f2d5c7e1?w=200' },
            { id: 'p2', label: 'Plat 2', price: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a0f2d5c7e1?w=200' },
            { id: 'p3', label: 'Plat 3', price: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a0f2d5c7e1?w=200' },
            { id: 'p4', label: 'Plat 4', price: 0, img: 'https://images.unsplash.com/photo-1585937421612-70a0f2d5c7e1?w=200' }
        ],
        Desserts: Array(4).fill(0).map((_, i) => ({ id: `d${i}`, label: 'Dessert', price: 0, img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200' })),
        Options: Array(4).fill(0).map((_, i) => ({ id: `o${i}`, label: 'Option', price: 0, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200' }))
    });

    const [selections, setSelections] = useState([]);

    // 4. SECTION : CALCULATEUR & PARTICIPANTS
    const [participants, setParticipants] = useState({ adultes: 0, enfants: 0 });

    const totalDevis = useMemo(() => {
        const prixUnitaireAdulte = selections.reduce((sum, item) => sum + Number(item.price), 0);
        const totalAdultes = Number(participants.adultes) * prixUnitaireAdulte;
        const totalEnfants = Number(participants.enfants) * 15;
        return totalAdultes + totalEnfants;
    }, [participants, selections]);

    // FONCTIONS UTILITAIRES
    const handleImageUpload = (cat, index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const newData = { ...traiteurData };
            newData[cat][index].img = reader.result;
            setTraiteurData(newData);
        };
        reader.readAsDataURL(file);
    };

    const handleEditChange = (cat, index, field, value) => {
        const newData = { ...traiteurData };
        newData[cat][index][field] = value;
        setTraiteurData(newData);
    };

    const toggleSelection = (item) => {
        if (editMode) return;
        setSelections(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
    };

    const saveToFirebase = async () => {
        try {
            await addDoc(collection(db, "contracts"), {
                client, logistique, participants, selections, total: totalDevis, createdAt: serverTimestamp()
            });
            alert("✅ Devis enregistré avec succès !");
        } catch (e) { alert("❌ Erreur de sauvegarde"); }
    };

    return (
        <div className="p-6 bg-[#0f172a] min-h-screen text-white font-sans pb-40">

            {/* 1. SECTION CLIENT */}
            <section className="mb-8 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                <h2 className="flex items-center gap-2 text-blue-400 font-bold mb-6 text-xl"><User size={24} /> 1. Informations Client</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold ml-2">NOM</p>
                        <input className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-slate-800 focus:border-blue-500" onChange={e => setClient({ ...client, nom: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold ml-2">PRÉNOM</p>
                        <input className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-slate-800 focus:border-blue-500" onChange={e => setClient({ ...client, prenom: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold ml-2">TÉLÉPHONE</p>
                        <input className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-slate-800 focus:border-blue-500" onChange={e => setClient({ ...client, tel: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold ml-2">EMAIL</p>
                        <input className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-slate-800 focus:border-blue-500" onChange={e => setClient({ ...client, email: e.target.value })} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-4 space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold ml-2">NOTES PARTICULIÈRES</p>
                        <textarea className="w-full bg-slate-900 p-4 rounded-2xl outline-none border border-slate-800 h-24 focus:border-blue-500" onChange={e => setClient({ ...client, notes: e.target.value })} />
                    </div>
                </div>
            </section>

            {/* 2. SECTION LOGISTIQUE */}
            <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <h2 className="flex items-center gap-2 text-purple-400 font-bold mb-4 uppercase text-xs tracking-widest"><Calendar size={18} /> Sélecteur de Jour</h2>
                    <div className="flex gap-2">
                        {['Vendredi', 'Samedi', 'Dimanche'].map(j => (
                            <button key={j} onClick={() => setLogistique({ ...logistique, jour: j })} className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold ${logistique.jour === j ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-600/20' : 'bg-slate-900 border-slate-800 opacity-40'}`}>{j}</button>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <h2 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest"><Home size={18} /> Sélecteur de Salle</h2>
                    <div className="flex gap-2">
                        {['Salle Le Tassili', 'Salle HR'].map(s => (
                            <button key={s} onClick={() => setLogistique({ ...logistique, salle: s })} className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold ${logistique.salle === s ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-600/20' : 'bg-slate-900 border-slate-800 opacity-40'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SECTION TRAITEUR */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="flex items-center gap-2 text-orange-400 font-bold text-xl uppercase tracking-tighter"><Utensils size={24} /> 3. Traiteur (Bulles Interactives)</h2>
                    <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${editMode ? 'bg-red-600 animate-pulse' : 'bg-slate-800 hover:bg-slate-700'}`}>
                        {editMode ? <Save size={18} /> : <Edit3 size={18} />} {editMode ? 'ENREGISTRER LES MODIFS' : 'MODE ÉDITION'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(traiteurData).map(([cat, items]) => (
                        <div key={cat} className="space-y-4">
                            <h3 className="text-center font-black text-slate-500 text-[10px] uppercase tracking-[0.3em]">{cat}</h3>
                            {items.map((item, idx) => (
                                <div key={idx} onClick={() => toggleSelection(item)} className={`group relative h-44 rounded-[2.5rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 ${selections.find(i => i.id === item.id) ? 'border-orange-500 scale-[1.03] shadow-2xl shadow-orange-500/30' : 'border-slate-800 shadow-xl'}`}>
                                    <img src={item.img} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center ${editMode ? 'backdrop-blur-md bg-black/80' : ''}`}>
                                        {editMode ? (
                                            <div className="space-y-2 w-full flex flex-col items-center">
                                                <label className="cursor-pointer bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all mb-2">
                                                    <Upload size={20} />
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(cat, idx, e.target.files[0])} />
                                                </label>
                                                <input className="bg-transparent border-b border-white/30 text-xs w-full text-center font-bold uppercase" value={item.label} onClick={e => e.stopPropagation()} onChange={e => handleEditChange(cat, idx, 'label', e.target.value)} />
                                                <div className="flex items-center gap-1">
                                                    <input className="bg-transparent border-b border-white/30 text-lg w-16 text-center font-black text-orange-400" value={item.price} onClick={e => e.stopPropagation()} onChange={e => handleEditChange(cat, idx, 'price', e.target.value)} />
                                                    <span className="text-orange-400 font-bold">€</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-black text-xs uppercase mb-1 tracking-widest">{item.label}</p>
                                                <p className="text-orange-400 font-black text-2xl">{item.price}€</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. CALCULATEUR FIXE */}
            <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800 p-6 flex flex-col md:flex-row justify-between items-center gap-6 z-50">
                <div className="flex gap-4">
                    <div className="bg-slate-900 p-4 rounded-2xl flex items-center gap-4 px-6 border border-slate-800 shadow-inner">
                        <span className="text-[10px] text-slate-500 font-black uppercase">Adultes</span>
                        <input type="number" className="bg-transparent w-16 text-3xl font-black text-blue-400 outline-none" value={participants.adultes} onChange={e => setParticipants({ ...participants, adultes: e.target.value })} />
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl flex items-center gap-4 px-6 border border-slate-800 shadow-inner">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Enfants (15€)</span>
                        <input type="number" className="bg-transparent w-16 text-3xl font-black text-purple-400 outline-none" value={participants.enfants} onChange={e => setParticipants({ ...participants, enfants: e.target.value })} />
                    </div>
                </div>

                <div className="flex items-center gap-12">
                    <div className="text-right">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Estimation Devis</p>
                        <p className="text-6xl font-black text-white tracking-tighter">{totalDevis}€</p>
                    </div>
                    <button onClick={saveToFirebase} className="bg-blue-600 hover:bg-blue-500 px-14 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-blue-600/40 flex items-center gap-3 active:scale-95 uppercase tracking-widest">
                        <CheckCircle size={28} /> Enregistrer
                    </button>
                </div>
            </footer>
        </div>
    );
}