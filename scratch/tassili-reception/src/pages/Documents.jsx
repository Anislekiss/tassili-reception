import React, { useState, useEffect } from 'react';
import { FileText, Search, Trash2, CheckCircle, AlertCircle, Clock, FileCheck } from 'lucide-react';

export default function Documents() {
    // 1. Données de départ (Simulées pour l'exemple)
    const initialData = [
        { id: 101, ref: "#101", client: "Mariage de Sarah et Thomas", date: "12/10/2025", amount: "12 500 €", kyc: true, status: "VALIDÉ" },
        { id: 102, ref: "#102", client: "Entreprise Tech Corp", date: "05/11/2025", amount: "4 500 €", kyc: false, status: "BROUILLON" },
        { id: 103, ref: "#103", client: "Anniversaire M. Dupuis", date: "20/06/2026", amount: "3 200 €", kyc: true, status: "EN ATTENTION" }
    ];

    // 2. On charge les données (soit du navigateur, soit les données initiales)
    const [documents, setDocuments] = useState(() => {
        const saved = localStorage.getItem('documents_data');
        return saved ? JSON.parse(saved) : initialData;
    });

    // 3. Sauvegarde automatique à chaque modification
    useEffect(() => {
        localStorage.setItem('documents_data', JSON.stringify(documents));
    }, [documents]);

    // 4. Fonction de suppression
    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce contrat ? Cette action est irréversible.")) {
            const newDocs = documents.filter(doc => doc.id !== id);
            setDocuments(newDocs);
        }
    };

    // Fonction pour déterminer la couleur du statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'VALIDÉ': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'BROUILLON': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            case 'EN ATTENTION': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-blue-500/10 text-blue-400';
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen pb-24 text-white">

            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Gestion documentaire</h1>
                    <p className="text-gray-400">Archives numériques et conformité (KYC).</p>
                </div>

                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button className="px-4 py-2 bg-violet-600 rounded-lg text-sm font-bold shadow-lg">Tout</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium text-gray-400 transition-colors">Réception des RH</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium text-gray-400 transition-colors">Tassili</button>
                </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher un contrat, un client..."
                    className="w-full bg-[#0F1219] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                />
            </div>

            {/* Liste des contrats */}
            <div className="glass-panel rounded-3xl border border-white/5 bg-[#0F1219] overflow-hidden">
                {documents.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <FileCheck size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Aucun contrat trouvé.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="p-6">Référence</th>
                                    <th className="p-6">Client</th>
                                    <th className="p-6">Montant</th>
                                    <th className="p-6 text-center">Conformité (KYC)</th>
                                    <th className="p-6">Statut</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6 font-mono text-orange-400 font-bold">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                                    <FileText size={18} />
                                                </div>
                                                {doc.ref}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-bold text-white">{doc.client}</div>
                                            <div className="text-xs text-gray-500">{doc.date}</div>
                                        </td>
                                        <td className="p-6 font-bold">{doc.amount}</td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-1">
                                                {doc.kyc ? (
                                                    <>
                                                        <CheckCircle size={16} className="text-emerald-500" />
                                                        <CheckCircle size={16} className="text-emerald-500" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle size={16} className="text-gray-600" />
                                                        <AlertCircle size={16} className="text-gray-600" />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(doc.status)}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-sm font-medium text-violet-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-violet-500/20">
                                                    Gérer
                                                </button>

                                                {/* BOUTON SUPPRIMER */}
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Supprimer ce contrat"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}