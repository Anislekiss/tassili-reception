import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FileText, Download, Share2, Search, Calendar } from 'lucide-react';
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

    // 2. FONCTION DE SAUVEGARDE (EXPORT EXCEL/CSV)
    const exportToDriveBackup = () => {
        try {
            const fields = ['clientName', 'clientPhone', 'eventDate', 'totalAmount', 'status'];
            const opts = { fields };
            const parser = new Parser(opts);
            const csv = parser.parse(contracts);

            // Création du fichier téléchargeable
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            link.setAttribute("href", url);
            link.setAttribute("download", `Sauvegarde_Tassili_${new Date().toLocaleDateString()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert("✅ Fichier de sauvegarde généré ! Vous pouvez le glisser dans votre Google Drive.");
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
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                >
                    <Download size={20} /> Sauvegarde Drive
                </button>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* LISTE DES CONTRATS */}
            <div className="grid gap-4">
                {filteredContracts.map((contract) => (
                    <div key={contract.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-blue-400">{contract.clientName}</h3>
                            <div className="flex gap-4 text-sm text-slate-400 mt-1">
                                <span className="flex items-center gap-1"><Calendar size={14} /> {contract.eventDate}</span>
                                <span className="font-bold text-white">{contract.totalAmount}€</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-slate-700 rounded-lg hover:bg-blue-600 transition-colors">
                                <FileText size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}