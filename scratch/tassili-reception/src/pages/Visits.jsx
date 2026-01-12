import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FileText, Download, Search, Calendar, StickyNote, User } from 'lucide-react';

export default function Visits() {
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, "contracts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContracts(docs);
        });
        return () => unsubscribe();
    }, []);

    // NOUVELLE MÉTHODE D'EXPORT SANS MODULE EXTERNE (PLUS FIABLE)
    const exportToCSV = () => {
        const headers = ["Nom", "Telephone", "Date", "Total", "Notes"];
        const rows = contracts.map(c => [
            c.clientName,
            c.clientPhone,
            c.eventDate,
            c.totalAmount,
            c.notes?.replace(/,/g, " ") // Évite de casser les colonnes
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.body.appendChild(document.createElement("a"));
        link.href = URL.createObjectURL(blob);
        link.download = `Tassili_Export_${new Date().toLocaleDateString()}.csv`;
        link.click();
        document.body.removeChild(link);
    };

    const filteredContracts = contracts.filter(c =>
        c.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white pb-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-serif italic text-blue-400">Visites</h1>
                <button onClick={exportToCSV} className="bg-emerald-600 p-2 rounded-xl flex items-center gap-2 text-sm">
                    <Download size={18} /> Export Drive
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredContracts.map((contract) => (
                    <div key={contract.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-xl text-white flex items-center gap-2"><User size={18} /> {contract.clientName}</h3>
                                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2"><Calendar size={14} /> {contract.eventDate}</p>
                                <p className="text-blue-400 font-bold mt-2">{contract.totalAmount}€</p>
                            </div>
                        </div>
                        {contract.notes && (
                            <div className="mt-4 p-3 bg-slate-900 rounded-lg text-sm text-slate-400 italic border-l-2 border-blue-500">
                                "{contract.notes}"
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}