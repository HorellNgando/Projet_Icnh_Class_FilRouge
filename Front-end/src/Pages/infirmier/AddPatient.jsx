import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        date_de_naissance: '',
        sexe: '',
        nationalite: '',
        adresse: '',
        telephone: '',
        email: '',
        situation_matrimoniale: '',
        contact_urgence: '',
        telephone_urgence: '',
        type_document: '',
        numero_document: '',
        groupe_sanguin: '',
        allergies: '',
        taille: '',
        poids: '',
        temperature: '',
        tension_avc: '',
        pouls: '',
        antecedents_medicaux: '',
        antecedents_chirurgicaux: '',
        traitement_en_cours: '',
        date_admission: '',
        heure_admission: '',
        type_admission: '',
        motif_admission: '',
        service: '',
        medecin_traitant: '',
        chambre: '',
        lit: '',
        type_chambre: '',
        equipements_requis: '',
        oxygen: '',
        precaution_particuliere: '',
        type_paiement: '',
        documents_fournis: '',
        numero_assurance: '',
        numero_police: '',
        titre_assurance: '',
        cout_journalier: '',
        duree_hospitalisation: '',
        cout_total_estime: '',
        couverture_assurance: '',
        modalite_paiement: '',
        relation_patient: '',
        precaution_particuliere_admin: '',
        date_sortie: '',
        heure_sortie: '',
        type_sortie: '',
        diagnostic_final: '',
        evolution_sante: '',
        sejour_amelioration: '',
        date_prochain_rdv: '',
        medecin_rdv: '',
        traitement_prescrit: '',
        instruction_patient: '',
        documents_sortie: '',
        besoins_soins: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/infirmier/patients/add', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/infirmier/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l’ajout du patient.');
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role="infirmier" />
            <div className="flex-1 ml-0 md:ml-64 p-4 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Enregistrement d’un patient</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Nom</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Prénom</label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Date de naissance</label>
                                <input type="date" name="date_de_naissance" value={formData.date_de_naissance} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Sexe</label>
                                <select name="sexe" value={formData.sexe} onChange={handleChange} className="border p-2 rounded w-full" required>
                                    <option value="">Sélectionner</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Féminin">Féminin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Nationalité</label>
                                <input type="text" name="nationalite" value={formData.nationalite} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Adresse</label>
                                <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Téléphone</label>
                                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Situation matrimoniale</label>
                                <select name="situation_matrimoniale" value={formData.situation_matrimoniale} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="Célibataire">Célibataire</option>
                                    <option value="Marié(e)">Marié(e)</option>
                                    <option value="Divorcé(e)">Divorcé(e)</option>
                                    <option value="Veuf/Veuve">Veuf/Veuve</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Personne à contacter en cas d’urgence */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Personne à contacter en cas d’urgence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Nom et prénom</label>
                                <input type="text" name="contact_urgence" value={formData.contact_urgence} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Téléphone</label>
                                <input type="text" name="telephone_urgence" value={formData.telephone_urgence} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Type de document</label>
                                <select name="type_document" value={formData.type_document} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="CNI">CNI</option>
                                    <option value="Passeport">Passeport</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Numéro du document</label>
                                <input type="text" name="numero_document" value={formData.numero_document} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Informations médicales */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Informations médicales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Groupe sanguin</label>
                                <select name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>

                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Allergies</label>
                                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Taille (cm)</label>
                                <input type="number" name="taille" value={formData.taille} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Poids (kg)</label>
                                <input type="number" name="poids" value={formData.poids} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Température (°C)</label>
                                <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Tension artérielle (mmHg)</label>
                                <input type="text" name="tension_avc" value={formData.tension_avc} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Pouls (bpm)</label>
                                <input type="number" name="pouls" value={formData.pouls} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Antécédents médicaux</label>
                                <textarea name="antecedents_medicaux" value={formData.antecedents_medicaux} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Antécédents chirurgicaux</label>
                                <textarea name="antecedents_chirurgicaux" value={formData.antecedents_chirurgicaux} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Traitement en cours</label>
                                <textarea name="traitement_en_cours" value={formData.traitement_en_cours} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                        </div>
                    </div>
                    {/* Admission */}

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Admission</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Date d’admission</label>
                                <input type="date" name="date_admission" value={formData.date_admission} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Heure d’admission</label>
                                <input type="time" name="heure_admission" value={formData.heure_admission} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Type d’admission</label>
                                <select name="type_admission" value={formData.type_admission} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="Urgence">Urgence</option>
                                    <option value="Programmée">Programmée</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Motif d’admission</label>
                                <textarea name="motif_admission" value={formData.motif_admission} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Service</label>
                                <input type="text" name="service" value={formData.service} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Médecin traitant</label>
                                <input type="text" name="medecin_traitant" value={formData.medecin_traitant} onChange={handleChange} className="border p-2 rounded w-full" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Chambre</label>
                                <input type="text" name="chambre" value={formData.chambre} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Lit</label>
                                <input type="text" name="lit" value={formData.lit} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Type de chambre</label>
                                <select name="type_chambre" value={formData.type_chambre} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="Individuelle">Individuelle</option>
                                    <option value="Double">Double</option>
                                    <option value="Commune">Commune</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Équipements requis</label>
                                <input type="text" name="equipements_requis" value={formData.equipements_requis} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Oxygène</label>
                                <select name="oxygen" value={formData.oxygen} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="Oui">Oui</option>
                                    <option value="Non">Non</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Précaution particulière</label>
                                <input type="text" name="precaution_particuliere" value={formData.precaution_particuliere} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                        </div>
                    </div>
                    {/* Informations administratives */}

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Informations administratives</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Type de paiement</label>
                                <select name="type_paiement" value={formData.type_paiement} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="Assurance">Assurance</option>
                                    <option value="Carte">Carte</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Documents fournis</label>
                                <input type="text" name="documents_fournis" value={formData.documents_fournis} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Numéro d’assurance</label>
                                <input type="text" name="numero_assurance" value={formData.numero_assurance} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Numéro de police</label>
                                <input type="text" name="numero_police" value={formData.numero_police} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Titre d’assurance</label>
                                <input type="text" name="titre_assurance" value={formData.titre_assurance} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Coût journalier</label>
                                <input type="number" name="cout_journalier" value={formData.cout_journalier} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Durée d’hospitalisation (jours)</label>
                                <input type="number" name="duree_hospitalisation" value={formData.duree_hospitalisation} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Coût total estimé</label>
                                <input type="number" name="cout_total_estime" value={formData.cout_total_estime} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Couverture d’assurance</label>
                                <input type="text" name="couverture_assurance" value={formData.couverture_assurance} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Modalité de paiement</label>
                                <input type="text" name="modalite_paiement" value={formData.modalite_paiement} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Relation avec le patient</label>
                                <input type="text" name="relation_patient" value={formData.relation_patient} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Précaution particulière</label>
                                <input type="text" name="precaution_particuliere_admin" value={formData.precaution_particuliere_admin} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                        </div>
                    </div>
                    {/* Sortie du patient */}

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Sortie du patient</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div>
                            <label className="block text-gray-700">Date de sortie</label>
                            <input type="date" name="date_sortie" value={formData.date_sortie} onChange={handleChange} className="border p-2 rounded w-full" />
                        </div>
                            <div>
                                <label className="block text-gray-700">Heure de sortie</label>
                                <input type="time" name="heure_sortie" value={formData.heure_sortie} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Type de sortie</label>
                                <select name="type_sortie" value={formData.type_sortie} onChange={handleChange} className="border p-2 rounded w-full">
                                    <option value="">Sélectionner</option>
                                    <option value="Normale">Normale</option>
                                    <option value="Contre avis médical">Contre avis médical</option>
                                    <option value="Transfert">Transfert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Diagnostic final</label>
                                <textarea name="diagnostic_final" value={formData.diagnostic_final} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Évolution de la santé</label>
                                <textarea name="evolution_sante" value={formData.evolution_sante} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Séjour et amélioration</label>
                                <textarea name="sejour_amelioration" value={formData.sejour_amelioration} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Date du prochain rendez-vous</label>
                                <input type="date" name="date_prochain_rdv" value={formData.date_prochain_rdv} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Médecin du rendez-vous</label>
                                <input type="text" name="medecin_rdv" value={formData.medecin_rdv} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Traitement prescrit</label>
                                <textarea name="traitement_prescrit" value={formData.traitement_prescrit} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Instructions au patient</label>
                                <textarea name="instruction_patient" value={formData.instruction_patient} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Documents de sortie</label>
                                <input type="text" name="documents_sortie" value={formData.documents_sortie} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Besoins de soins à domicile</label>
                                <textarea name="besoins_soins" value={formData.besoins_soins} onChange={handleChange} className="border p-2 rounded w-full" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded"> Enregistrer </button>
                </form>
            </div>
        </div>
    );
};
export default AddPatient;