import React, { useState } from 'react';
import { User, Plus } from 'lucide-react';

const PersonCard = ({ name, total, color, lastWithdrawal }) => (
    <div className={`p-6 rounded-2xl text-white ${color} shadow-lg relative overflow-hidden`}>
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <h3 className="text-xl font-medium opacity-90">{name}</h3>
                <p className="text-4xl font-bold mt-2">{total} €</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <User size={32} />
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 z-10 relative">
            <p className="text-sm opacity-80">Dernier retrait : {lastWithdrawal}</p>
        </div>
    </div>
);

export default function Withdrawals() {
    const [person, setPerson] = useState('Anis'); // 'Anis' | 'Karim'
    const [amount, setAmount] = useState('');

    // Mock data
    const history = [
        { id: 1, name: 'Anis', amount: 500, date: '2025-01-01' },
        { id: 2, name: 'Anis', amount: 1000, date: '2025-02-02' },
        { id: 3, name: 'Karim', amount: 500, date: '2025-03-17' },
    ];

    const handleWithdraw = (e) => {
        e.preventDefault();
        alert(`Retrait de ${amount}€ enregistré pour ${person}`);
        setAmount('');
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Retraits Associés</h2>
                <p className="text-gray-500">Suivi des prélèvements personnels</p>
            </div>

            {/* Totals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonCard
                    name="Anis"
                    total="1 500"
                    lastWithdrawal="1000€ le 02/02"
                    color="bg-gradient-to-br from-blue-600 to-blue-800"
                />
                <PersonCard
                    name="Karim"
                    total="500"
                    lastWithdrawal="500€ le 17/03"
                    color="bg-gradient-to-br from-purple-600 to-purple-800"
                />
            </div>

            {/* New Withdrawal Form */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus size={20} /> Nouveau Retrait
                </h3>

                <form onSubmit={handleWithdraw} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Qui retire ?</label>
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setPerson('Anis')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${person === 'Anis' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500'}`}
                            >
                                Anis
                            </button>
                            <button
                                type="button"
                                onClick={() => setPerson('Karim')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${person === 'Karim' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500'}`}
                            >
                                Karim
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Montant (€)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-1/3 py-2.5 bg-brand-gold text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Valider le retrait
                    </button>
                </form>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Historique des mouvements</h3>
                </div>
                <table className="w-full text-left">
                    <tbody className="divide-y divide-gray-100">
                        {history.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                                <td className="px-6 py-4 font-medium">
                                    <span className={`px-2 py-1 rounded text-xs ${item.name === 'Anis' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                        {item.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">-{item.amount} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
