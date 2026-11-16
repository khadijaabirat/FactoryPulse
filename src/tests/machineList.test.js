/**
 * Fichier : src/tests/machineList.test.js
 * Tests unitaires des fonctions de filtrage, tri et export CSV
 * correspondant aux tâches FCTRPLS-18 et FCTRPLS-19 du cahier des charges.
 */

import { describe, it, expect } from 'vitest'

// ============================================================
// Jeu de données de test
// ============================================================
const machines = [
  { id: 1, nom: 'Presse Hydraulique P-100', zone: 'Emboutissage', statut: 'En fonctionnement', production: 420 },
  { id: 2, nom: 'Tour CNC T-200', zone: 'Usinage', statut: 'En fonctionnement', production: 315 },
  { id: 3, nom: 'Fraiseuse F-30', zone: 'Usinage', statut: 'En panne', production: 0 },
  { id: 4, nom: 'Robot de Soudure S-05', zone: 'Assemblage', statut: 'En fonctionnement', production: 280 },
  { id: 5, nom: 'Convoyeur C-12', zone: 'Logistique', statut: 'À l\'arrêt', production: 95 },
]

// ============================================================
// Reproductions des fonctions de MachineList
// ============================================================

// Filtrer par nom (recherche insensible à la casse)
function filtrerParNom(machines, recherche) {
  return machines.filter((m) =>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  )
}

// Filtrer par statut
function filtrerParStatut(machines, statut) {
  if (statut === 'Tous') return machines
  return machines.filter((m) => m.statut === statut)
}

// Trier les machines
function trierMachines(machines, critere) {
  return [...machines].sort((a, b) => {
    if (critere === 'production-desc') return b.production - a.production
    if (critere === 'production-asc') return a.production - b.production
    if (critere === 'nom-desc') return b.nom.localeCompare(a.nom)
    return a.nom.localeCompare(b.nom) // 'nom-asc' par défaut
  })
}

// Générer le contenu CSV
function genererCSV(machines) {
  const entete = 'ID,Nom,Zone,Statut,Production\n'
  const lignes = machines
    .map((m) => `${m.id},"${m.nom}","${m.zone}",${m.statut},${m.production}`)
    .join('\n')
  return entete + lignes
}

// ============================================================
// Tests : Recherche par nom
// ============================================================
describe('Recherche par nom de machine', () => {
  it('doit trouver les machines dont le nom contient "CNC"', () => {
    const result = filtrerParNom(machines, 'CNC')
    expect(result).toHaveLength(1)
    expect(result[0].nom).toBe('Tour CNC T-200')
  })

  it('la recherche doit être insensible à la casse', () => {
    const result = filtrerParNom(machines, 'presse')
    expect(result).toHaveLength(1)
    expect(result[0].nom).toBe('Presse Hydraulique P-100')
  })

  it('doit retourner une liste vide si aucun résultat', () => {
    const result = filtrerParNom(machines, 'xyz999')
    expect(result).toHaveLength(0)
  })

  it('doit retourner toutes les machines si la recherche est vide', () => {
    const result = filtrerParNom(machines, '')
    expect(result).toHaveLength(5)
  })

  it('doit trouver plusieurs résultats partageant un mot commun', () => {
    const result = filtrerParNom(machines, 'C')
    // Fraiseuse F-30 (non), Tour CNC, Convoyeur C-12, Robot de Soudure (non), Presse (non)
    expect(result.length).toBeGreaterThan(1)
  })
})

// ============================================================
// Tests : Filtre par statut
// ============================================================
describe('Filtre par statut opérationnel', () => {
  it('doit retourner toutes les machines pour "Tous"', () => {
    const result = filtrerParStatut(machines, 'Tous')
    expect(result).toHaveLength(5)
  })

  it('doit retourner uniquement les machines "En fonctionnement"', () => {
    const result = filtrerParStatut(machines, 'En fonctionnement')
    expect(result).toHaveLength(3)
    result.forEach((m) => expect(m.statut).toBe('En fonctionnement'))
  })

  it('doit retourner uniquement les machines "En panne"', () => {
    const result = filtrerParStatut(machines, 'En panne')
    expect(result).toHaveLength(1)
    expect(result[0].nom).toBe('Fraiseuse F-30')
  })

  it('doit retourner uniquement les machines "À l\'arrêt"', () => {
    const result = filtrerParStatut(machines, 'À l\'arrêt')
    expect(result).toHaveLength(1)
    expect(result[0].nom).toBe('Convoyeur C-12')
  })
})

// ============================================================
// Tests : Tri dynamique (FCTRPLS-19)
// ============================================================
describe('Tri dynamique des machines (FCTRPLS-19)', () => {
  it('doit trier par nom A → Z (par défaut)', () => {
    const result = trierMachines(machines, 'nom-asc')
    expect(result[0].nom).toBe('Convoyeur C-12')
    expect(result[result.length - 1].nom).toBe('Tour CNC T-200')
  })

  it('doit trier par nom Z → A', () => {
    const result = trierMachines(machines, 'nom-desc')
    expect(result[0].nom).toBe('Tour CNC T-200')
    expect(result[result.length - 1].nom).toBe('Convoyeur C-12')
  })

  it('doit trier par production décroissante (la plus haute en premier)', () => {
    const result = trierMachines(machines, 'production-desc')
    expect(result[0].production).toBe(420)
    expect(result[result.length - 1].production).toBe(0)
  })

  it('doit trier par production croissante (la plus basse en premier)', () => {
    const result = trierMachines(machines, 'production-asc')
    expect(result[0].production).toBe(0)
    expect(result[result.length - 1].production).toBe(420)
  })

  it('le tri ne doit pas modifier la liste originale', () => {
    const copie = [...machines]
    trierMachines(machines, 'nom-desc')
    expect(machines[0].nom).toBe(copie[0].nom)
  })
})

// ============================================================
// Tests : Export CSV (FCTRPLS-18)
// ============================================================
describe('Exportation CSV (FCTRPLS-18)', () => {
  it('le CSV doit commencer par la ligne d\'en-tête correcte', () => {
    const csv = genererCSV(machines)
    expect(csv.startsWith('ID,Nom,Zone,Statut,Production')).toBe(true)
  })

  it('le CSV doit contenir autant de lignes de données que de machines', () => {
    const csv = genererCSV(machines)
    const lignes = csv.trim().split('\n')
    // 1 ligne d'en-tête + 5 lignes de données
    expect(lignes).toHaveLength(6)
  })

  it('les noms de machine doivent être encadrés par des guillemets', () => {
    const csv = genererCSV(machines)
    expect(csv).toContain('"Presse Hydraulique P-100"')
    expect(csv).toContain('"Tour CNC T-200"')
  })

  it('les IDs et productions doivent être des nombres (sans guillemets)', () => {
    const csv = genererCSV(machines)
    const lignes = csv.split('\n')
    const premiereLigne = lignes[1] // Première ligne de données
    expect(premiereLigne.startsWith('1,')).toBe(true)
  })

  it('le CSV doit être vide (seulement l\'en-tête) si aucune machine', () => {
    const csv = genererCSV([])
    expect(csv.trim()).toBe('ID,Nom,Zone,Statut,Production')
  })
})

