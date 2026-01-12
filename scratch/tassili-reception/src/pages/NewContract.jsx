import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Utensils, Home, Camera, Music, Flower2 } from 'lucide-react';

export default function NewContract() {
    const [localClient, setLocalClient] = useState({ name: '', notes: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // --- CONFIGURATION AVEC VOS IMAGES ---
    const menus = [
        { id: 'buffet', label: 'Buffet Prestige', price: 45, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400' },
        { id: 'assiette', label: 'Service Assiette', price: 65, image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400' }
    ];

    const rooms = [
        { id: 'tassili', label: 'Salle Tassili', price: 1500, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
        { id: 'atlas', label: 'Salle Atlas', price: 1200, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' }
    ];

    // --- LOGIQUE DE CALCUL ---
    const totalAmount = useMemo(() => {
        let total = (Number(adults) * (selectedMenu?.price || 0)) + (Number(children) * 15);
        if (selectedRoom) total += selectedRoom.price;
        selectedOptions.forEach(opt => total += opt.price);
        return total;
    }, [adults, children, selectedMenu, selectedRoom, selectedOptions]);

    const saveToFirebase = async () => {
        if (!localClient.name) return alert("Veuillez saisir le nom du client");
        try {
            await addDoc(collection(db, "contracts"), {
                clientName: localClient.name,
                notes: localClient.notes,
                totalAmount,
                status: 'Visite',
                createdAt: serverTimestamp()
            });
            alert("✅ Devis enregistré !");
        } catch (e) { alert("Erreur de connexion"); }
    };

    return (
        <div className="p-6 bg-slate-950 min-h-screen text-white pb-40">
            <h1 className="text-3xl font-bold mb-8 text-blue-400">Nouveau Contrat</h1>

            {/* CHAMPS TEXTE */}
            <div className="grid gap-4 mb-10">
                <input
                    placeholder="Nom du Client"
                    className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 outline-none focus:border-blue-500 text-lg"
                    value={localClient.name}
                    onChange={e => setLocalClient({ ...localClient, name: e.target.value })}
                />
                <textarea
                    placeholder="Notes particulières..."
                    className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 outline-none focus:border-blue-500 h-32"
                    value={localClient.notes}
                    onChange={e => setLocalClient({ ...localClient, notes: e.target.value })}
                />
            </div>

            {/* SÉLECTION MENUS AVEC PHOTOS */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Utensils className="text-blue-500" /> Menus Traiteur</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {menus.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setSelectedMenu(m)}
                        className={`relative overflow-hidden rounded-3xl aspect-square border-4 transition-all ${selectedMenu?.id === m.id ? 'border-blue-500 scale-105 shadow-xl shadow-blue-500/20' : 'border-transparent opacity-60'}`}
                    >
                        <img src={m.image} alt={m.label} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                            <p className="font-bold text-sm">{m.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* SÉLECTION SALLES AVEC PHOTOS */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Home className="text-purple-500" /> Nos Salles</h2>
            <div className="grid grid-cols-2 gap-4 mb-10">
                {rooms.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setSelectedRoom(r)}
                        className={`relative h-40 overflow-hidden rounded-3xl border-4 transition-all ${selectedRoom?.id === r.id ? 'border-purple-500 scale-105 shadow-xl shadow-purple-500/20' : 'border-transparent opacity-60'}`}
                    >
                        <img src={r.image} alt={r.label} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                            <p className="font-extrabold text-xl uppercase tracking-widest">{r.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* BOUTON FIXE */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900">
                <button
                    onClick={saveToFirebase}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 rounded-2xl font-black text-2xl shadow-2xl active:scale-95 transition-all"
                >
                    ENREGISTRER ({totalAmount}€)
                </button>
            </div>
        </div>
    );
}