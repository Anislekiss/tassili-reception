import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Save, User, Calendar, Users, Phone, Mail, MapPin, Download } from 'lucide-react';

export default function NewContract() {
    // ÉTATS POUR LE CALCULATEUR
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [eventDate, setEventDate] = useState('');
    const [clientInfo, setClientInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    // OPTIONS (Exemple simplifié, gardez vos données actuelles ici)
    const [selectedOptions, setSelectedOptions] = useState([]);

    // CALCULS
    const totalHT = (adults * 50) + (children * 15); // Exemple de calcul

    // --- FONCTION DE SAUVEGARDE FIREBASE ---
    const saveQuoteToFirebase = async () => {
        if (!clientInfo.name) {
            alert("Veuillez au moins saisir le nom du client.");
            return;
        }

        try {
            const contractData = {
                clientName: clientInfo.name,
                clientEmail: clientInfo.email,
                clientPhone: clientInfo.phone,
                clientAddress: clientInfo.address,
                adults: adults,
                children: children,
                eventDate: eventDate,
                totalAmount: totalHT,
                status: 'Visite',
                createdAt: serverTimestamp(),
            };

            // Envoi vers Firebase
            const docRef = await addDoc(collection(db, "contracts"), contractData);

            alert("✅ Enregistré sur Firebase ! ID: " + docRef.id);

            // Optionnel : Sauvegarde locale de secours pour le Drive
            saveToBackup(contractData);

        } catch (error) {
            console.error("Erreur Firebase:", error);
            alert("❌ Erreur lors de l'enregistrement. Vérifiez votre connexion.");
        }
    };

    // --- PRÉPARATION SAUVEGARDE DRIVE (EXPORT FICHIER) ---
    const saveToBackup = (data) => {
        const backupData = JSON.parse(localStorage.getItem('tassili_backup') || '[]');
        backupData.push(data);
        localStorage.setItem('tassili_backup', JSON.stringify(backupData));
    };

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white pb-24">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
                Nouveau Contrat
            </h1>

            {/* SECTION CLIENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <label className="flex items-center gap-2 mb-2 text-slate-400"><User size={18} /> Nom du Client</label>
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                    />
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <label className="flex items-center gap-2 mb-2 text-slate-400"><Phone size={18} /> Téléphone</label>
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    />
                </div>
            </div>

            {/* SECTION CALCULATEUR */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 mb-2">Adultes (50€)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-2xl font-bold text-blue-400"
                            value={adults}
                            onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Enfants (15€)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-2xl font-bold text-purple-400"
                            value={children}
                            onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </div>

            {/* BARRE D'ACTION FIXE */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex gap-4">
                <button
                    onClick={saveQuoteToFirebase}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                    <Save size={24} /> ENREGISTRER LE DEVIS ({totalHT}€)
                </button>
            </div>
        </div>
    );
}