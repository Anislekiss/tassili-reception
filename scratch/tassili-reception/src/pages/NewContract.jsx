import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Edit3, Save, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewContract() {
    const [editMode, setEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [traiteurData, setTraiteurData] = useState({ Entrées: [], Plats: [], Desserts: [], Options: [] });
    const [participants, setParticipants] = useState({ adultes: 0, enfants: 0 });
    const [selections, setSelections] = useState([]);

    // 1. CHARGEMENT SÉCURISÉ
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "config", "traiteur"), (docSnap) => {
            if (docSnap.exists()) setTraiteurData(docSnap.data());
        }, (error) => {
            console.error("Erreur de lecture Firebase:", error);
            alert("Erreur de connexion à la base de données.");
        });
        return () => unsub();
    }, []);

    // 2. COMPRESSION & UPLOAD D'IMAGE SANS CRASH
    const handleFileUpload = async (file) => {
        if (!file) return;

        // Sécurité : Format
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            return alert("Format invalide. Utilisez JPG ou PNG.");
        }

        // Sécurité : Taille (max 2Mo avant compression)
        if (file.size > 2 * 1024 * 1024) {
            return alert("Image trop lourde. Choisissez une image de moins de 2Mo.");
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; // Optimisation pour éviter les crashs
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Qualité 70%
                setEditingItem({ ...editingItem, img: optimizedBase64 });
            };
        };
    };

    // 3. SAUVEGARDE CRUD ROBUSTE
    const saveChange = async () => {
        try {
            const category = Object.keys(traiteurData).find(cat =>
                traiteurData[cat].find(i => i.id === editingItem.id)
            );

            const newData = {
                ...traiteurData,
                [category]: traiteurData[category].map(i => i.id === editingItem.id ? editingItem : i)
            };

            await setDoc(doc(db, "config", "traiteur"), newData);
            setEditingItem(null);
        } catch (err) {
            console.error(err);
            alert("Le navigateur a rencontré un problème lors de la sauvegarde. Essayez une image plus petite.");
        }
    };

    // CALCULATEUR
    const totalDevis = useMemo(() => {
        const prixPlats = selections.reduce((sum, item) => sum + Number(item.price || 0), 0);
        return (Number(participants.adultes) * prixPlats) + (Number(participants.enfants) * 15);
    }, [participants, selections, traiteurData]);

    return (
        <div className="p-4 bg-[#020617] min-h-screen text-white pb-40">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-black text-blue-500 uppercase">Édition Contrat</h1>
                <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${editMode ? 'bg-red-600' : 'bg-slate-800'}`}
                >
                    {editMode ? "Quitter l'édition" : "Modifier les bulles"}
                </button>
            </div>

            {/* GRILLE DES BULLLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(traiteurData).map(([cat, items]) => (
                    <div key={cat} className="space-y-4">
                        <h3 className="text-center font-bold text-slate-500 text-[10px] uppercase tracking-widest">{cat}</h3>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => editMode ? setEditingItem(item) : setSelections(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item])}
                                className={`relative h-40 rounded-[2rem] overflow-hidden cursor-pointer border-4 transition-all duration-200 ${selections.find(i => i.id === item.id) ? 'border-blue-500 scale-105' : 'border-slate-800'}`}
                            >
                                <img src={item.img || 'https://via.placeholder.com/400x300?text=No+Image'} className="absolute inset-0 w-full h-full object-cover" alt="" />
                                <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center ${editMode ? 'bg-black/70' : ''}`}>
                                    <p className="font-black text-xs uppercase">{item.label}</p>
                                    <p className="text-blue-400 font-black text-xl">{item.price}€</p>
                                    {editMode && <div className="mt-2 bg-white/20 p-2 rounded-full"><Edit3 size={14} /></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* MODALE D'ÉDITION SÉCURISÉE */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] w-full max-w-sm">
                        <div className="flex justify-between mb-6">
                            <h2 className="font-bold uppercase text-blue-400">Modifier Bulle</h2>
                            <button onClick={() => setEditingItem(null)}><X /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="relative h-40 rounded-2xl overflow-hidden border-2 border-slate-700">
                                <img src={editingItem.img} className="w-full h-full object-cover" alt="" />
                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all">
                                    <Upload size={30} />
                                    <span className="text-[10px] mt-2 font-bold">CHANGER IMAGE</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} />
                                </label>
                            </div>

                            <input
                                className="w-full bg-slate-800 p-4 rounded-xl outline-none border border-slate-700 focus:border-blue-500"
                                value={editingItem.label}
                                onChange={e => setEditingItem({ ...editingItem, label: e.target.value })}
                            />

                            <div className="flex items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                                <span className="font-bold text-slate-500 mr-4">PRIX (€)</span>
                                <input
                                    type="number"
                                    className="bg-transparent w-full text-right text-blue-400 font-bold text-xl outline-none"
                                    value={editingItem.price}
                                    onChange={e => setEditingItem({ ...editingItem, price: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={saveChange}
                                className="w-full bg-blue-600 py-4 rounded-xl font-black text-white shadow-xl shadow-blue-600/20"
                            >
                                SAUVEGARDER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER CALCULATEUR */}
            <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 p-4 flex justify-between items-center z-50">
                <div className="flex gap-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Adultes</p>
                        <input type="number" className="bg-transparent w-10 text-xl font-bold outline-none" value={participants.adultes} onChange={e => setParticipants({ ...participants, adultes: e.target.value })} />
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Enfants (15€)</p>
                        <input type="number" className="bg-transparent w-10 text-xl font-bold outline-none" value={participants.enfants} onChange={e => setParticipants({ ...participants, enfants: e.target.value })} />
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black">{totalDevis}€</p>
                    <button className="bg-blue-600 px-8 py-3 rounded-xl font-black text-sm mt-2">VALIDER</button>
                </div>
            </footer>
        </div>
    );
}