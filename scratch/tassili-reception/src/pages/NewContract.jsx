import React, { useState, useMemo, useEffect, memo } from 'react';
// ... gardez vos imports firebase habituels ...

// 1. COMPOSANT BULLE ISOLÉ (Pour la fluidité)
const MenuBubble = memo(({ item, isSelected, onSelect, editMode }) => (
    <div
        onClick={() => onSelect(item)}
        className={`relative h-36 rounded-[2rem] overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-blue-500 scale-105 shadow-lg' : 'border-slate-800'}`}
    >
        <img src={item.img || 'https://via.placeholder.com/400'} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 ${editMode ? 'bg-black/80' : ''}`}>
            <p className="font-black text-[10px] uppercase tracking-widest text-white">{item.label}</p>
            <p className="text-blue-400 font-black text-xl">{item.price}€</p>
        </div>
    </div>
));

export default function NewContract() {
    // États séparés pour bloquer les re-rendus inutiles
    const [client, setClient] = useState({ nom: '', prenom: '', tel: '', email: '' });
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [selections, setSelections] = useState([]);
    const [editMode, setEditMode] = useState(false);

    // CALCULATEUR AVEC SÉCURITÉ (useMemo est obligatoire ici)
    const total = useMemo(() => {
        try {
            const prixBulles = selections.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
            return (parseInt(adults) * prixBulles) + (parseInt(children) * 15);
        } catch (e) { return 0; }
    }, [adults, children, selections]);

    // FONCTION D'UPLOAD SÉCURISÉE (Anti-crash)
    const handlePhotoUpdate = async (file, item) => {
        if (file.size > 5000000) return alert("Photo trop lourde (max 5Mo)");

        // Compression express via Canvas
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 400; canvas.height = 300;
                canvas.getContext('2d').drawImage(img, 0, 0, 400, 300);
                const compressed = canvas.toDataURL('image/jpeg', 0.6);
                // Ici, envoyez 'compressed' vers Firebase
            };
        };
    };

    return (
        <div className="bg-[#020617] min-h-screen text-white p-4 pb-40">
            {/* Structure CRM avec inputs isolés */}
            {/* Grille de bulles utilisant le composant MenuBubble */}
            {/* Footer avec affichage du 'total' calculé */}
        </div>
    );
}