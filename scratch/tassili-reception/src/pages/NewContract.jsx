import React, { useState, useEffect } from 'react';
import { Save, User, Check, Upload, Edit3, Calendar, Image as ImageIcon, Settings, Users, Baby, Mail, Phone, MapPin } from 'lucide-react';

export default function NewContract() {
    // --- ÉTATS GLOBAUX ---
    const [isEditMode, setIsEditMode] = useState(false);

    // --- 1. INFOS CLIENT COMPLÈTES ---
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [eventDate, setEventDate] = useState("");

    // GESTION INVITÉS
    const [guests, setGuests] = useState(100); // Adultes
    const [childGuests, setChildGuests] = useState(0); // Enfants
    const [childPrice, setChildPrice] = useState(15); // Prix par enfant

    // --- 2. SALLES ---
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isFriday, setIsFriday] = useState(false);

    const roomsData = [
        { id: 1, name: "Salle Tassili", subtitle: "Pack Table & Chaise", price: 1990 },
        { id: 2, name: "Salle Tassili", subtitle: "Pack Premium (Déco, Vaisselle...)", price: 2490 },
        { id: 3, name: "HR Réception", subtitle: "Table & Chaise", price: 1490 },
        { id: 4, name: "Achères Réception", subtitle: "Pack Premium", price: 1990 },
    ];

    // --- 3. TRAITEUR & OPTIONS ---
    const defaultStarters = [
        { id: 'e1', name: "Salade César", price: 5, image: null },
        { id: 'e2', name: "Foie Gras", price: 12, image: null },
        { id: 'e3', name: "Soupe Chorba", price: 4, image: null },
        { id: 'e4', name: "Buffet Froid", price: 8, image: null },
    ];
    const defaultMains = [
        { id: 'p1', name: "Poulet Rôti", price: 15, image: null },
        { id: 'p2', name: "Rôti de Veau", price: 18, image: null },
        { id: 'p3', name: "Tajine Agneau", price: 16, image: null },
        { id: 'p4', name: "Filet de Boeuf", price: 22, image: null },
        { id: 'p5', name: "Poisson Blanc", price: 17, image: null },
    ];
    const defaultDesserts = [
        { id: 'd1', name: "Pièce Montée", price: 6, image: null },
        { id: 'd2', name: "Salade de Fruits", price: 4, image: null },
        { id: 'd3', name: "Tiramisu", price: 5, image: null },
        { id: 'd4', name: "Buffet Sucré", price: 8, image: null },
    ];
    const defaultOptions = [
        { id: 'o1', name: "DJ & Animation", price: 500, image: null, active: false },
        { id: 'o2', name: "Décoration Florale", price: 800, image: null, active: false },
        { id: 'o3', name: "Photobooth", price: 350, image: null, active: false },
        { id: 'o4', name: "Voiture de Luxe", price: 400, image: null, active: false },
    ];

    // Chargement LocalStorage
    const [starters, setStarters] = useState(() => JSON.parse(localStorage.getItem('menu_starters')) || defaultStarters);
    const [mains, setMains] = useState(() => JSON.parse(localStorage.getItem('menu_mains')) || defaultMains);
    const [desserts, setDesserts] = useState(() => JSON.parse(localStorage.getItem('menu_desserts')) || defaultDesserts);
    const [customOptions, setCustomOptions] = useState(() => JSON.parse(localStorage.getItem('menu_options')) || defaultOptions);

    const [selectedStarter, setSelectedStarter] = useState(null);
    const [selectedMain, setSelectedMain] = useState(null);
    const [selectedDessert, setSelectedDessert] = useState(null);

    // Sauvegarde auto des menus modifiés
    useEffect(() => { localStorage.setItem('menu_starters', JSON.stringify(starters)); }, [starters]);
    useEffect(() => { localStorage.setItem('menu_mains', JSON.stringify(mains)); }, [mains]);
    useEffect(() => { localStorage.setItem('menu_desserts', JSON.stringify(desserts)); }, [desserts]);
    useEffect(() => { localStorage.setItem('menu_options', JSON.stringify(customOptions)); }, [customOptions]);

    // --- LOGIQUE DE CALCUL ---
    const getRoomPrice = () => {
        const room = roomsData.find(r => r.id === selectedRoomId);
        if (!room) return 0;
        let price = room.price;
        if (isFriday) price -= 500;
        return price > 0 ? price : 0;
    };

    const getCateringTotal = () => {
        let pricePerAdult = 0;
        if (selectedStarter) pricePerAdult += selectedStarter.price;
        if (selectedMain) pricePerAdult += selectedMain.price;
        if (selectedDessert) pricePerAdult += selectedDessert.price;
        const totalAdults = pricePerAdult * guests;
        const totalChildren = childGuests * childPrice;
        return totalAdults + totalChildren;
    };

    const getOptionsTotal = () => {
        return customOptions.reduce((acc, opt) => opt.active ? acc + opt.price : acc, 0);
    };

    const totalHT = getRoomPrice() + getCateringTotal() + getOptionsTotal();

    // --- FONCTIONS EDIT & UPLOAD ---
    const handleImageUpload = (e, section, id) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const updater = (items) => items.map(i => i.id === id ? { ...i, image: base64String } : i);
                if (section === 'starter') setStarters(updater);
                if (section === 'main') setMains(updater);
                if (section === 'dessert') setDesserts(updater);
                if (section === 'option') setCustomOptions(updater);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateItem = (section, id, field, value) => {
        const updater = (items) => items.map(i => i.id === id ? { ...i, [field]: value } : i);
        if (section === 'starter') setStarters(updater);
        if (section === 'main') setMains(updater);
        if (section === 'dessert') setDesserts(updater);
        if (section === 'option') setCustomOptions(updater);
    };

    const toggleOption = (id) => {
        setCustomOptions(opts => opts.map(o => o.id === id ? { ...o, active: !o.active } : o));
    };

    // --- SAUVEGARDE CLIENT ---
    const saveQuoteToClient = () => {
        if (!clientName) return alert("Merci d'indiquer le nom du client.");

        const optionsSummary = customOptions.filter(o => o.active).map(o => `${o.name} (${o.price}€)`);

        let cateringDetail = `Menu Adultes (${guests} p.)`;
        if (childGuests > 0) {
            cateringDetail += ` + Menu Enfants (${childGuests} p. à ${childPrice}€)`;
        }

        const newVisit = {
            id: Date.now(),
            client: clientName,
            // On sauvegarde les nouvelles infos de contact
            contact: {
                email: clientEmail,
                phone: clientPhone,
                address: clientAddress
            },
            date: eventDate || new Date().toISOString().split('T')[0],
            reminderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            quote: {
                total: totalHT,
                room: roomsData.find(r => r.id === selectedRoomId)?.name || "Aucune",
                catering: cateringDetail,
                details: {
                    starter: selectedStarter?.name,
                    main: selectedMain?.name,
                    dessert: selectedDessert?.name
                },
                options: optionsSummary.length ? optionsSummary : ["Aucune option"],
                date: new Date().toLocaleDateString()
            },
            notes: []
        };

        const existingVisits = JSON.parse(localStorage.getItem('clientVisits') || '[]');
        localStorage.setItem('clientVisits', JSON.stringify([newVisit, ...existingVisits]));

        alert(`✅ Client enregistré avec succès !\nNom: ${clientName}\nTel: ${clientPhone}`);

        // Reset partiel
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setClientAddress("");
    };

    // --- COMPOSANT BULLE ---
    const ItemCard = ({ item, section, selected, onSelect }) => {
        return (
            <div
                onClick={() => !isEditMode && onSelect(item)}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 border group
              ${selected ? 'border-blue-500 ring-2 ring-blue-500/50 scale-[1.02]' : 'border-white/10 hover:border-white/30 bg-[#1a1b35]'}
            `}
            >
                <div className="h-32 w-full bg-black/50 relative flex items-center justify-center overflow-hidden">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="text-slate-600"><ImageIcon size={32} /></div>}
                    {isEditMode && (
                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, section, item.id)} />
                            <div className="flex flex-col items-center text-white text-xs font-bold"><Upload size={24} className="mb-1 text-blue-400" /> Changer Photo</div>
                        </label>
                    )}
                    {!isEditMode && selected && <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center"><div className="bg-blue-600 text-white rounded-full p-2"><Check size={20} /></div></div>}
                </div>
                <div className="p-4">
                    {isEditMode ? (
                        <div className="space-y-2">
                            <input type="text" value={item.name} onChange={(e) => updateItem(section, item.id, 'name', e.target.value)} className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm font-bold text-white" />
                            <div className="flex items-center gap-1">
                                <input type="number" value={item.price} onChange={(e) => updateItem(section, item.id, 'price', Number(e.target.value))} className="w-20 bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-green-400 font-mono" />
                                <span className="text-xs text-slate-500">€</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h4 className="font-bold text-sm truncate">{item.name}</h4>
                            <p className="text-green-400 font-bold text-lg">{item.price} €</p>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="text-white space-y-10 pb-32">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Nouveau Contrat</h1>
                    <p className="text-slate-400 mt-2">Simulateur complet & Fiche Client.</p>
                </div>
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <button onClick={() => setIsEditMode(!isEditMode)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${isEditMode ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                        {isEditMode ? <Settings size={14} className="animate-spin-slow" /> : <Edit3 size={14} />} {isEditMode ? "Mode Édition ACTIF" : "Activer Mode Édition"}
                    </button>
                    <div className="bg-[#0f1021] border border-blue-500/30 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] text-center w-full md:w-64">
                        <p className="text-[10px] text-blue-300 uppercase font-bold tracking-[0.2em] mb-1">Total Estimé</p>
                        <p className="text-4xl font-black text-white">{totalHT} €</p>
                    </div>
                </div>
            </div>

            {/* 1. FICHE CLIENT COMPLÈTE */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Bloc Identité & Contact (Largeur 8/12) */}
                <div className="md:col-span-8 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-sm font-bold text-blue-300 uppercase mb-4 flex items-center gap-2"><User size={16} /> Informations Client</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nom */}
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nom Complet / Société</label>
                            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ex: Mr et Mme Dupont" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Mail size={10} /> Email</label>
                            <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@email.com" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Phone size={10} /> Téléphone</label>
                            <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="06 00 00 00 00" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                        </div>

                        {/* Adresse */}
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><MapPin size={10} /> Adresse Postale</label>
                            <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="12 rue de la Paix, 75000 Paris" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Bloc Événement (Largeur 4/12) */}
                <div className="md:col-span-4 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-purple-300 uppercase mb-4 flex items-center gap-2"><Calendar size={16} /> Détails Événement</h3>

                    {/* Date */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Date</label>
                        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white [color-scheme:dark] outline-none" />
                    </div>

                    {/* Adultes */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Users size={12} /> Invités Adultes</label>
                        <input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none font-mono" />
                    </div>

                    {/* Enfants */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Baby size={12} /> Enfants ({childPrice}€)</label>
                        <div className="flex gap-2">
                            <input type="number" value={childGuests} onChange={(e) => setChildGuests(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-pink-300 focus:border-pink-500 outline-none font-mono" />
                            {isEditMode && <input type="number" value={childPrice} onChange={(e) => setChildPrice(Number(e.target.value))} className="w-16 bg-black/20 border border-white/10 rounded-lg px-1 text-center text-xs" title="Prix enfant" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SALLES */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3"><span className="w-8 h-1 bg-blue-500 rounded-full"></span> Choix de la Salle</h3>
                    <div onClick={() => setIsFriday(!isFriday)} className={`cursor-pointer px-4 py-2 rounded-xl border flex items-center gap-3 transition-all ${isFriday ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isFriday ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>{isFriday && <Check size={12} className="text-black" />}</div>
                        <div><span className="text-xs font-bold uppercase block">Option Vendredi</span><span className="text-xs">-500 € sur la salle</span></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roomsData.map(room => {
                        const finalPrice = room.price - (isFriday ? 500 : 0);
                        const isSelected = selectedRoomId === room.id;
                        return (
                            <div key={room.id} onClick={() => setSelectedRoomId(room.id)} className={`p-6 rounded-3xl border cursor-pointer transition-all relative overflow-hidden group ${isSelected ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500' : 'bg-[#1a1b35] border-white/10 hover:border-white/20'}`}>
                                {isSelected && <div className="absolute top-0 right-0 p-3 bg-blue-500 rounded-bl-2xl text-white"><Check size={20} /></div>}
                                <h4 className="font-black text-lg uppercase tracking-wide">{room.name}</h4>
                                <p className="text-sm text-slate-400 mb-4 h-10">{room.subtitle}</p>
                                <div className="flex items-end gap-2"><span className={`text-3xl font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>{finalPrice}€</span>{isFriday && <span className="text-sm text-slate-500 line-through mb-1">{room.price}€</span>}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. TRAITEUR */}
            <section className="space-y-8">
                <h3 className="text-2xl font-bold flex items-center gap-3"><span className="w-8 h-1 bg-purple-500 rounded-full"></span> Traiteur & Menus</h3>
                <div><h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Entrées</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{starters.map(item => <ItemCard key={item.id} item={item} section="starter" selected={selectedStarter?.id === item.id} onSelect={setSelectedStarter} />)}</div></div>
                <div><h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Plats Principaux</h4><div className="grid grid-cols-2 md:grid-cols-5 gap-4">{mains.map(item => <ItemCard key={item.id} item={item} section="main" selected={selectedMain?.id === item.id} onSelect={setSelectedMain} />)}</div></div>
                <div><h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Desserts</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{desserts.map(item => <ItemCard key={item.id} item={item} section="dessert" selected={selectedDessert?.id === item.id} onSelect={setSelectedDessert} />)}</div></div>
            </section>

            {/* 4. OPTIONS */}
            <section>
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-6"><span className="w-8 h-1 bg-orange-500 rounded-full"></span> Options Extras</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {customOptions.map(option => (
                        <div key={option.id} className={`relative rounded-2xl p-4 border transition-all ${option.active ? 'bg-orange-500/10 border-orange-500' : 'bg-[#1a1b35] border-white/10'}`}>
                            <div className="h-24 w-full bg-black/30 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
                                {option.image ? <img src={option.image} className="w-full h-full object-cover" /> : <Settings className="text-slate-600" />}
                                {isEditMode && <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'option', option.id)} /><Upload size={20} className="text-white" /></label>}
                            </div>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {isEditMode ? <><input type="text" value={option.name} onChange={(e) => updateItem('option', option.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/20 text-sm font-bold mb-1" /><input type="number" value={option.price} onChange={(e) => updateItem('option', option.id, 'price', Number(e.target.value))} className="w-20 bg-transparent border-b border-white/20 text-xs text-orange-300" /></> : <><p className="font-bold text-sm">{option.name}</p><p className="text-xs text-orange-300 font-mono">{option.price} €</p></>}
                                </div>
                                {!isEditMode && <button onClick={() => toggleOption(option.id)} className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${option.active ? 'bg-orange-500' : 'bg-slate-700'}`}><div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${option.active ? 'translate-x-4' : ''}`} /></button>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER ACTION */}
            <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-6 bg-[#0f1021]/90 backdrop-blur-md border-t border-white/10 z-40">
                <button onClick={saveQuoteToClient} className="w-full max-w-4xl mx-auto py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-900/20 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
                    <Save size={24} /> ENREGISTRER LE DEVIS ({totalHT} €)
                </button>
            </div>
        </div>
    );
}
