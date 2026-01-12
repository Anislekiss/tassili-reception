import React, { useState, useRef } from 'react';
import { PlusCircle, Search, Filter, Camera, Upload, X, DollarSign, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// MOCK DATA
const INITIAL_EXPENSES = [
    { id: 1, label: 'Achats Métro (Boissons)', amount: 450.00, date: '2025-10-12', venue: 'tassili', category: 'fournitures', receipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=200' },
    { id: 2, label: 'Décoration Fleurs', amount: 1200.50, date: '2025-10-15', venue: 'acheres', category: 'decoration', receipt: null },
    { id: 3, label: 'Réparation Clim', amount: 350.00, date: '2025-10-18', venue: 'tassili', category: 'maintenance', receipt: null },
];

export default function Expenses() {
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
    const [showForm, setShowForm] = useState(false);

    // FORM STATES
    const [formData, setFormData] = useState({ label: '', amount: '', venue: 'acheres', category: 'fournitures', date: new Date().toISOString().split('T')[0] });
    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRefWeb = useRef(null);
    const fileInputRefMobile = useRef(null);

    // HANDLERS
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newExpense = {
            id: Date.now(),
            ...formData,
            amount: parseFloat(formData.amount),
            receipt: previewUrl
        };
        setExpenses([newExpense, ...expenses]);
        setShowForm(false);
        // Reset
        setFormData({ label: '', amount: '', venue: 'acheres', category: 'fournitures', date: new Date().toISOString().split('T')[0] });
        setPreviewUrl(null);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans text-gray-900 pb-24">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dépenses & Achats</h1>
                    <p className="text-gray-500 mt-2">Suivi des factures fournisseurs.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-gray-200 flex items-center gap-2 hover:bg-black transition-all active:scale-95"
                >
                    <PlusCircle size={20} /> Nouvelle Facture
                </button>
            </div>

            {/* STATS RAPIDES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total du mois</p>
                        <p className="text-2xl font-bold text-gray-900">2 000,50 €</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl text-gray-400"><DollarSign /></div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">À justifier (Sans Achat)</p>
                        <p className="text-2xl font-bold text-orange-500">2</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><FileText /></div>
                </div>
            </div>

            {/* LISTE DEPENSES */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {expenses.map((expense) => (
                    <motion.div
                        key={expense.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                    >
                        {/* RECEIPT PREVIEW */}
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative cursor-pointer">
                            {expense.receipt ? (
                                <img src={expense.receipt} alt="Facture" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <FileText size={24} />
                                </div>
                            )}
                            {!expense.receipt && (
                                <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 absolute top-2 right-2"></div>
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex-1">
                            <h4 className="font-bold text-gray-900">{expense.label}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-gray-100 tracking-wider">{expense.venue === 'acheres' ? 'HR' : 'Tassili'}</span>
                                <span>• {new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block font-bold text-lg text-gray-900">-{expense.amount.toFixed(2)} €</span>
                            {expense.receipt ? (
                                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded inline-block mt-1">Justifié</span>
                            ) : (
                                <button className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded inline-block mt-1 hover:bg-orange-100">Ajouter Photo</button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MODAL NOUVELLE FACTURE */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:px-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Ajouter une Facture</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* PREVIEW ZONE */}
                                <div className="flex justify-center mb-6">
                                    <div className="text-center w-full">
                                        {previewUrl ? (
                                            <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
                                                <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                                                <button type="button" onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* BOUTON MOBILE (CAMERA) */}
                                                <div
                                                    onClick={() => fileInputRefMobile.current.click()}
                                                    className="h-32 bg-blue-50 border-2 border-blue-100 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors text-blue-600"
                                                >
                                                    <Camera size={32} className="mb-2" />
                                                    <span className="font-bold text-sm">Prendre Photo</span>
                                                    {/* INPUT HIDDEN HACK POUR MOBILE */}
                                                    <input
                                                        ref={fileInputRefMobile}
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>

                                                {/* BOUTON DESKTOP (FILE) */}
                                                <div
                                                    onClick={() => fileInputRefWeb.current.click()}
                                                    className="h-32 bg-gray-50 border-2 border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-500"
                                                >
                                                    <Upload size={32} className="mb-2" />
                                                    <span className="font-bold text-sm">Choisir Fichier</span>
                                                    <input
                                                        ref={fileInputRefWeb}
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CHAMPS TEXTE */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Libellé</label>
                                    <input required type="text" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="Ex: Courses Métro" className="w-full bg-gray-50 p-3 rounded-xl outline-none font-bold text-gray-900 border border-transparent focus:border-blue-500 transition-colors" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Montant TTC</label>
                                        <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full bg-gray-50 p-3 rounded-xl outline-none font-bold text-gray-900 border border-transparent focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                                        <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-gray-50 p-3 rounded-xl outline-none font-bold text-gray-900 border border-transparent focus:border-blue-500 transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Établissement</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setFormData({ ...formData, venue: 'acheres' })} className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 ${formData.venue === 'acheres' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-100 text-gray-400'}`}>HR Réception</button>
                                        <button type="button" onClick={() => setFormData({ ...formData, venue: 'tassili' })} className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 ${formData.venue === 'tassili' ? 'border-amber-500 text-amber-600 bg-amber-50' : 'border-gray-100 text-gray-400'}`}>Tassili</button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95">
                                        Enregistrer la Dépense
                                    </button>
                                </div>

                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
