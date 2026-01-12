import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Save, User, Phone, StickyNote, Utensils, Home, Camera, Music, Flower2 } from 'lucide-react';

export default function NewContract() {
    const [localClient, setLocalClient] = useState({ name: '', phone: '', notes: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // --- VOS VRAIES DONNÉES ---
    const menus = [
        { id: 'buffet', label: 'Buffet Prestige', price: 45, icon: <Utensils size={20} /> },
        { id: 'assiette', label: 'Service Assiette', price: 65, icon: <Utensils size={20} /> }
    ];
    const rooms = [
        { id: 'tassili', label: 'Salle Tassili', price: 1500, icon: <Home size={20} /> },
        { id: 'atlas', label: 'Salle Atlas', price: 1200, icon: <Home size={20} /> }
    ];
    const extras = [
        { id: 'deco', label: 'Décoration', price: 300, icon: <Flower2 size={20} /> },
        { id: 'dj', label: 'Animation DJ', price: 500, icon: <Music size={20} /> },
        { id: 'photo', label: 'Photographe', price: 450, icon: <Camera size={20} /> }
    ];

    const totalHT = useMemo(() => {
        let total = (Number(adults) * (selectedMenu?.price || 0)) + (Number(children) * 15);
        if (selectedRoom) total += selectedRoom.price;
        selectedOptions.forEach(opt => total += opt.price);
        return total;
    }, [adults, children, selectedMenu, selectedRoom, selectedOptions]);

    const toggleOption = (opt) => {
        setSelectedOptions(prev => prev.find(o => o.id === opt.id) ? prev.filter(o => o.id !== opt.id) : [...prev, opt]);
    };

    const saveContract = async () => {
        if (!localClient.name) return alert("Nom du client obligatoire");
        try {
            await addDoc(collection(db, "contracts"), {
                ...localClient, adults, children,
                total: totalHT, createdAt: serverTimestamp()
            });
            alert("✅ Devis enregistré !");
        } catch (e) { alert("Erreur lors de l'enregistrement"); }
    };

    return (
        <div className="p-4 bg-slate-950 min-h-screen text-white pb-40">
            <h1 className="text-2xl font-bold mb-6 text-blue-400">Nouveau Contrat</h1>

            {/* SAISIE TEXTE FLUIDE */}
            <div className="grid gap-3 mb-6">
                <input placeholder="Nom du Client" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.name} onChange={e => setLocalClient({ ...localClient, name: e.target.value })} />
                <textarea placeholder="Notes particulières..." className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.notes} onChange={e => setLocalClient({ ...localClient, notes: e.target.value })} />
            </div>

            {/* INVITÉS */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 mb-1 font-bold">ADULTES</p>
                    <input type="number" className="bg-transparent text-2xl font-bold w-full text-center outline-none text-blue-400" value={adults} onChange={e => setAdults(e.target.value)} />
                </div>
                <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 mb-1 font-bold">ENFANTS (15€)</p>
                    <input type="number" className="bg-transparent text-2xl font-bold w-full text-center outline-none text-purple-400" value={children} onChange={e => setChildren(e.target.value)} />
                </div>
            </div>

            {/* MENUS TRAITEUR */}
            <h2 className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-wider">Menus Traiteur</h2>
            <div className="flex flex-wrap gap-3 mb-8">
                {menus.map(m => (
                    <button key={m.id} onClick={() => setSelectedMenu(m)} className={`px-6 py-4 rounded-2xl border transition-all flex items-center gap-3 ${selectedMenu?.id === m.id ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                        {m.icon} <span className="font-bold">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* SALLES ET OPTIONS */}
            <h2 className="text-slate-500 text-sm font-bold mb-4 uppercase tracking-wider">Salles & Options</h2>
            <div className="flex flex-wrap gap-3">
                {rooms.map(r => (
                    <button key={r.id} onClick={() => setSelectedRoom(r)} className={`px-6 py-4 rounded-2xl border transition-all flex items-center gap-3 ${selectedRoom?.id === r.id ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-900/20' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                        {r.icon} <span className="font-bold">{r.label}</span>
                    </button>
                ))}
                {extras.map(e => (
                    <button key={e.id} onClick={() => toggleOption(e)} className={`px-6 py-4 rounded-2xl border transition-all flex items-center gap-3 ${selectedOptions.find(o => o.id === e.id) ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-900/20' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                        {e.icon} <span className="font-bold">{e.label}</span>
                    </button>
                ))}
            </div>

            {/* BOUTON D'ENREGISTREMENT FIXE */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-900">
                <button onClick={saveContract} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-2xl">
                    ENREGISTRER LE DEVIS ({totalHT}€)
                </button>
            </div>
        </div>
    );
}