import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NewMachine({ onAdd, machines = [] }) {
  const navigate = useNavigate();

  // États du formulaire
  const [nom, setNom] = useState("");
  const [zone, setZone] = useState("");
  const [statut, setStatut] = useState("En fonctionnement");
  const [production, setProduction] = useState("");
  const [erreurs, setErreurs] = useState({});

  const zonesSafi = [
    "Atelier Emboutissage",
    "Atelier Usinage",
    "Atelier Assemblage",
    "Atelier Logistique",
    "Atelier Découpe",
    "Atelier Utilités",
    "Atelier Conditionnement",
  ];

  const valider = () => {
    const nouvellesErreurs = {};

    if (!nom.trim()) {
      nouvellesErreurs.nom = "Le nom de l'équipement est requis.";
    } else if (nom.trim().length < 3) {
      nouvellesErreurs.nom = "Le nom doit comporter au moins 3 caractères.";
    }

    if (!zone.trim()) {
      nouvellesErreurs.zone = "Veuillez sélectionner ou saisir une zone de production.";
    }

    if (!statut) {
      nouvellesErreurs.statut = "Le statut opérationnel est obligatoire.";
    }

    if (production === "" || production === null) {
      nouvellesErreurs.production = "La production journalière est requise.";
    } else {
      const p = Number(production);
      if (isNaN(p) || p < 0 || !Number.isInteger(p)) {
        nouvellesErreurs.production = "La production doit être un entier positif ou nul (≥ 0).";
      }
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valider()) return;

    const nouvelId =
      machines && machines.length > 0
        ? Math.max(...machines.map((m) => m.id)) + 1
        : 1;

    const nouvelleMachine = {
      id: nouvelId,
      nom: nom.trim(),
      zone: zone.trim(),
      statut: statut,
      production: Number(production),
    };

    if (onAdd) {
      onAdd(nouvelleMachine);
    }

    navigate("/machines");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Enregistrer un Équipement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ajout d'une nouvelle unité de production au parc de Safi
          </p>
        </div>
        <Link
          to="/machines"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
        >
          <span>← Retour</span>
        </Link>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5"
      >
        {/* Nom */}
        <div className="space-y-1.5">
          <label htmlFor="nom" className="block text-xs font-semibold text-slate-700">
            Désignation de la machine <span className="text-rose-500">*</span>
          </label>
          <input
            id="nom"
            type="text"
            placeholder="Ex : Presse Hydraulique P-150"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={`w-full px-3.5 py-2 text-xs bg-slate-50/80 hover:bg-slate-50 focus:bg-white border rounded-xl focus:outline-none focus:ring-2 transition ${
              erreurs.nom
                ? "border-rose-400 focus:ring-rose-200"
                : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {erreurs.nom && (
            <p className="text-[11px] text-rose-600 font-medium">
              {erreurs.nom}
            </p>
          )}
        </div>

        {/* Zone */}
        <div className="space-y-1.5">
          <label htmlFor="zone" className="block text-xs font-semibold text-slate-700">
            Atelier / Zone de production <span className="text-rose-500">*</span>
          </label>
          <input
            id="zone"
            type="text"
            list="zones-safi"
            placeholder="Sélectionnez ou saisissez un atelier..."
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className={`w-full px-3.5 py-2 text-xs bg-slate-50/80 hover:bg-slate-50 focus:bg-white border rounded-xl focus:outline-none focus:ring-2 transition ${
              erreurs.zone
                ? "border-rose-400 focus:ring-rose-200"
                : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          <datalist id="zones-safi">
            {zonesSafi.map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
          {erreurs.zone && (
            <p className="text-[11px] text-rose-600 font-medium">
              {erreurs.zone}
            </p>
          )}
        </div>

        {/* Statut initial & Production (2 colonnes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="statut" className="block text-xs font-semibold text-slate-700">
              Statut initial <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="statut"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="w-full px-3.5 pr-8 py-2 text-xs font-medium bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer text-slate-700"
              >
                <option value="En fonctionnement">En fonctionnement</option>
                <option value="À l'arrêt">À l'arrêt</option>
                <option value="En panne">En panne</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {erreurs.statut && (
              <p className="text-[11px] text-rose-600 font-medium">
                {erreurs.statut}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="production" className="block text-xs font-semibold text-slate-700">
              Production journalière (pièces) <span className="text-rose-500">*</span>
            </label>
            <input
              id="production"
              type="number"
              min="0"
              placeholder="Ex : 350"
              value={production}
              onChange={(e) => setProduction(e.target.value)}
              className={`w-full px-3.5 py-2 text-xs bg-slate-50/80 hover:bg-slate-50 focus:bg-white border rounded-xl focus:outline-none focus:ring-2 transition ${
                erreurs.production
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
            {erreurs.production && (
              <p className="text-[11px] text-rose-600 font-medium">
                {erreurs.production}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Link
            to="/machines"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Enregistrer la machine</span>
          </button>
        </div>
      </form>
    </div>
  );
}
