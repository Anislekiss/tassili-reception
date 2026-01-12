import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Save, User, Phone, Mail, MapPin, Calendar, Users, StickyNote } from 'lucide-react';

export default function NewContract() {
    // --- ÉTATS POUR LA SAISIE FLUIDE (LOCALE) ---
    const [localClient, setLocalClient] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        eventDate: '',
        notes: '' // Nouveau champ Notes
    });

    // --- ÉTATS POUR LE CALCULATEUR ---
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);

    // --- CALCUL DU TOTAL (HT) ---
    const totalHT = (adults * 50) + (children * 15);

    // --- FONCTION DE SAUVEGARDE FIREBASE ---
    const saveQuoteToFirebase = async () => {
        if (!localClient.name) {
            alert("Veuillez saisir au moins le nom du client.");
            return;
        }

        try {
            const contractData = {
                clientName: localClient.name,
                clientPhone: localClient.phone,
                clientEmail: localClient.email,
                clientAddress: localClient.address,
                eventDate: localClient.eventDate,
                notes: localClient.notes, // Sauvegarde des notes
                adults: adults,
                children: children,
                totalAmount: totalHT,
                status: 'Visite',
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "contracts"), contractData);
            alert("✅ Devis enregistré avec succès !");

            // Réinitialisation complète
            setLocalClient({ name: '', phone: '', email: '', address: '', eventDate: '', notes: '' });
            setAdults(0);
            setChildren(0);

        } catch (error) {
            console.error("Erreur Firebase:", error);
            alert("❌ Erreur lors de l'enregistrement.");
        }
    };

    const handleTextChange = (field, value) => {
        setLocalClient(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white pb-36">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Nouveau Contrat
            </h1>

            {/* SECTION CLIENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <label className="flex items-center gap-2 mb-2 text-slate-400 text-sm"><User size={16} /> Nom du Client</label>
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                        value={localClient.name}
                        onChange={(e) => handleTextChange('name', e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <label className="flex items-center gap-2 mb-2 text-slate-400 text-sm"><Phone size={16} /> Téléphone</label>
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                        value={localClient.phone}
                        onChange={(e) => handleTextChange('phone', e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <label className="flex items-center gap-2 mb-2 text-slate-400 text-sm"><Calendar size={16} /> Date de l'événement</label>
                    <input
                        type="date"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                        value={localClient.eventDate}
                        onChange={(e) => handleTextChange('eventDate', e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <label className="flex items-center gap-2 mb-2 text-slate-400 text-sm"><StickyNote size={16} /> Notes particulières</label>
                    <textarea
                        rows="1"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 resize-none"
                        placeholder="Détails, allergies, horaires..."
                        value={localClient.notes}
                        onChange={(e) => handleTextChange('notes', e.target.value)}
                    />
                </div>
            </div>

            {/* SECTION INVITÉS */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-8">
                <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-300"><Users size={20} /> Nombre d'invités</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 text-center">
                        <label className="block text-slate-500 text-xs mb-2 uppercase font-bold">Adultes (50€)</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-3xl font-bold text-blue-400 text-center outline-none"
                            value={adults}
                            onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 text-center">
                        <label className="block text-slate-500 text-xs mb-2 uppercase font-bold">Enfants (15€)</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-3xl font-bold text-purple-400 text-center outline-none"
                            value={children}
                            onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </div>

            {/* BOUTON FIXE */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 z-50">
                <button
                    onClick={saveQuoteToFirebase}
                    className="w-full max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
                >
                    <Save size={24} /> ENREGISTRER ({totalHT}€)
                </button>
            </div>
        </div>
    );
}