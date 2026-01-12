import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Plus, X, Save, Phone, Mail, Calendar, User } from 'lucide-react';

export default function Clients() {
    // --- DONNÉES DE DÉPART (Exemple) ---
    const initialData = [
        { id: 1, name: "Amine Benali", phone: "06 12 34 56 78", email: "amine.b@gmail.com", date: "2024-06-15", status: "Confirmé" },
        { id: 2, name: "Sarah K.", phone: "07 98 76 54 32", email: "sarah.k@hotmail.fr", date: "2024-08-20", status: "En attente" },
        { id: 3, name: "Karim & Leïla", phone: "06 00 11 22 33", email: "mariage.kl@yahoo.com", date: "2024-09-02", status: "Confirmé" },
    ];

    // --- ÉTATS ---
    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('clients_db');
        return saved ? JSON.parse(saved) : initialData;
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [editingClient, setEditingClient] = useState(null); // Le client qu'on modifie
    const [isNew, setIsNew] = useState(false); // Si c'est un nouveau client

    // Sauvegarde automatique
    useEffect(() => {
        localStorage.setItem('clients_db', JSON.stringify(clients));
    }, [clients]);

    // --- ACTIONS ---

    // 1. SUPPRIMER
    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce client ?")) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    // 2. OUVRIR MODIFICATION
    const handleEdit = (client) => {
        setIsNew(false);
        setEditingClient({ ...client }); // On copie l'objet pour ne pas modifier en direct avant de valider
    };

    // 3. OUVRIR CRÉATION
    const handleCreate = () => {
        setIsNew(true);
        setEditingClient({ id: Date.now(), name: "", phone: "", email: "", date: "", status: "En attente" });
    };

    // 4. SAUVEGARDER (Ajout ou Modif)
    const saveClient = () => {
        if (!editingClient.name) return alert("Le nom est obligatoire");

        if (isNew) {
            setClients([editingClient, ...clients]);
        } else {
            setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
        }
        setEditingClient(null); // Fermer la fenêtre
    };

    // FILTRE DE RECHERCHE
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#0F1219] text-white p-6 md:p-10">

            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Fichier Clients
                    </h1>
                    <p className="text-gray-400 text-sm">Gérez vos contacts et modifications</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Barre de recherche */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Bouton Nouveau */}
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} /> <span className="hidden md:inline">Nouveau</span>
                    </button>
                </div>
            </div>

            {/* TABLEAU DES CLIENTS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                            <th className="p-4 font-bold">Client</th>
                            <th className="p-4 font-bold hidden md:table-cell">Contact</th>
                            <th className="p-4 font-bold hidden md:table-cell">Date Événement</th>
                            <th className="p-4 font-bold">Statut</th>
                            <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-white/5 transition-colors group">

                                {/* NOM */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-gray-300">
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{client.name}</div>
                                            <div className="text-xs text-gray-500 md:hidden">{client.phone}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* CONTACT */}
                                <td className="p-4 hidden md:table-cell">
                                    <div className="text-sm text-gray-300 flex items-center gap-2"><Phone size={12} className="text-gray-500" /> {client.phone}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><Mail size={12} className="text-gray-500" /> {client.email}</div>
                                </td>

                                {/* DATE */}
                                <td className="p-4 hidden md:table-cell text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-500" /> {client.date || "Non fixée"}
                                    </div>
                                </td>

                                {/* STATUT */}
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${client.status === 'Confirmé' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                            client.status === 'En attente' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>

                                {/* BOUTONS ACTIONS */}
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="p-2 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors border border-white/10" title="Modifier">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors border border-white/10" title="Supprimer">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                                    Aucun client trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL D'ÉDITION (POP-UP) --- */}
            {editingClient && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1a1f2e] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {isNew ? <Plus className="text-blue-500" /> : <Edit className="text-blue-500" />}
                                {isNew ? "Nouveau Client" : "Modifier Client"}
                            </h2>
                            <button onClick={() => setEditingClient(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nom Complet</label>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                                    <User size={18} className="text-gray-400" />
                                    <input
                                        type="text"
                                        value={editingClient.name}
                                        onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                                        className="bg-transparent text-white w-full outline-none font-medium"
                                        placeholder="Ex: Amine Benali"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Téléphone</label>
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                                        <Phone size={18} className="text-gray-400" />
                                        <input
                                            type="text"
                                            value={editingClient.phone}
                                            onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                                            className="bg-transparent text-white w-full outline-none"
                                            placeholder="06..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Date Événement</label>
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                                        <input
                                            type="date"
                                            value={editingClient.date}
                                            onChange={(e) => setEditingClient({ ...editingClient, date: e.target.value })}
                                            className="bg-transparent text-white w-full outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
                                    <Mail size={18} className="text-gray-400" />
                                    <input
                                        type="email"
                                        value={editingClient.email}
                                        onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                                        className="bg-transparent text-white w-full outline-none"
                                        placeholder="client@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Statut</label>
                                <select
                                    value={editingClient.status}
                                    onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white outline-none"
                                >
                                    <option value="En attente" className="text-black">En attente</option>
                                    <option value="Confirmé" className="text-black">Confirmé</option>
                                    <option value="Archivé" className="text-black">Archivé</option>
                                </select>
                            </div>

                            <button
                                onClick={saveClient}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                            >
                                <Save size={18} />
                                Enregistrer
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}