import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a standard font provided by the library or use Helvetica
// For simplicity and immediate reliability, we use Helvetica (standard PDF font)

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
        lineHeight: 1.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    companyInfo: {
        width: '50%',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
        textTransform: 'uppercase',
    },
    clientInfo: {
        width: '40%',
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        color: '#000',
        backgroundColor: '#f5f5f5',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingVertical: 5,
    },
    colDesc: { width: '70%' },
    colPrice: { width: '30%', textAlign: 'right' },
    totalSection: {
        marginTop: 20,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    totalLabel: { fontWeight: 'bold' },
    totalValue: { fontWeight: 'bold', fontSize: 12 },

    // LEGALS
    legalSection: {
        marginTop: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    legalWarning: {
        fontSize: 9,
        color: '#cc0000', // Red for warnings
        fontWeight: 'bold',
        marginBottom: 4,
    },
    legalText: {
        fontSize: 8,
        color: '#666',
        marginBottom: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#999',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    }
});

// LOGIC HELPERS
const COMPANIES = {
    acheres: {
        name: "HR RÉCEPTION",
        address: "8 Rue des Communes, ZAC des Communes,\n78260 ACHÈRES",
        siren: "497 575 514",
        tva: "FR53497575514",
        color: "#2563EB" // Blue
    },
    tassili: {
        name: "TASSILI RÉCEPTION",
        address: "5 Allée de la Rhubarbe,\n78260 ACHÈRES",
        siren: "538 385 386",
        tva: "", // Not specified in prompt, leaving blank or optional
        color: "#D97706" // Gold/Amber
    }
};

export const ContractPDF = ({ data }) => {
    const {
        clientName, eventDate, guests,
        venue, baseOption, menuItems,
        adults, children,
        totals, deposit
    } = data;

    const company = COMPANIES[venue] || COMPANIES.acheres; // Default to HR if error
    const remaining = totals.grandTotal - deposit;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.companyInfo}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: company.color, marginBottom: 4 }}>{company.name}</Text>
                        <Text>{company.address}</Text>
                        <Text>SIREN : {company.siren}</Text>
                        {company.tva && <Text>TVA : {company.tva}</Text>}
                    </View>
                    <View style={styles.clientInfo}>
                        <Text style={styles.invoiceTitle}>CONTRAT</Text>
                        <Text style={{ marginTop: 5 }}>Date : {new Date().toLocaleDateString('fr-FR')}</Text>
                        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>CLIENT :</Text>
                        <Text>{clientName || 'Nom Client'}</Text>
                        <Text>Date Événement : {eventDate}</Text>
                        <Text>{guests} Invités (dont {children} enfants)</Text>
                    </View>
                </View>

                {/* DETAILS */}
                <Text style={styles.sectionTitle}>DÉTAIL DES PRESTATIONS</Text>

                {/* 1. LOCATION */}
                {baseOption && (
                    <View style={styles.row}>
                        <Text style={styles.colDesc}>Location Salle - {baseOption.label}</Text>
                        <Text style={styles.colPrice}>{totals.basePrice} €</Text>
                    </View>
                )}

                {/* 2. ARTS DE LA TABLE (Ex-Traiteur) */}
                {adults > 0 && (
                    <View style={styles.row}>
                        <View style={styles.colDesc}>
                            <Text style={{ fontWeight: 'bold' }}>Arts de la Table (Menu Adulte x{adults})</Text>
                            {menuItems.filter(i => ['entree', 'plat', 'dessert'].includes(i.category)).map(i => (
                                <Text key={i.id} style={{ fontSize: 8, color: '#666', marginLeft: 10 }}>• {i.label}</Text>
                            ))}
                        </View>
                        <Text style={styles.colPrice}>{totals.adultsTotal} €</Text>
                    </View>
                )}

                {/* 3. MENU ENFANT */}
                {children > 0 && (
                    <View style={styles.row}>
                        <Text style={styles.colDesc}>Menu Enfant (-10 ans) (x{children})</Text>
                        <Text style={styles.colPrice}>{totals.childrenTotal} €</Text>
                    </View>
                )}

                {/* 4. DESSERTS FORFAITAIRES (Pièce Montée) */}
                {menuItems.some(i => i.category === 'dessert-fixed') && (
                    <View style={styles.row}>
                        <View style={styles.colDesc}>
                            <Text style={{ fontWeight: 'bold' }}>Desserts Spéciaux (Forfait)</Text>
                            {menuItems.filter(i => i.category === 'dessert-fixed').map(i => (
                                <Text key={i.id} style={{ fontSize: 8, color: '#666', marginLeft: 10 }}>• {i.label}</Text>
                            ))}
                        </View>
                        <Text style={styles.colPrice}>{totals.fixedFoodTotal} €</Text>
                    </View>
                )}

                {/* 5. OPTIONS VIP & EXTRAS */}
                {data.selectedExtras && data.selectedExtras.length > 0 && (
                    <View style={styles.row}>
                        <View style={styles.colDesc}>
                            <Text style={{ fontWeight: 'bold', color: '#7c3aed' }}>OPTIONS PREMIUM & EXTRAS</Text>
                            {data.selectedExtras.map(i => (
                                <Text key={i.id} style={{ fontSize: 8, color: '#444', marginLeft: 10 }}>• {i.label}</Text>
                            ))}
                        </View>
                        <Text style={styles.colPrice}>{totals.extrasTotal} €</Text>
                    </View>
                )}

                {/* TOTALS SECTION */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL GLOBAL TTC</Text>
                        <Text style={styles.totalValue}>{totals.grandTotal.toLocaleString()} €</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>Acompte versé ce jour</Text>
                        <Text>-{deposit.toLocaleString()} €</Text>
                    </View>
                    <View style={{ ...styles.totalRow, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5, marginTop: 5 }}>
                        <Text style={styles.totalLabel}>RESTE À PAYER</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{remaining.toLocaleString()} €</Text>
                    </View>
                </View>

                {/* LEGAL CLAUSES */}
                <View style={styles.legalSection}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>CONDITIONS OBLIGATOIRES & CLAUSES PARTICULIÈRES :</Text>

                    <Text style={styles.legalWarning}>1. SÉCURITÉ & INCENDIE :</Text>
                    <Text style={styles.legalText}>
                        L'utilisation de feux d'artifice, mortiers, fumigènes ou tout dispositif pyrotechnique est STRICTEMENT INTERDITE dans l'enceinte de l'établissement (intérieur et extérieur). Le non-respect de cette clause entraînera l'arrêt immédiat de la prestation sans remboursement.
                    </Text>

                    <Text style={{ ...styles.legalWarning, color: '#333', marginTop: 5 }}>2. CONDITIONS D'ANNULATION :</Text>
                    <Text style={styles.legalText}>
                        Toute somme versée au titre d'acompte est ferme et définitive. Elle ne fera l'objet d'aucun remboursement, quel que soit le motif de l'annulation.
                    </Text>

                    <Text style={{ ...styles.legalWarning, color: '#333', marginTop: 5 }}>3. JUSTIFICATIFS OBLIGATOIRES :</Text>
                    <Text style={styles.legalText}>
                        La validation définitive du dossier de location est conditionnée par la remise d'une copie de la pièce d'identité du signataire en cours de validité ainsi qu'une attestation d'assurance Responsabilité Civile (Villégiature).
                    </Text>
                </View>

                {/* SIGNATURES */}
                <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', marginBottom: 30 }}>Le Client (Mention "Lu et approuvé")</Text>
                        <Text style={{ color: '#ccc' }}>_______________________</Text>
                    </View>
                    <View>
                        <Text style={{ fontWeight: 'bold', marginBottom: 30 }}>La Direction {company.name}</Text>
                        <Text style={{ color: '#ccc' }}>_______________________</Text>
                    </View>
                </View>

                {/* FOOTER */}
                <Text style={styles.footer}>
                    {company.name} - {company.address.split('\n').join(', ')} - SIREN {company.siren}
                </Text>
            </Page>
        </Document>
    );
};
