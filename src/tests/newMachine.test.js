/**
 * Fichier : src/tests/newMachine.test.js
 * Tests unitaires de la validation du formulaire d'ajout de machine
 * et de la génération automatique d'ID unique.
 */

import { describe, it, expect } from 'vitest'

// ============================================================
// Reproductions de la logique du formulaire NewMachine
// ============================================================

// Validation du formulaire (retourne un objet d'erreurs)
function validerFormulaire(nom, zone, statut, production) {
  const erreurs = {}

  if (!nom || !nom.trim()) {
    erreurs.nom = 'Le nom de l\'équipement est requis.'
  } else if (nom.trim().length < 3) {
    erreurs.nom = 'Le nom doit comporter au moins 3 caractères.'
  }

  if (!zone || !zone.trim()) {
    erreurs.zone = 'Veuillez sélectionner ou saisir une zone de production.'
  }

  if (!statut) {
    erreurs.statut = 'Le statut opérationnel est obligatoire.'
  }

  if (production === '' || production === null || production === undefined) {
    erreurs.production = 'La production journalière est requise.'
  } else {
    const p = Number(production)
    if (isNaN(p) || p < 0 || !Number.isInteger(p)) {
      erreurs.production = 'La production doit être un entier positif ou nul (≥ 0).'
    }
  }

  return erreurs
}

// Génération d'un identifiant unique
function genererNouvelId(machines) {
  if (!machines || machines.length === 0) return 1
  return Math.max(...machines.map((m) => m.id)) + 1
}

// ============================================================
// Jeu de données de test
// ============================================================
const machinesExistantes = [
  { id: 1, nom: 'Presse P-100', zone: 'Emboutissage', statut: 'En fonctionnement', production: 420 },
  { id: 5, nom: 'Convoyeur C-12', zone: 'Logistique', statut: 'À l\'arrêt', production: 95 },
  { id: 3, nom: 'Fraiseuse F-30', zone: 'Usinage', statut: 'En panne', production: 0 },
]

// ============================================================
// Tests : Validation du formulaire
// ============================================================
describe('Validation du formulaire NewMachine', () => {

  describe('Champ Nom', () => {
    it('doit signaler une erreur si le nom est vide', () => {
      const erreurs = validerFormulaire('', 'Usinage', 'En fonctionnement', '100')
      expect(erreurs.nom).toBeDefined()
    })

    it('doit signaler une erreur si le nom a moins de 3 caractères', () => {
      const erreurs = validerFormulaire('AB', 'Usinage', 'En fonctionnement', '100')
      expect(erreurs.nom).toBeDefined()
    })

    it('ne doit pas signaler d\'erreur si le nom est valide (≥ 3 caractères)', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Usinage', 'En fonctionnement', '100')
      expect(erreurs.nom).toBeUndefined()
    })
  })

  describe('Champ Zone', () => {
    it('doit signaler une erreur si la zone est vide', () => {
      const erreurs = validerFormulaire('Presse P-200', '', 'En fonctionnement', '100')
      expect(erreurs.zone).toBeDefined()
    })

    it('ne doit pas signaler d\'erreur si la zone est renseignée', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Atelier Usinage', 'En fonctionnement', '100')
      expect(erreurs.zone).toBeUndefined()
    })
  })

  describe('Champ Production', () => {
    it('doit signaler une erreur si la production est vide', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Usinage', 'En fonctionnement', '')
      expect(erreurs.production).toBeDefined()
    })

    it('doit signaler une erreur si la production est négative', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Usinage', 'En fonctionnement', '-5')
      expect(erreurs.production).toBeDefined()
    })

    it('doit signaler une erreur si la production est un nombre décimal', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Usinage', 'En fonctionnement', '10.5')
      expect(erreurs.production).toBeDefined()
    })

    it('ne doit pas signaler d\'erreur si la production est 0', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Usinage', 'En fonctionnement', '0')
      expect(erreurs.production).toBeUndefined()
    })

    it('ne doit pas signaler d\'erreur si la production est un entier positif', () => {
      const erreurs = validerFormulaire('Presse P-200', 'Usinage', 'En fonctionnement', '350')
      expect(erreurs.production).toBeUndefined()
    })
  })

  describe('Formulaire complet', () => {
    it('doit retourner 0 erreur si tous les champs sont valides', () => {
      const erreurs = validerFormulaire('Découpeuse L-500', 'Atelier Découpe', 'En fonctionnement', '200')
      expect(Object.keys(erreurs)).toHaveLength(0)
    })

    it('doit retourner des erreurs pour tous les champs si tout est vide', () => {
      const erreurs = validerFormulaire('', '', '', '')
      expect(Object.keys(erreurs).length).toBeGreaterThan(0)
      expect(erreurs.nom).toBeDefined()
      expect(erreurs.zone).toBeDefined()
      expect(erreurs.production).toBeDefined()
    })
  })
})

// ============================================================
// Tests : Génération d'ID unique
// ============================================================
describe('Génération automatique d\'ID unique', () => {
  it('doit générer l\'ID max + 1 (ici 5 + 1 = 6)', () => {
    const nouvelId = genererNouvelId(machinesExistantes)
    expect(nouvelId).toBe(6)
  })

  it('doit générer l\'ID 1 si la liste est vide', () => {
    const nouvelId = genererNouvelId([])
    expect(nouvelId).toBe(1)
  })

  it('l\'ID généré doit toujours être supérieur à tous les IDs existants', () => {
    const nouvelId = genererNouvelId(machinesExistantes)
    const tousLesIds = machinesExistantes.map((m) => m.id)
    expect(nouvelId).toBeGreaterThan(Math.max(...tousLesIds))
  })
})

