import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Phone, Mail, StickyNote, Utensils, Home, Calculator, Calendar, Users } from 'lucide-react';

export default function NewContract() {
    const [localClient, setLocalClient] = useState({ name: '', phone: '', email: '', notes: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [dayType, setDayType] = useState('Samedi');
    const [menuSelection, setMenuSelection] = useState({ entree: null, plat: null, dessert: null });

    const rooms = [
        { id: 'tassili', label: 'Salle Tassili', price: 1500 },
        { id: 'hr', label: 'HR Reception', price: 1800 }
    ];

    const menuItems = {
        entrees: [{ id: 'e1', label: 'Salade Royale', price: 8 }, { id: 'e2', label: 'Pastilla', price: 12 }],
        plats: [{ id: 'p1', label: 'Tagine Agneau', price: 25 }, { id: 'p2', label: 'Couscous Chef', price: 20 }],
        desserts: [{ id: 'd1', label: 'Fruits de saison', price: 5 }, { id: 'd2', label: 'Thé & Pâtisseries', price: 7 }]
    };

    // --- CALCULATEUR DYNAMIQUE AVEC ENFANTS À 15€ ---
    const totals = useMemo(() => {
        const menuPrice = (menuSelection.entree?.price || 0) + (menuSelection.plat?.price || 0) + (menuSelection.dessert?.price || 0);

        // Calcul : (Adultes * Prix Menu) + (Enfants * 15€)
        const baseTraiteur = (Number(adults) * menuPrice) + (Number(children) * 15);

        let roomPrice = selectedRoom?.price || 0;
        if (dayType === 'Vendredi') roomPrice -= 200; // Remise Vendredi

        return {
            menuPerAdult: menuPrice,
            totalChildren: Number(children) * 15,
            total: baseTraiteur + roomPrice
        };
    }, [adults, children, selectedRoom, dayType, menuSelection]);

    const saveToFirebase = async () => {
        if (!localClient.name) return alert("Le nom du client est obligatoire");
        try {
            await addDoc(collection(db, "contracts"), {
                ...localClient,
                adults: Number(adults),
                children: Number(children),
                total: totals.total,
                dayType,
                room: selectedRoom?.label,
                createdAt: serverTimestamp()
            });
            alert("✅ Devis enregistré !");
        } catch (e) { alert("Erreur d'enregistrement"); }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-white">
            <div className="flex-1 p-6 pb-40">
                <h1 className="text-3xl font-bold mb-8 text-blue-400 font-serif italic text-center lg:text-left">Nouveau Contrat</h1>

                {/* BLOC CLIENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <input placeholder="Nom du Client" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.name} onChange={e => setLocalClient({ ...localClient, name: e.target.value })} />
                    <input placeholder="Téléphone" className="bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.phone} onChange={e => setLocalClient({ ...localClient, phone: e.target.value })} />
                    <textarea placeholder="Notes particulières..." className="md:col-span-2 bg-slate-900 p-4 rounded-xl border border-slate-800 outline-none focus:border-blue-500" value={localClient.notes} onChange={e => setLocalClient({ ...localClient, notes: e.target.value })} />
                </div>

                {/* NOMBRE D'INVITÉS */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300"><Users size={20} /> Nombre d'invités</h2>
                <div className="flex gap-4 mb-10">
                    <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <label className="text-xs text-slate-500 block mb-1">ADULTES</label>
                        <input type="number" className="bg-transparent text-xl font-bold w-full outline-none text-blue-400" value={adults} onChange={e => setAdults(e.target.value)} />
                    </div>
                    <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <label className="text-xs text-slate-500 block mb-1">ENFANTS (15€)</label>
                        <input type="number" className="bg-transparent text-xl font-bold w-full outline-none text-purple-400" value={children} onChange={e => setChildren(e.target.value)} />
                    </div>
                </div>

                {/* JOUR & SALLE */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300"><Calendar size={20} /> Jour & Salle</h2>
                <div className="flex gap-3 mb-6">
                    {['Vendredi', 'Samedi', 'Dimanche'].map(day => (
                        <button key={day} onClick={() => setDayType(day)} className={`px-6 py-3 rounded-xl border transition-all ${dayType === day ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-800'}`}>{day}</button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-10">
                    {rooms.map(r => (
                        <button key={r.id} onClick={() => setSelectedRoom(r)} className={`p-4 rounded-2xl border-4 transition-all ${selectedRoom?.id === r.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-800 bg-slate-900'}`}>
                            <p className="font-bold">{r.label}</p>
                            <p className="text-xs text-slate-500">{r.price}€</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* CALCULATEUR LATÉRAL */}
            <div className="lg:w-96 bg-slate-900 p-8 border-l border-slate-800 shadow-2xl">
                <div className="sticky top-6">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-blue-400"><Calculator /> Récapitulatif</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between text-slate-400"><span>Menu Adultes</span><span>{adults * totals.menuPerAdult}€</span></div>
                        <div className="flex justify-between text-slate-400"><span>Enfants (15€)</span><span>{totals.totalChildren}€</span></div>
                        <div className="flex justify-between text-slate-400"><span>Salle {selectedRoom?.label}</span><span>{selectedRoom?.price || 0}€</span></div>
                        {dayType === 'Vendredi' && <div className="flex justify-between text-emerald-400 font-bold"><span>Remise Vendredi</span><span>-200€</span></div>}
                        <div className="pt-6 border-t border-slate-700">
                            <p className="text-slate-500 text-sm uppercase">Total Estimation</p>
                            <p className="text-5xl font-black text-blue-500">{totals.total}€</p>
                        </div>
                        <button onClick={saveToFirebase} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-bold text-xl mt-10 transition-all shadow-lg active:scale-95">ENREGISTRER</button>
                    </div>
                </div>
            </div>
        </div>
    );
}