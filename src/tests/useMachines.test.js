/**
 * Fichier : src/tests/useMachines.test.js
 * Tests unitaires du hook useMachines (logique métier centrale)
 *
 * On teste ici les fonctions pures addMachine, updateStatus et deleteMachine
 * en simulant l'état React manuellement (sans render).
 */

import { describe, it, expect } from 'vitest'

// ============================================================
// Données de test : 3 machines fictives
// ============================================================
const machinesInitiales = [
  { id: 1, nom: 'Presse Hydraulique P-100', zone: 'Atelier Emboutissage', statut: 'En fonctionnement', production: 420 },
  { id: 2, nom: 'Tour CNC T-200', zone: 'Atelier Usinage', statut: 'En fonctionnement', production: 315 },
  { id: 3, nom: 'Fraiseuse F-30', zone: 'Atelier Usinage', statut: 'En panne', production: 0 },
]

// ============================================================
// Reproductions des fonctions de useMachines (logique pure)
// ============================================================

// Ajout d'une nouvelle machine
function addMachine(machines, nouvelleMachine) {
  return [...machines, nouvelleMachine]
}

// Mise à jour du statut d'une machine par son ID
function updateStatus(machines, id, nouveauStatut) {
  return machines.map((m) =>
    m.id === id ? { ...m, statut: nouveauStatut } : m
  )
}

// Suppression d'une machine par son ID
function deleteMachine(machines, id) {
  return machines.filter((m) => m.id !== id)
}

// ============================================================
// Tests : addMachine
// ============================================================
describe('addMachine — Ajout d\'une machine', () => {
  it('doit augmenter le nombre de machines de 1', () => {
    const nouvelleMachine = {
      id: 4,
      nom: 'Robot de Soudure S-05',
      zone: 'Atelier Assemblage',
      statut: 'En fonctionnement',
      production: 280,
    }

    const result = addMachine(machinesInitiales, nouvelleMachine)
    expect(result).toHaveLength(4)
  })

  it('doit ajouter la nouvelle machine à la fin de la liste', () => {
    const nouvelleMachine = {
      id: 9,
      nom: 'Convoyeur X-50',
      zone: 'Atelier Logistique',
      statut: 'À l\'arrêt',
      production: 0,
    }

    const result = addMachine(machinesInitiales, nouvelleMachine)
    expect(result[result.length - 1].nom).toBe('Convoyeur X-50')
  })

  it('ne doit pas modifier la liste originale (immuabilité)', () => {
    const nouvelleMachine = { id: 10, nom: 'Test', zone: 'Test', statut: 'En panne', production: 0 }
    addMachine(machinesInitiales, nouvelleMachine)
    expect(machinesInitiales).toHaveLength(3)
  })
})

// ============================================================
// Tests : updateStatus
// ============================================================
describe('updateStatus — Changement de statut', () => {
  it('doit changer le statut de la machine avec l\'ID correspondant', () => {
    const result = updateStatus(machinesInitiales, 3, 'En fonctionnement')
    const machineModifiee = result.find((m) => m.id === 3)
    expect(machineModifiee.statut).toBe('En fonctionnement')
  })

  it('ne doit pas modifier les autres machines', () => {
    const result = updateStatus(machinesInitiales, 3, 'En fonctionnement')
    const machine1 = result.find((m) => m.id === 1)
    const machine2 = result.find((m) => m.id === 2)
    expect(machine1.statut).toBe('En fonctionnement')
    expect(machine2.statut).toBe('En fonctionnement')
  })

  it('doit garder le même nombre de machines', () => {
    const result = updateStatus(machinesInitiales, 1, 'En panne')
    expect(result).toHaveLength(3)
  })

  it('ne doit pas modifier la liste originale (immuabilité)', () => {
    updateStatus(machinesInitiales, 1, 'En panne')
    const machine1 = machinesInitiales.find((m) => m.id === 1)
    expect(machine1.statut).toBe('En fonctionnement')
  })
})

// ============================================================
// Tests : deleteMachine
// ============================================================
describe('deleteMachine — Suppression d\'une machine', () => {
  it('doit réduire le nombre de machines de 1', () => {
    const result = deleteMachine(machinesInitiales, 2)
    expect(result).toHaveLength(2)
  })

  it('la machine supprimée ne doit plus être dans la liste', () => {
    const result = deleteMachine(machinesInitiales, 2)
    const machineExiste = result.find((m) => m.id === 2)
    expect(machineExiste).toBeUndefined()
  })

  it('les autres machines doivent rester intactes', () => {
    const result = deleteMachine(machinesInitiales, 2)
    expect(result[0].id).toBe(1)
    expect(result[1].id).toBe(3)
  })
})

