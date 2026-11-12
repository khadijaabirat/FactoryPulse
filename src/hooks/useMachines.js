// Hook personnalisé — chargement et gestion de l'état des machines
// Utilise fetch + useEffect pour charger /machines.json
// Expose: machines, isLoading, error, addMachine, updateStatus, deleteMachine

import { useState, useEffect } from 'react';

function useMachines() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sera implémenté dans FCTRPLS-11
  }, []);

  return { machines, isLoading, error, setMachines };
}

export default useMachines;
