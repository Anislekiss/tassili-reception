import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Phone, Mail, StickyNote, Calendar, Home, Utensils, Edit3, Save, CheckCircle } from 'lucide-react';

export default function NewContract() {
    // --- 1. ÉTATS DES SECTIONS ---
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '', notes: '' });
    const [logistique, setLogistique] = useState({ jour: 'Samedi', salle: 'Salle Le Tassili' });
    const [participants, setParticipants] = useState({ adultes: 0, enfants: 0 });

    // --- 2. GESTION DU TRAITEUR (BULLLES) ---
    const [editMode, setEditMode] = useState(false);
    const [traiteurData, setTraiteurData] = useState({
        Entrées: [
            { id: 'e1', label: 'Entrée Royale', price: 12, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
            { id: 'e2', label: 'Salade César', price: 10, img: 'https://images.unsplash.com/photo-1550304943-4f24f52de506?w=200' },
            { id: 'e3', label: 'Verrine Avocat', price: 8, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200' },
            { id: 'e4', label: 'Feuilleté Fromage', price: 9, img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200' }
        ],
        Plats: [
            { id: 'p1', label: 'Tagine Agneau', price: 25, img: 'https://images.unsplash.com/photo-1585937421612-70a0f2d5c7e1?w=200' },
            { id: 'p2', label: 'Couscous Royal', price: 22, img: 'https://images.unsplash.com/photo-1541518763669-279f00ed8145?w=200' },
            { id: 'p3', label: 'Poisson Grillé', price: 28, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200' },
            { id: 'p4', label: 'Poulet Citron', price: 18, img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200' }
        ],
        Desserts: Array(4).fill({ label: 'Dessert', price: 5, img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200' }),
        Options: Array(4).fill({ label: 'Option', price: 15, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200' })
    });

    const [selections, setSelections] = useState([]);

    // --- 3. LOGIQUE DE CALCUL (BACKEND STYLE) ---
    const totalDevis = useMemo(() => {
        const prixUnitaireAdulte = selections.reduce((sum, item) => sum + Number(item.price), 0);
        const totalAdultes = Number(participants.adultes) * prixUnitaireAdulte;
        const totalEnfants = Number(participants.enfants) * 15;
        return totalAdultes + totalEnfants;
    }, [participants, selections]);

    // --- ACTIONS ---
    const toggleSelection = (item) => {
        if (editMode) return;
        setSelections(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
    };

    const handleEditChange = (cat, index, field, value) => {
        const newData = { ...traiteurData };
        newData[cat][index][field] = value;
        setTraiteurData(newData);
    };

    const saveToFirebase = async () => {
        try {
            await addDoc(collection(db, "contracts"), {
                client, logistique, participants, selections, total: totalDevis, createdAt: serverTimestamp()
            });
            alert("Contrat enregistré !");
        } catch (e) { alert("Erreur Firebase"); }
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-white font-sans pb-32">

            {/* 1. SECTION CLIENT */}
            <section className="mb-10 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h2 className="flex items-center gap-2 text-blue-400 font-bold mb-6 text-xl"><User size={24} /> 1. Informations Client</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input placeholder="Nom" className="bg-slate-900 p-4 rounded-xl outline-none focus:ring-2 ring-blue-500" onChange={e => setClient({ ...client, nom: e.target.value })} />
                    <input placeholder="Prénom" className="bg-slate-900 p-4 rounded-xl outline-none focus:ring-2 ring-blue-500" onChange={e => setClient({ ...client, prenom: e.target.value })} />
                    <input placeholder="Téléphone" className="bg-slate-900 p-4 rounded-xl outline-none focus:ring-2 ring-blue-500" onChange={e => setClient({ ...client, tel: e.target.value })} />
                    <input placeholder="Email" className="bg-slate-900 p-4 rounded-xl outline-none focus:ring-2 ring-blue-500" onChange={e => setClient({ ...client, email: e.target.value })} />
                    <textarea placeholder="Notes particulières" className="md:col-span-2 lg:col-span-4 bg-slate-900 p-4 rounded-xl outline-none h-24" onChange={e => setClient({ ...client, notes: e.target.value })} />
                </div>
            </section>

            {/* 2. SECTION LOGISTIQUE */}
            <section className="mb-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="flex items-center gap-2 text-purple-400 font-bold mb-4"><Calendar /> Jour de l'événement</h2>
                    <div className="flex gap-2">
                        {['Vendredi', 'Samedi', 'Dimanche'].map(j => (
                            <button key={j} onClick={() => setLogistique({ ...logistique, jour: j })} className={`flex-1 py-3 rounded-xl border-2 transition-all ${logistique.jour === j ? 'bg-purple-600 border-purple-400 scale-105' : 'bg-slate-900 border-slate-800 opacity-50'}`}>{j}</button>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="flex items-center gap-2 text-emerald-400 font-bold mb-4"><Home /> Lieu de réception</h2>
                    <div className="flex gap-2">
                        {['Salle Le Tassili', 'Salle HR'].map(s => (
                            <button key={s} onClick={() => setLogistique({ ...logistique, salle: s })} className={`flex-1 py-3 rounded-xl border-2 transition-all ${logistique.salle === s ? 'bg-emerald-600 border-emerald-400 scale-105' : 'bg-slate-900 border-slate-800 opacity-50'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SECTION TRAITEUR (BULLLES) */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="flex items-center gap-2 text-orange-400 font-bold text-xl"><Utensils size={24} /> 3. Sélection Traiteur</h2>
                    <button onClick={() => setEditMode(!editMode)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${editMode ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}`}>
                        {editMode ? <Save size={18} /> : <Edit3 size={18} />} {editMode ? 'Terminer l\'édition' : 'Mode Édition'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Object.entries(traiteurData).map(([cat, items]) => (
                        <div key={cat} className="space-y-4">
                            <h3 className="text-center font-bold text-slate-500 uppercase tracking-widest text-sm">{cat}</h3>
                            {items.map((item, idx) => (
                                <div key={idx} onClick={() => toggleSelection(item)} className={`group relative h-32 rounded-3xl overflow-hidden cursor-pointer border-4 transition-all ${selections.find(i => i.id === item.id) ? 'border-orange-500 scale-105 shadow-xl shadow-orange-500/20' : 'border-slate-800'}`}>
                                    <img src={item.img} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center ${editMode ? 'backdrop-blur-sm' : ''}`}>
                                        {editMode ? (
                                            <div className="space-y-1">
                                                <input className="bg-white/20 rounded px-1 w-full text-xs" value={item.label} onClick={e => e.stopPropagation()} onChange={e => handleEditChange(cat, idx, 'label', e.target.value)} />
                                                <input className="bg-white/20 rounded px-1 w-20 text-xs text-center" value={item.price} onClick={e => e.stopPropagation()} onChange={e => handleEditChange(cat, idx, 'price', e.target.value)} />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-black text-sm uppercase">{item.label}</p>
                                                <p className="text-orange-400 font-bold">{item.price}€</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. CALCULATEUR & FOOTER */}
            <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-4">
                    <div className="bg-slate-900 p-2 rounded-2xl flex items-center gap-3 px-4 border border-slate-800">
                        <span className="text-xs text-slate-500 font-bold">ADULTES</span>
                        <input type="number" className="bg-transparent w-16 text-xl font-bold text-blue-400 outline-none" value={participants.adultes} onChange={e => setParticipants({ ...participants, adultes: e.target.value })} />
                    </div>
                    <div className="bg-slate-900 p-2 rounded-2xl flex items-center gap-3 px-4 border border-slate-800">
                        <span className="text-xs text-slate-500 font-bold">ENFANTS</span>
                        <input type="number" className="bg-transparent w-16 text-xl font-bold text-purple-400 outline-none" value={participants.enfants} onChange={e => setParticipants({ ...participants, enfants: e.target.value })} />
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Total Estimé</p>
                        <p className="text-4xl font-black text-white">{totalDevis}€</p>
                    </div>
                    <button onClick={saveToFirebase} className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95">
                        <CheckCircle size={24} /> ENREGISTRER LE DEVIS
                    </button>
                </div>
            </footer>
        </div>
    );
}