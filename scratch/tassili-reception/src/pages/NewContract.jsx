import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Save, User, Phone, Mail, MapPin, Calendar, Users, StickyNote, Utensils, Home, PlusCircle } from 'lucide-react';

export default function NewContract() {
    // --- ÉTATS POUR LA SAISIE FLUIDE (TEXTE) ---
    const [localClient, setLocalClient] = useState({
        name: '', phone: '', email: '', address: '', eventDate: '', notes: ''
    });

    // --- ÉTATS POUR LE SIMULATEUR (BULLES) ---
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [options, setOptions] = useState([]);

    // --- DONNÉES DU SIMULATEUR ---
    const menus = [
        { id: 'buffet', label: 'Buffet Dinatoire', price: 45 },
        { id: 'service', label: 'Service à l\'assiette', price: 65 },
        { id: 'cocktail', label: 'Cocktail Prestige', price: 55 }
    ];

    const rooms = [
        { id: 'tassili', label: 'Salle Tassili', price: 1500 },
        { id: 'atlas', label: 'Salle Atlas', price: 1200 }
    ];

    const extraOptions = [
        { id: 'deco', label: 'Décoration Florale', price: 300 },
        { id: 'dj', label: 'DJ & Sonorisation', price: 500 },
        { id: 'photo', label: 'Photographe', price: 450 }
    ];

    // --- CALCUL DU TOTAL (HT) ---
    const totalAmount = useMemo(() => {
        let total = (adults * (selectedMenu ? selectedMenu.price : 0)) + (children * 15);
        if (selectedRoom) total += selectedRoom.price;
        const optionsPrice = options.reduce((sum, opt) => sum + opt.price, 0);
        return total + optionsPrice;
    }, [adults, children, selectedMenu, selectedRoom, options]);

    // --- FONCTIONS ACTIONS ---
    const toggleOption = (opt) => {
        setOptions(prev => prev.find(o => o.id === opt.id) ? prev.filter(o => o.id !== opt.id) : [...prev, opt]);
    };

    const handleTextChange = (field, value) => {
        setLocalClient(prev => ({ ...prev, [field]: value }));
    };

    const saveToFirebase = async () => {
        if (!localClient.name) return alert("Nom client requis");
        try {
            await addDoc(collection(db, "contracts"), {
                ...localClient,
                adults, children,
                menu: selectedMenu?.label,
                room: selectedRoom?.label,
                totalAmount,
                status: 'Visite',
                createdAt: serverTimestamp()
            });
            alert("✅ Enregistré avec succès !");
        } catch (e) { alert("❌ Erreur"); }
    };

    return (
        <div className="p-4 bg-slate-950 min-h-screen text-white pb-40">
            <h1 className="text-2xl font-bold mb-6 text-blue-400">Nouveau Contrat</h1>

            {/* INFOS CLIENTS (FLUIDES) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <input placeholder="Nom du Client" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.name} onChange={e => handleTextChange('name', e.target.value)} />
                <input placeholder="Téléphone" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.phone} onChange={e => handleTextChange('phone', e.target.value)} />
                <textarea placeholder="Notes particulières..." className="md:col-span-2 bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.notes} onChange={e => handleTextChange('notes', e.target.value)} />
            </div>

            {/* NOMBRE D'INVITÉS */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">ADULTES</p>
                    <input type="number" className="bg-transparent text-2xl font-bold w-full text-center outline-none text-blue-400" value={adults} onChange={e => setAdults(parseInt(e.target.value) || 0)} />
                </div>
                <div className="flex-1 bg-slate-900 p-4 rounded-2xl text-center border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">ENFANTS (15€)</p>
                    <input type="number" className="bg-transparent text-2xl font-bold w-full text-center outline-none text-purple-400" value={children} onChange={e => setChildren(parseInt(e.target.value) || 0)} />
                </div>
            </div>

            {/* SÉLECTION TRAITEUR (BULLES) */}
            <h2 className="flex items-center gap-2 mb-4 text-slate-400"><Utensils size={18} /> Menus Traiteur</h2>
            <div className="flex flex-wrap gap-3 mb-8">
                {menus.map(m => (
                    <button key={m.id} onClick={() => setSelectedMenu(m)} className={`px-6 py-3 rounded-full border transition-all ${selectedMenu?.id === m.id ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        {m.label} ({m.price}€)
                    </button>
                ))}
            </div>

            {/* SALLES ET OPTIONS */}
            <h2 className="flex items-center gap-2 mb-4 text-slate-400"><Home size={18} /> Salles & Options</h2>
            <div className="flex flex-wrap gap-3">
                {rooms.map(r => (
                    <button key={r.id} onClick={() => setSelectedRoom(r)} className={`px-6 py-3 rounded-full border transition-all ${selectedRoom?.id === r.id ? 'bg-purple-600 border-purple-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        {r.label}
                    </button>
                ))}
                {extraOptions.map(o => (
                    <button key={o.id} onClick={() => toggleOption(o)} className={`px-6 py-3 rounded-full border transition-all ${options.find(opt => opt.id === o.id) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        + {o.label}
                    </button>
                ))}
            </div>

            {/* BOUTON FIXE */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800">
                <button onClick={saveToFirebase} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-5 rounded-2xl font-bold text-xl shadow-2xl active:scale-95 transition-all">
                    ENREGISTRER LE DEVIS ({totalAmount}€)
                </button>
            </div>
        </div>
    );
}