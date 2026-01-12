import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, User, Users, Calendar as CalendarIcon, Filter, RefreshCw, Smartphone, Settings, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATABASE (INTERNAL) ---
const INTERNAL_EVENTS = [
    { id: 1, venue: 'tassili', date: '2025-10-12', client: 'Sarah & Thomas', guests: 250, details: 'Formule Traiteur complète', source: 'app' },
    { id: 2, venue: 'acheres', date: '2025-10-12', client: 'Anniversaire M. Dupuis', guests: 80, details: 'Location Sèche', source: 'app' },
];

export default function Agenda() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateDetails, setSelectedDateDetails] = useState(null);
    const [events, setEvents] = useState(INTERNAL_EVENTS);

    // SYNC STATES
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [icalUrl, setIcalUrl] = useState('https://p01-calendarws.icloud.com/ca/subscribe/1/fake-id');
    const [lastSync, setLastSync] = useState(null);

    // DATE LOGIC
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const currentYear = today.getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 2 + i);

    const handleMonthChange = (e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    const handleYearChange = (e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // --- MOCK SYNC ENGINE (Apple iCal Simulation) ---
    const triggerSync = () => {
        setIsSyncing(true);
        // Simulate Network Delay
        setTimeout(() => {
            // Simulated External Events from iCal
            const EXTERNAL_ICAL_EVENTS = [
                { id: 'ical_1', title: 'Visite Tassili (M. Benali)', date: '2025-10-20' },
                { id: 'ical_2', title: 'RDV HR Réception - Dj', date: '2025-10-25' },
                { id: 'ical_3', title: 'Mariage Tassili (Importé)', date: '2025-10-15' },
            ];

            // SMART MATCHING LOGIC
            const mappedEvents = EXTERNAL_ICAL_EVENTS.map(evt => {
                let venue = 'unknown';
                if (evt.title.toLowerCase().includes('tassili')) venue = 'tassili';
                else if (evt.title.toLowerCase().includes('hr') || evt.title.toLowerCase().includes('acheres')) venue = 'acheres';

                return {
                    id: evt.id,
                    venue: venue,
                    date: evt.date,  // Should match YYYY-MM-DD
                    client: evt.title,
                    guests: '?',
                    details: 'Synchronisé depuis iCal',
                    source: 'ical' // Visual tag
                };
            });

            // Merge avoiding duplicates (simple ID check mock)
            setEvents(prev => {
                // Filter out existing iCal events to prevent duplicates on re-sync
                const internalOnlyEvents = prev.filter(e => e.source === 'app');
                const combined = [...internalOnlyEvents, ...mappedEvents];
                return combined;
            });

            setIsSyncing(false);
            setLastSync(new Date());
            setIsSyncModalOpen(false); // Close modal after sync
        }, 2000);
    };

    // CALENDAR GRID GENERATION
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // RENDER SINGLE DAY
    const renderDay = (dayNum) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

        const bookings = events.filter(e => e.date === dateStr);
        const tassiliBooked = bookings.find(e => e.venue === 'tassili');
        const acheresBooked = bookings.find(e => e.venue === 'acheres');
        const isFull = tassiliBooked && acheresBooked;
        const isPast = new Date(dateStr) < new Date().setHours(0, 0, 0, 0);

        return (
            <div
                key={dayNum}
                onClick={() => setSelectedDateDetails({ date: dateStr, tassili: tassiliBooked, acheres: acheresBooked })}
                className={`
                  min-h-[8rem] border border-white/5 p-3 relative cursor-pointer transition-all duration-200 group
                  ${isFull ? 'bg-white/5' : 'hover:bg-white/10'}
                  ${isPast ? 'opacity-50' : 'opacity-100'}
                `}
            >
                <span className={`text-sm font-bold block mb-2 ${isFull ? 'text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>{dayNum}</span>

                <div className="space-y-1.5">
                    {tassiliBooked && (
                        <div className={`text-[10px] px-2 py-1 rounded border truncate font-bold flex items-center gap-1.5 shadow-sm 
                            ${tassiliBooked.source === 'ical' ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' : 'bg-amber-500/20 text-amber-200 border-amber-500/30'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${tassiliBooked.source === 'ical' ? 'bg-purple-500' : 'bg-amber-500'}`}></span>
                            {tassiliBooked.source === 'ical' && <RefreshCw size={8} />}
                            Tassili
                        </div>
                    )}
                    {acheresBooked && (
                        <div className={`text-[10px] px-2 py-1 rounded border truncate font-bold flex items-center gap-1.5 shadow-sm 
                            ${acheresBooked.source === 'ical' ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' : 'bg-blue-500/20 text-blue-200 border-blue-500/30'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${acheresBooked.source === 'ical' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                            {acheresBooked.source === 'ical' && <RefreshCw size={8} />}
                            Achères
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-6">

            {/* HEADER CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                        <CalendarIcon size={36} className="text-purple-400" />
                        Agenda
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        {lastSync ? (
                            <span className="flex items-center gap-1 text-green-400"><CheckCircle size={12} /> Synchro OK ({lastSync.toLocaleTimeString()})</span>
                        ) : (
                            <span>Planning unifié des salles</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* SYNC BUTTON */}
                    <button
                        onClick={() => setIsSyncModalOpen(true)}
                        className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold text-white hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                        <span>Sync iCal</span>
                    </button>

                    {/* DATE PICKER WIDGET */}
                    <div className="glass-card p-1.5 rounded-xl flex items-center gap-2 border border-white/10 bg-black/20">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2">
                            <select value={month} onChange={handleMonthChange} className="appearance-none bg-transparent text-white font-bold py-2 pr-8 pl-2 outline-none cursor-pointer hover:text-purple-300 transition-colors">{months.map((m, i) => <option key={i} value={i} className="bg-slate-900 text-white">{m}</option>)}</select>
                            <span className="text-slate-500">/</span>
                            <select value={year} onChange={handleYearChange} className="appearance-none bg-transparent text-white font-bold py-2 px-2 outline-none cursor-pointer hover:text-purple-300 transition-colors">{years.map(y => <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>)}</select>
                        </div>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"><ChevronRight size={20} /></button>
                    </div>

                    {/* SETTINGS BUTTON */}
                    <button className="glass-card p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* CALENDAR BODY */}
            <div className="glass-card rounded-3xl overflow-hidden flex-1 flex flex-col border border-white/10 shadow-2xl">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                        <div key={d} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-px bg-white/10 flex-1">
                    {/* Offsets */}
                    {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-[#0f1021]/50 backdrop-blur-sm min-h-[8rem]" />
                    ))}
                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => renderDay(i + 1))}
                </div>
            </div>

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {selectedDateDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedDateDetails(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="glass-panel p-8 rounded-3xl max-w-2xl w-full relative z-10 border border-white/20 bg-[#1a1b35]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {new Date(selectedDateDetails.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h2>
                                <button onClick={() => setSelectedDateDetails(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><X size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* VENUE CARDS */}
                                {['acheres', 'tassili'].map(v => {
                                    const booking = selectedDateDetails[v];
                                    const isAcheres = v === 'acheres';
                                    const colorClass = isAcheres ? 'blue' : 'amber';

                                    return (
                                        <div key={v} className={`p-5 rounded-2xl border ${booking ? `border-${colorClass}-500/50 bg-${colorClass}-500/10` : 'border-white/10 bg-white/5 border-dashed'}`}>
                                            <h3 className={`font-bold text-lg mb-4 capitalize ${isAcheres ? 'text-blue-300' : 'text-amber-300'}`}>{isAcheres ? 'HR Réception' : 'Tassili Réception'}</h3>

                                            {booking ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-white font-bold text-lg"><User size={20} /> {booking.client}</div>
                                                    <div className="flex items-center gap-2 text-slate-300 text-sm"><Users size={16} /> {booking.guests} inv.</div>
                                                    <div className={`text-xs px-2 py-1 rounded inline-block bg-${colorClass}-500/20 text-${colorClass}-200 border border-${colorClass}-500/20`}>{booking.details}</div>
                                                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                                                        <span className="text-xs uppercase font-bold text-slate-500">Statut</span>
                                                        <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded">RESERVÉ</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-32 flex flex-col items-center justify-center text-slate-500 gap-2">
                                                    <span className="text-sm font-medium">Aucun événement</span>
                                                    <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/10 font-bold transition-all">Créer Contrat</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* SYNC MODAL */}
            <AnimatePresence>
                {isSyncModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSyncModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-panel p-8 rounded-3xl max-w-lg w-full relative z-10 border border-white/20 bg-[#1a1b35]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><RefreshCw /> Synchronisation iCal</h2>
                                <button onClick={() => setIsSyncModalOpen(false)} className="p-2 bg-white/10 rounded-full text-white"><X size={20} /></button>
                            </div>

                            <div className="space-y-6">
                                {/* STEP 1: IMPORT */}
                                <div>
                                    <h3 className="text-sm font-bold text-indigo-300 uppercase mb-2">1. Importer depuis iCloud (Apple)</h3>
                                    <p className="text-xs text-slate-400 mb-3">Collez ici l'URL publique de votre calendrier. Les événements contenant "Tassili" ou "HR" seront automatiquement triés.</p>
                                    <input type="text" value={icalUrl} onChange={e => setIcalUrl(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono mb-2" />
                                    <button onClick={triggerSync} disabled={isSyncing} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                                        {isSyncing ? <RefreshCw className="animate-spin" /> : <RefreshCw />} {isSyncing ? 'Synchronisation...' : 'Lancer la synchro maintenant'}
                                    </button>
                                </div>

                                <div className="w-full h-px bg-white/10"></div>

                                {/* STEP 2: EXPORT */}
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-300 uppercase mb-2">2. S'abonner sur iPhone (Export)</h3>
                                    <p className="text-xs text-slate-400 mb-3">Ajoutez ce calendrier à votre iPhone pour voir les réservations en temps réel.</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 font-mono truncate">
                                            webcal://app.tassili.com/calendar/feed.ics
                                        </div>
                                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-xl font-bold text-sm"><LinkIcon size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
