import { useState, useEffect } from "react";

export default function useMachines() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {

    async function getMachines() {
      try {
        const response = await fetch("/machines.json");
        if (!response.ok) {
          throw new Error("Impossible de charger les machines");
        }
        const data = await response.json();

        setMachines(data);
        setIsLoading(false);

      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    getMachines();

  }, []);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Disparaît après 3s
  };

  const addMachine = (newMachine) => {
    setMachines((prev) => [...prev, newMachine]);
    showToast(`Machine "${newMachine.nom}" ajoutée avec succès !`, "success");
  };

  const updateStatus = (id, newStatus) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
    showToast(`Statut mis à jour : ${newStatus}`, "info");
  };

  const deleteMachine = (id) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
    showToast("Machine supprimée avec succès", "error");
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