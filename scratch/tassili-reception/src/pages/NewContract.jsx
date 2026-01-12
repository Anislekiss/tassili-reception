import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Phone, Mail, StickyNote, Utensils, Home, Calculator, Calendar } from 'lucide-react';

export default function NewContract() {
    const [localClient, setLocalClient] = useState({ name: '', phone: '', email: '', notes: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [dayType, setDayType] = useState('Samedi'); // Option Vendredi/Samedi
    const [selectedOptions, setSelectedOptions] = useState([]);

    const rooms = [
        { id: 'tassili', label: 'Salle Tassili', price: 1500, img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400' },
        { id: 'hr', label: 'HR Reception', price: 1800, img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400' }
    ];

    const extraOptions = [
        { id: 'deco', label: 'Décoration', price: 300 },
        { id: 'photo', label: 'Photographe', price: 450 },
        { id: 'dj', label: 'Animation DJ', price: 500 }
    ];

    const totalHT = useMemo(() => {
        let total = (Number(adults) * 50) + (Number(children) * 15);
        if (selectedRoom) total += selectedRoom.price;
        if (dayType === 'Vendredi') total -= 200; // Exemple de remise pour le vendredi
        selectedOptions.forEach(opt => total += opt.price);
        return total;
    }, [adults, children, selectedRoom, dayType, selectedOptions]);

    const toggleOption = (opt) => {
        setSelectedOptions(prev => prev.find(o => o.id === opt.id) ? prev.filter(o => o.id !== opt.id) : [...prev, opt]);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-white">
            <div className="flex-1 p-6 pb-40">
                <h1 className="text-3xl font-bold mb-8 text-blue-400 font-serif italic">Nouveau Contrat</h1>

                {/* INFOS CLIENTS COMPLETES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <User className="text-blue-500" size={20} />
                        <input placeholder="Nom du Client" className="bg-transparent outline-none w-full" value={localClient.name} onChange={e => setLocalClient({ ...localClient, name: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <Phone className="text-blue-500" size={20} />
                        <input placeholder="Téléphone" className="bg-transparent outline-none w-full" value={localClient.phone} onChange={e => setLocalClient({ ...localClient, phone: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <Mail className="text-blue-500" size={20} />
                        <input placeholder="Adresse Email" className="bg-transparent outline-none w-full" value={localClient.email} onChange={e => setLocalClient({ ...localClient, email: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <StickyNote className="text-blue-500" size={20} />
                        <textarea placeholder="Notes particulières..." className="bg-transparent outline-none w-full h-10" value={localClient.notes} onChange={e => setLocalClient({ ...localClient, notes: e.target.value })} />
                    </div>
                </div>

                {/* OPTIONS JOURS */}
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar size={20} /> Type d'événement</h2>
                <div className="flex gap-4 mb-8">
                    {['Vendredi', 'Samedi', 'Dimanche'].map(day => (
                        <button key={day} onClick={() => setDayType(day)} className={`px-6 py-3 rounded-full border transition-all ${dayType === day ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            {day}
                        </button>
                    ))}
                </div>

                {/* SALLES ET TRAITEUR */}
                <h2 className="text-lg font-bold mb-4">Salles & Options</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {rooms.map(r => (
                        <button key={r.id} onClick={() => setSelectedRoom(r)} className={`relative h-32 rounded-2xl overflow-hidden border-4 transition-all ${selectedRoom?.id === r.id ? 'border-blue-500 scale-105' : 'border-transparent opacity-50'}`}>
                            <img src={r.img} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center font-bold">{r.label}</div>
                        </button>
                    ))}
                    {extraOptions.map(opt => (
                        <button key={opt.id} onClick={() => toggleOption(opt)} className={`p-4 rounded-2xl border transition-all ${selectedOptions.find(o => o.id === opt.id) ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                            + {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CALCULATEUR SUR LE CÔTÉ */}
            <div className="lg:w-96 bg-slate-900/50 backdrop-blur-md p-8 border-l border-slate-800 hidden lg:block">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-blue-400"><Calculator /> Devis en direct</h2>
                <div className="space-y-6">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Base Invités</span>
                        <span className="font-bold">{(Number(adults) * 50) + (Number(children) * 15)}€</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Salle & Jour ({dayType})</span>
                        <span className="font-bold">{selectedRoom?.price || 0}€</span>
                    </div>
                    <div className="pt-10 text-center">
                        <p className="text-slate-500 text-sm uppercase">Total Estimation</p>
                        <p className="text-5xl font-black text-blue-500">{totalHT}€</p>
                    </div>
                </div>
            </div>
        </div>
    );
}