import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Utensils, Home, User, Phone, StickyNote } from 'lucide-react';

export default function NewContract() {
    // --- ÉTATS ---
    const [localClient, setLocalClient] = useState({ name: '', phone: '', notes: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // --- DONNÉES ---
    const menus = [
        { id: 'buffet', label: 'Buffet', price: 45 },
        { id: 'service', label: 'Assiette', price: 65 }
    ];
    const rooms = [
        { id: 'tassili', label: 'Tassili', price: 1500 },
        { id: 'atlas', label: 'Atlas', price: 1200 }
    ];
    const extraOptions = [
        { id: 'deco', label: 'Déco', price: 300 },
        { id: 'dj', label: 'DJ', price: 500 }
    ];

    // --- CALCULS (Sécurisés) ---
    const totalAmount = useMemo(() => {
        let total = (Number(adults) * (selectedMenu?.price || 0)) + (Number(children) * 15);
        if (selectedRoom) total += selectedRoom.price;
        selectedOptions.forEach(opt => { total += opt.price; });
        return total;
    }, [adults, children, selectedMenu, selectedRoom, selectedOptions]);

    // --- LOGIQUE SANS BUG ---
    const handleOptionToggle = (opt) => {
        setSelectedOptions(prev =>
            prev.find(o => o.id === opt.id)
                ? prev.filter(o => o.id !== opt.id)
                : [...prev, opt]
        );
    };

    const saveToFirebase = async () => {
        if (!localClient.name) return alert("Nom requis");
        try {
            await addDoc(collection(db, "contracts"), {
                clientName: localClient.name,
                clientPhone: localClient.phone,
                notes: localClient.notes,
                totalAmount,
                createdAt: serverTimestamp()
            });
            alert("✅ Enregistré !");
        } catch (e) { alert("Erreur Firebase"); }
    };

    return (
        <div className="p-4 bg-slate-950 min-h-screen text-white pb-40">
            <h1 className="text-2xl font-bold mb-6 text-blue-400">Nouveau Contrat</h1>

            {/* CLIENT */}
            <div className="grid gap-3 mb-6">
                <input
                    placeholder="Nom du Client"
                    className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500"
                    value={localClient.name}
                    onChange={e => setLocalClient({ ...localClient, name: e.target.value })}
                />
                <textarea
                    placeholder="Notes..."
                    className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500"
                    value={localClient.notes}
                    onChange={e => setLocalClient({ ...localClient, notes: e.target.value })}
                />
            </div>

            {/* INVITÉS */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <label className="text-xs text-slate-500 block mb-1">ADULTES</label>
                    <input type="number" className="bg-transparent text-xl font-bold w-full outline-none text-blue-400" value={adults} onChange={e => setAdults(e.target.value)} />
                </div>
                <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <label className="text-xs text-slate-500 block mb-1">ENFANTS</label>
                    <input type="number" className="bg-transparent text-xl font-bold w-full outline-none text-purple-400" value={children} onChange={e => setChildren(e.target.value)} />
                </div>
            </div>

            {/* MENUS (BULLES) */}
            <div className="mb-6">
                <p className="text-slate-500 text-sm mb-3">MENU</p>
                <div className="flex flex-wrap gap-2">
                    {menus.map(m => (
                        <button key={m.id} onClick={() => setSelectedMenu(m)} className={`px-4 py-2 rounded-full border transition-all ${selectedMenu?.id === m.id ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* OPTIONS (BULLES) */}
            <div className="mb-6">
                <p className="text-slate-500 text-sm mb-3">OPTIONS</p>
                <div className="flex flex-wrap gap-2">
                    {extraOptions.map(o => (
                        <button key={o.id} onClick={() => handleOptionToggle(o)} className={`px-4 py-2 rounded-full border transition-all ${selectedOptions.find(opt => opt.id === o.id) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            + {o.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* BOUTON FIXE */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800">
                <button onClick={saveToFirebase} className="w-full bg-blue-600 py-4 rounded-xl font-bold text-lg active:scale-95 transition-all">
                    ENREGISTRER ({totalAmount}€)
                </button>
            </div>
        </div>
    );
}