// src/lib/audit.js

// Fonction simple pour tout remettre à zéro
export const resetAllData = () => {
    if (window.confirm("ATTENTION : Vous allez tout remettre à ZÉRO (Montants, Titres, Contrats). Confirmer ?")) {
        // 1. Vide toute la mémoire du navigateur pour ce site
        localStorage.clear();

        // 2. Recharge la page pour appliquer les changements
        window.location.reload();
    }
};

// Garde ces fonctions pour que le reste de l'app ne plante pas
export const logAction = () => { };
export const getLogs = () => [];