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

  const addMachine = (newMachine) => {
    setMachines((prev) => [...prev, newMachine]);
  };

  const updateStatus = (id, newStatus) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const deleteMachine = (id) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    machines, isLoading, error, addMachine, updateStatus, deleteMachine,
  };
}