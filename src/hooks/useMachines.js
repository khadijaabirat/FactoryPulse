import { useState, useEffect } from "react";

export default function useMachines() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addMachine = (nouvelleMachine) => {
    setMachines((prevMachines) => [...prevMachines, nouvelleMachine]);
    showToast(`Machine "${nouvelleMachine.nom}" ajoutée avec succès !`, "success");
  };

  const updateStatus = (id, nouveauStatut) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine.id === id ? { ...machine, statut: nouveauStatut } : machine
      )
    );
    showToast(`Statut mis à jour : ${nouveauStatut}`, "info");
  };

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
