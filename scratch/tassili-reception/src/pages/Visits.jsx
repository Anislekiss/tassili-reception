import React, { useState, useEffect } from 'react';
import { Phone, Plus, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, Trash2, Edit2, Save, X, FileText, Receipt, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Visits() {
    // --- ÉTAT ---
    const [visits, setVisits] = useState([]);
    const [newClient, setNewClient] = useState("");
    const [visitDate, setVisitDate] = useState("");

    // Modals
    const [selectedVisit, setSelectedVisit] = useState(null); // Pour la relance
    const [noteText, setNoteText] = useState("");
    const [editingVisit, setEditingVisit] = useState(null); // Pour modifier
    const [viewingQuote, setViewingQuote] = useState(null); // Pour voir le devis (Ticket)

    // --- CHARGEMENT DES DONNÉES (LocalStorage) ---
    useEffect(() => {
        const savedVisits = localStorage.getItem('clientVisits');
        if (savedVisits) {
            setVisits(JSON.parse(savedVisits));
        } else {
            // Données de démo si vide
            setVisits([
                {
                    id: 1,
                    client: "Sophie Martin",
                    date: "2023-10-01",
                    reminderDate: "2023-10-08",
                    status: 'pending',
                    quote: {
                        total: 1250,
                        room: "Salle Empire (Samedi)",
                        catering: "Buffet Royal (50 pers.)",
                        options: ["Décoration Florale", "DJ"],
                        date: "2023-10-01"
                    },
                    notes: []
                }
            ]);
        }
    }, []);

    // Sauvegarde automatique à chaque changement
    useEffect(() => {
        localStorage.setItem('clientVisits', JSON.stringify(visits));
    }, [visits]);

    // --- LOGIQUE ---

    const handleAddVisit = (e) => {
        e.preventDefault();
        if (!newClient || !visitDate) return;

        const date = new Date(visitDate);
        date.setDate(date.getDate() + 7);
        const calculatedReminder = date.toISOString().split('T')[0];

        const newVisitObj = {
            id: Date.now(),
            client: newClient,
            date: visitDate,
            reminderDate: calculatedReminder,
            status: 'pending',
            quote: null, // Pas de devis au début si ajouté manuellement ici
            notes: []
        };

        setVisits([newVisitObj, ...visits]);
        setNewClient("");
        setVisitDate("");
    };

    const handleDelete = (id) => {
        if (window.confirm("Supprimer cette fiche ?")) {
            setVisits(visits.filter(v => v.id !== id));
        }
    };

    const handleSaveEdit = () => {
        setVisits(visits.map(v => (v.id === editingVisit.id ? editingVisit : v)));
        setEditingVisit(null);
    };

    const handleAddNote = (statusType) => {
        if (!selectedVisit) return;
        const updatedVisits = visits.map(visit => {
            if (visit.id === selectedVisit.id) {
                const newNote = { date: new Date().toLocaleDateString(), text: noteText || `Action: ${statusType}` };
                let newStatus = 'pending';
                if (statusType === 'interested') newStatus = 'converted';
                if (statusType === 'not_interested') newStatus = 'lost';
                return { ...visit, status: newStatus, notes: [...visit.notes, newNote] };
            }
            return visit;
        });
        setVisits(updatedVisits);
        setSelectedVisit(null);
        setNoteText("");
    };

    // --- AFFICHAGE ---
    const today = new Date().toISOString().split('T')[0];
    const urgentVisits = visits.filter(v => v.status === 'pending' && v.reminderDate <= today);
    const otherVisits = visits.filter(v => !urgentVisits.includes(v));

    return (
        <div className="space-y-8 text-white">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Suivi des Visites
                    </h1>
                    <p className="text-slate-400 mt-1">Fiches clients, devis PDF et relances.</p>
                </div>
            </div>

            {/* FORMULAIRE D'AJOUT SIMPLE */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="text-blue-400" /> Visite Rapide (Sans Devis)
                </h3>
                <form onSubmit={handleAddVisit} className="flex flex-col md:flex-row gap-4 items-end">
                    <input type="text" value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder="Nom du client" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500" />
                    <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full md:w-48 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl">Enregistrer</button>
                </form>
            </div>

            {/* RAPPELS URGENTS */}
            {urgentVisits.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2"><AlertCircle className="animate-pulse" /> À Relancer Aujourd'hui</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {urgentVisits.map(visit => (
                            <div key={visit.id} className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 p-5 rounded-2xl relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {visit.quote && <button onClick={() => setViewingQuote(visit)} className="p-1.5 bg-green-500/20 text-green-300 rounded"><FileText size={14} /></button>}
                                    <button onClick={() => handleDelete(visit.id)} className="p-1.5 bg-red-500/20 text-red-300 rounded"><Trash2 size={14} /></button>
                                </div>
                                <h4 className="font-bold text-lg">{visit.client}</h4>
                                <p className="text-sm text-orange-200/70 mb-3">Visite le {visit.date}</p>
                                {visit.quote && <div className="text-xs bg-black/30 p-2 rounded mb-3 text-slate-300">Devis estimé: <span className="text-white font-bold">{visit.quote.total} €</span></div>}
                                <button onClick={() => setSelectedVisit(visit)} className="w-full bg-orange-500/20 text-orange-100 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"><Phone size={16} /> Relancer</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LISTE COMPLÈTE */}
            <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-slate-400 uppercase"><th className="p-4">Client</th><th className="p-4">Date</th><th className="p-4">Statut</th><th className="p-4 text-right">Devis / Actions</th></tr>
                    </thead>
                    <tbody>
                        {otherVisits.map(visit => (
                            <tr key={visit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-medium">{visit.client}</td>
                                <td className="p-4 text-slate-400">{visit.date}</td>
                                <td className="p-4">
                                    {visit.status === 'converted' ? <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Validé</span> :
                                        visit.status === 'lost' ? <span className="text-red-400 flex items-center gap-1"><XCircle size={14} /> Refus</span> :
                                            <span className="text-blue-400 flex items-center gap-1"><Clock size={14} /> En cours</span>}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2 items-center">
                                    {visit.quote && (
                                        <button onClick={() => setViewingQuote(visit)} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 border border-green-500/20 transition-all">
                                            <FileText size={14} /> <span className="hidden md:inline font-bold">Voir Devis</span>
                                        </button>
                                    )}
                                    <button onClick={() => setEditingVisit(visit)} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                                    <button onClick={() => setSelectedVisit(visit)} className="p-2 text-blue-400 hover:text-white"><ArrowRight size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL : VISUALISEUR DE DEVIS (STYLE TICKET/PDF) --- */}
            <AnimatePresence>
                {viewingQuote && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingQuote(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white w-full max-w-md shadow-2xl overflow-hidden relative"
                            style={{ borderRadius: '4px' }} // Coin carré pour effet papier
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* EN-TÊTE TICKET */}
                            <div className="bg-slate-900 text-white p-6 text-center border-b-4 border-blue-600">
                                <div className="flex justify-center mb-2">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 font-black">A&K</div>
                                </div>
                                <h3 className="text-lg font-bold tracking-widest uppercase">Devis Estimatif</h3>
                                <p className="text-slate-400 text-xs mt-1">Généré le {viewingQuote.quote.date}</p>
                            </div>

                            {/* CORPS DU TICKET */}
                            <div className="p-8 bg-white text-slate-800 font-mono text-sm relative">

                                {/* Info Client */}
                                <div className="flex justify-between border-b border-dashed border-slate-300 pb-4 mb-4">
                                    <span className="text-slate-500">CLIENT</span>
                                    <span className="font-bold uppercase">{viewingQuote.client}</span>
                                </div>

                                {/* Détails */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Salle / Formule</span>
                                        <span className="font-bold">{viewingQuote.quote.room || "Non spécifié"}</span>
                                    </div>

                                    {viewingQuote.quote.catering && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Traiteur</span>
                                            <span className="font-bold text-right w-1/2">{viewingQuote.quote.catering}</span>
                                        </div>
                                    )}

                                    {viewingQuote.quote.options && viewingQuote.quote.options.length > 0 && (
                                        <div className="border-t border-dashed border-slate-200 pt-2 mt-2">
                                            <span className="text-slate-500 block mb-1">Options incluses :</span>
                                            <ul className="list-disc list-inside text-xs text-slate-700">
                                                {viewingQuote.quote.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-center mt-6">
                                    <span className="text-xl font-black uppercase">Total TTC</span>
                                    <span className="text-3xl font-black text-blue-600">{viewingQuote.quote.total} €</span>
                                </div>

                                {/* Footer Ticket */}
                                <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-wide">
                                    <p>Ce document est une simulation.</p>
                                    <p>Valable 15 jours.</p>
                                </div>

                                {/* Décoration "Dentelée" bas du ticket */}
                                <div className="absolute bottom-0 left-0 right-0 h-4 bg-[radial-gradient(circle,transparent_50%,#0f1021_50%)] bg-[length:15px_15px] translate-y-2"></div>
                            </div>

                            {/* ACTIONS */}
                            <div className="bg-[#0f1021] p-4 flex gap-2">
                                <button onClick={() => window.print()} className="flex-1 bg-slate-800 text-white py-3 rounded text-xs font-bold uppercase tracking-wide hover:bg-slate-700 flex items-center justify-center gap-2">
                                    <Download size={14} /> Imprimer / PDF
                                </button>
                                <button onClick={() => setViewingQuote(null)} className="flex-1 bg-blue-600 text-white py-3 rounded text-xs font-bold uppercase tracking-wide hover:bg-blue-500">
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODAL RELANCE ET EDITION (Code standard masqué pour brièveté, identique à avant) --- */}
            {/* (Laissez les modals de relance et d'édition ici comme dans le code précédent) */}
            <AnimatePresence>
                {selectedVisit && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-[#1a1b35] p-6 rounded-2xl w-full max-w-lg border border-white/10 relative">
                            <button onClick={() => setSelectedVisit(null)} className="absolute top-4 right-4 text-white"><X /></button>
                            <h3 className="text-xl font-bold mb-4">Relance : {selectedVisit.client}</h3>
                            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white h-32 mb-4" placeholder="Note..." />
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleAddNote('interested')} className="bg-green-500/20 text-green-300 p-3 rounded-xl">Validé</button>
                                <button onClick={() => handleAddNote('not_interested')} className="bg-red-500/20 text-red-300 p-3 rounded-xl">Refus</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}