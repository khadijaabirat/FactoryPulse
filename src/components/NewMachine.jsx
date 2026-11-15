import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NewMachine({ onAdd, machines = [] }) {
  const navigate = useNavigate();

  // 1. Déclaration des états pour chaque champ du formulaire (composant contrôlé)
  const [nom, setNom] = useState("");
  const [zone, setZone] = useState("");
  const [statut, setStatut] = useState("En fonctionnement");
  const [production, setProduction] = useState("");

  // 2. État pour stocker les erreurs de validation
  const [erreurs, setErreurs] = useState({});

  // Liste des ateliers typiques de l'usine de Safi
  const zonesSafi = [
    "Atelier Emboutissage",
    "Atelier Usinage",
    "Atelier Assemblage",
    "Atelier Logistique",
    "Atelier Découpe",
    "Atelier Utilités",
    "Atelier Conditionnement",
  ];

  // 3. Fonction de validation du formulaire
  const valider = () => {
    const nouvellesErreurs = {};

    // Validation du nom (obligatoire et au moins 3 caractères)
    if (!nom.trim()) {
      nouvellesErreurs.nom = "Le nom de la machine est obligatoire.";
    } else if (nom.trim().length < 3) {
      nouvellesErreurs.nom = "Le nom doit comporter au moins 3 caractères.";
    }

    // Validation de la zone (obligatoire)
    if (!zone.trim()) {
      nouvellesErreurs.zone = "Veuillez choisir ou saisir une zone de production.";
    }

    // Validation du statut (obligatoire)
    if (!statut) {
      nouvellesErreurs.statut = "Le statut est obligatoire.";
    }

    // Validation de la production journalière (obligatoire, nombre >= 0)
    if (production === "" || production === null) {
      nouvellesErreurs.production = "La production journalière est obligatoire.";
    } else {
      const nombreProduction = Number(production);
      if (isNaN(nombreProduction) || nombreProduction < 0) {
        nouvellesErreurs.production = "La production doit être un nombre positif ou nul (≥ 0).";
      }
    }

    setErreurs(nouvellesErreurs);
    // Retourne true s'il n'y a aucune erreur
    return Object.keys(nouvellesErreurs).length === 0;
  };

  // 4. Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si le formulaire n'est pas valide, on ne fait rien
    if (!valider()) {
      return;
    }

    // Génération automatique d'un identifiant unique (ID max + 1)
    const nouvelId =
      machines && machines.length > 0
        ? Math.max(...machines.map((m) => m.id)) + 1
        : 1;

    // Création du nouvel objet machine
    const nouvelleMachine = {
      id: nouvelId,
      nom: nom.trim(),
      zone: zone.trim(),
      statut: statut,
      production: Number(production),
    };

    // Ajout de la machine dans l'état global
    if (onAdd) {
      onAdd(nouvelleMachine);
    }

    // Redirection vers la liste des machines
    navigate("/machines");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ajouter une nouvelle machine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enregistrez un nouvel équipement sur le site de production de Safi
          </p>
        </div>
        <Link
          to="/machines"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-sm"
        >
          ← Retour à la liste
        </Link>
      </div>

      {/* Formulaire contrôlé */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
      >
        {/* Champ 1 : Nom de la machine */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Nom de l'équipement <span className="text-rose-500">*</span>
          </label>
          <input
            id="nom"
            type="text"
            placeholder="Ex : Presse Hydraulique P-150"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
              erreurs.nom
                ? "border-rose-400 focus:ring-rose-200"
                : "border-slate-200 focus:ring-blue-500"
            }`}
          />
          {erreurs.nom && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">
              {erreurs.nom}
            </p>
          )}
        </div>

        {/* Champ 2 : Zone de production */}
        <div>
          <label
            htmlFor="zone"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Zone de production (Atelier) <span className="text-rose-500">*</span>
          </label>
          <input
            id="zone"
            type="text"
            list="zones-list"
            placeholder="Ex : Atelier Usinage"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
              erreurs.zone
                ? "border-rose-400 focus:ring-rose-200"
                : "border-slate-200 focus:ring-blue-500"
            }`}
          />
          <datalist id="zones-list">
            {zonesSafi.map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
          {erreurs.zone && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">
              {erreurs.zone}
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Astuce : vous pouvez sélectionner un atelier suggéré ou taper un nouveau nom.
          </p>
        </div>

        {/* Champ 3 : Statut initial */}
        <div>
          <label
            htmlFor="statut"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Statut initial <span className="text-rose-500">*</span>
          </label>
          <select
            id="statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="En fonctionnement">En fonctionnement (Opérationnel)</option>
            <option value="À l'arrêt">À l'arrêt (En veille / Pause)</option>
            <option value="En panne">En panne (Maintenance requise)</option>
          </select>
          {erreurs.statut && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">
              {erreurs.statut}
            </p>
          )}
        </div>

        {/* Champ 4 : Production journalière */}
        <div>
          <label
            htmlFor="production"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Production journalière (pièces) <span className="text-rose-500">*</span>
          </label>
          <input
            id="production"
            type="number"
            min="0"
            placeholder="Ex : 250"
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
              erreurs.production
                ? "border-rose-400 focus:ring-rose-200"
                : "border-slate-200 focus:ring-blue-500"
            }`}
          />
          {erreurs.production && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">
              {erreurs.production}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/machines"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <span>+</span>
            <span>Enregistrer la machine</span>
          </button>
        </div>
      </form>
    </div>
  );
}
