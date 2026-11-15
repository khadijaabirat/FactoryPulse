import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour gérer l'état global des machines industrielles.
 * Gère le chargement initial depuis /machines.json et les opérations CRUD en mémoire.
 */
export default function useMachines() {
  // 1. États principaux
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // 2. Chargement initial des 8 machines au démarrage du composant
  useEffect(() => {
    async function getMachines() {
      try {
        const response = await fetch("/machines.json");
        if (!response.ok) {
          throw new Error("Impossible de charger les données des machines.");
        }
        const data = await response.json();
        setMachines(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    getMachines();
  }, []);

  // 3. Fonction utilitaire pour afficher un message temporaire (Toast)
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Disparaît automatiquement après 3 secondes
  };

  // 4. Ajouter une nouvelle machine
  const addMachine = (nouvelleMachine) => {
    setMachines((prevMachines) => [...prevMachines, nouvelleMachine]);
    showToast(`Machine "${nouvelleMachine.nom}" ajoutée avec succès !`, "success");
  };

  // 5. Mettre à jour le statut d'une machine (synchronisé sur toutes les vues)
  const updateStatus = (id, nouveauStatut) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine.id === id ? { ...machine, statut: nouveauStatut } : machine
      )
    );
    showToast(`Statut mis à jour : ${nouveauStatut}`, "info");
  };

  // 6. Supprimer une machine
  const deleteMachine = (id) => {
    setMachines((prevMachines) =>
      prevMachines.filter((machine) => machine.id !== id)
    );
    showToast("Machine supprimée avec succès.", "error");
  };

  return {
    machines,
    isLoading,
    error,
    toast,
    setToast,
    addMachine,
    updateStatus,
    deleteMachine,
  };
}
