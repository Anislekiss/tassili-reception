// src/lib/audit.js

// Récupère les clés actives (non-backup)
const getActiveKeys = () => {
    return Object.keys(localStorage).filter(key => !key.startsWith('backup_'));
};

// 1. SAUVEGARDE AUTOMATIQUE (Au démarrage, ne touche pas si existe déjà)
export const runAutoBackup = () => {
    const today = new Date().toLocaleDateString('fr-CA');
    const backupKey = `backup_${today}`;

    if (!localStorage.getItem(backupKey)) {
        saveCurrentState(true); // Sauvegarde initale silencieuse
    }
};

// 2. SAUVEGARDE MANUELLE (La fonction qui manquait !)
export const saveCurrentState = (isSilent = false) => {
    const today = new Date().toLocaleDateString('fr-CA');
    const backupKey = `backup_${today}`;

    const fullBackup = {};
    getActiveKeys().forEach(key => {
        const value = localStorage.getItem(key);
        if (value) fullBackup[key] = value;
    });

    if (Object.keys(fullBackup).length > 0) {
        localStorage.setItem(backupKey, JSON.stringify(fullBackup));
        if (!isSilent) {
            // Petit log pour confirmer (optionnel)
            console.log(`✅ Sauvegarde manuelle effectuée pour le ${today}`);
            alert(`✅ État actuel sauvegardé avec succès !`);
        }
    }
};

// 3. RESTAURATION
export const restoreBackup = (dateKey) => {
    const backupData = localStorage.getItem(dateKey);
    if (!backupData) return;

    if (window.confirm(`⚠️ RESTAURATION\n\nVous allez remplacer l'affichage actuel par la sauvegarde du ${dateKey.replace('backup_', '')}.\n\nContinuer ?`)) {
        const data = JSON.parse(backupData);
        getActiveKeys().forEach(key => localStorage.removeItem(key)); // Nettoie
        Object.keys(data).forEach(key => localStorage.setItem(key, data[key])); // Restaure
        window.location.reload();
    }
};

export const getAvailableBackups = () => {
    return Object.keys(localStorage).filter(key => key.startsWith('backup_')).sort().reverse();
};

export const resetAllData = () => {
    if (window.confirm("🚨 RESET TOTAL ?\n\nVos données actuelles seront effacées. (Vos sauvegardes restent disponibles).")) {
        getActiveKeys().forEach(key => localStorage.removeItem(key));
        window.location.reload();
    }
};

// Compatibilité pour éviter les erreurs
export const logAction = () => { };
export const getLogs = () => [];