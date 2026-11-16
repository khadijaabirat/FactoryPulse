/**
 * Fichier : src/tests/dashboard.test.js
 * Tests unitaires des calculs du Tableau de bord (KPIs)
 *
 * On vérifie que les 3 indicateurs obligatoires du cahier des charges
 * sont calculés correctement selon l'état des machines.
 */

import { describe, it, expect } from 'vitest'

// ============================================================
// Jeu de données de test
// ============================================================
const machines = [
  { id: 1, nom: 'Presse P-100', zone: 'Emboutissage', statut: 'En fonctionnement', production: 420 },
  { id: 2, nom: 'Tour CNC T-200', zone: 'Usinage', statut: 'En fonctionnement', production: 315 },
  { id: 3, nom: 'Fraiseuse F-30', zone: 'Usinage', statut: 'En panne', production: 0 },
  { id: 4, nom: 'Robot S-05', zone: 'Assemblage', statut: 'En fonctionnement', production: 280 },
  { id: 5, nom: 'Convoyeur C-12', zone: 'Logistique', statut: 'À l\'arrêt', production: 95 },
  { id: 6, nom: 'Laser L-400', zone: 'Découpe', statut: 'En fonctionnement', production: 510 },
  { id: 7, nom: 'Compresseur K-80', zone: 'Utilités', statut: 'En panne', production: 0 },
  { id: 8, nom: 'Emballeuse E-15', zone: 'Conditionnement', statut: 'À l\'arrêt', production: 140 },
]

// ============================================================
// Reproductions des calculs du Dashboard
// ============================================================
function calculerKPIs(machines) {
  const total = machines.length
  const enFonctionnement = machines.filter((m) => m.statut === 'En fonctionnement').length
  const enPanne = machines.filter((m) => m.statut === 'En panne').length
  const aLArret = machines.filter((m) => m.statut === 'À l\'arrêt').length
  const totalProduction = machines.reduce((somme, m) => somme + (Number(m.production) || 0), 0)
  const tauxDisponibilite = total > 0 ? Math.round((enFonctionnement / total) * 100) : 0
  return { total, enFonctionnement, enPanne, aLArret, totalProduction, tauxDisponibilite }
}

// ============================================================
// Tests : KPI 1 — Total des machines
// ============================================================
describe('KPI 1 — Total des machines', () => {
  it('doit compter exactement 8 machines', () => {
    const { total } = calculerKPIs(machines)
    expect(total).toBe(8)
  })

  it('doit retourner 0 si la liste est vide', () => {
    const { total } = calculerKPIs([])
    expect(total).toBe(0)
  })
})

// ============================================================
// Tests : KPI 2 — Machines en fonctionnement
// ============================================================
describe('KPI 2 — Machines en fonctionnement', () => {
  it('doit compter 4 machines en fonctionnement', () => {
    const { enFonctionnement } = calculerKPIs(machines)
    expect(enFonctionnement).toBe(4)
  })

  it('doit retourner 0 si aucune machine n\'est en fonctionnement', () => {
    const aucuneFonctionnelle = machines.map((m) => ({ ...m, statut: 'En panne' }))
    const { enFonctionnement } = calculerKPIs(aucuneFonctionnelle)
    expect(enFonctionnement).toBe(0)
  })
})

// ============================================================
// Tests : KPI 3 — Machines en panne
// ============================================================
describe('KPI 3 — Machines en panne', () => {
  it('doit compter 2 machines en panne', () => {
    const { enPanne } = calculerKPIs(machines)
    expect(enPanne).toBe(2)
  })

  it('doit retourner 0 si aucune machine n\'est en panne', () => {
    const aucunePanne = machines.map((m) => ({ ...m, statut: 'En fonctionnement' }))
    const { enPanne } = calculerKPIs(aucunePanne)
    expect(enPanne).toBe(0)
  })
})

// ============================================================
// Tests : Production totale
// ============================================================
describe('Production totale journalière', () => {
  it('doit additionner correctement toutes les productions', () => {
    const { totalProduction } = calculerKPIs(machines)
    // 420 + 315 + 0 + 280 + 95 + 510 + 0 + 140 = 1760
    expect(totalProduction).toBe(1760)
  })

  it('doit retourner 0 si toutes les productions sont à 0', () => {
    const toutesArretees = machines.map((m) => ({ ...m, production: 0 }))
    const { totalProduction } = calculerKPIs(toutesArretees)
    expect(totalProduction).toBe(0)
  })
})

// ============================================================
// Tests : Taux de disponibilité
// ============================================================
describe('Taux de disponibilité (%)', () => {
  it('doit calculer 50% (4 sur 8 en fonctionnement)', () => {
    const { tauxDisponibilite } = calculerKPIs(machines)
    expect(tauxDisponibilite).toBe(50)
  })

  it('doit retourner 100% si toutes les machines fonctionnent', () => {
    const toutesFonctionnelles = machines.map((m) => ({ ...m, statut: 'En fonctionnement' }))
    const { tauxDisponibilite } = calculerKPIs(toutesFonctionnelles)
    expect(tauxDisponibilite).toBe(100)
  })

  it('doit retourner 0% si aucune machine ne fonctionne', () => {
    const toutesEnPanne = machines.map((m) => ({ ...m, statut: 'En panne' }))
    const { tauxDisponibilite } = calculerKPIs(toutesEnPanne)
    expect(tauxDisponibilite).toBe(0)
  })

  it('doit retourner 0% si la liste est vide (pas de division par zéro)', () => {
    const { tauxDisponibilite } = calculerKPIs([])
    expect(tauxDisponibilite).toBe(0)
  })
})

