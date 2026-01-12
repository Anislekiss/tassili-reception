import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FileText, Download, Search, Calendar, StickyNote, User } from 'lucide-react';
import { Parser } from 'json2csv';

export default function Visits() {
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. CHARGEMENT TEMPS RÉEL DEPUIS FIREBASE
    useEffect(() => {
        const q = query(collection(db, "contracts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setContracts(docs);
        });
        return () => unsubscribe();
    }, []);

    // 2. EXPORT EXCEL (INCLUANT LES NOTES)
    const exportToDriveBackup = () => {
        try {
            const fields = ['clientName', 'clientPhone', 'eventDate', 'totalAmount', 'notes', 'status'];
            const opts = { fields };
            const parser = new Parser(opts);
            const csv = parser.parse(contracts);

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            link.setAttribute("href", url);
            link.setAttribute("download", `Archive_Tassili_${new Date().toLocaleDateString()}.csv`);
            link.click();

            alert("✅ Archive générée avec succès !");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'export");
        }
    };

    const filteredContracts = contracts.filter(c =>
        c.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white pb-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des Visites</h1>
                <button
                    onClick={exportToDriveBackup}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                    <Download size={20} /> Export Drive
                </button>
            </div>

            {/* RECHERCHE */}
            <div className="relative mb-8">
                <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* LISTE DES CONTRATS */}
            <div className="grid gap-4">
                {filteredContracts.map((contract) => (
                    <div key={contract.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-xl text-blue-400 flex items-center gap-2">
                                    <User size={18} className="text-slate-500" /> {contract.clientName}
                                </h3>
                                <div className="flex gap-4 text-sm text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {contract.eventDate || 'Date non définie'}</span>
                                    <span className="font-bold text-white bg-slate-700 px-2 rounded">{contract.totalAmount}€</span>
                                </div>
                            </div>
                            <button className="p-2 bg-slate-700 rounded-lg hover:bg-blue-600 transition-colors">
                                <FileText size={20} />
                            </button>
                        </div>

                        {/* AFFICHAGE DES NOTES */}
                        {contract.notes && (
                            <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border-l-4 border-blue-500 flex gap-2 items-start">
                                <StickyNote size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                                <p className="text-sm text-slate-300 italic">"{contract.notes}"</p>
                            </div>
                        )}
                    </div>
                ))}

                {filteredContracts.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        Aucun contrat trouvé.
                    </div>
                )}
            </div>
        </div>
    );
}