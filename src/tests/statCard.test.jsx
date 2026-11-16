/**
 * Fichier : src/tests/statCard.test.jsx
 * Tests du composant StatCard : vérification du rendu
 * et des props (title, value, subtitle, badgeText).
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '../components/StatCard'

// ============================================================
// Tests du composant StatCard
// ============================================================
describe('Composant StatCard — Rendu et affichage', () => {
  it('doit afficher le titre passé en prop', () => {
    render(<StatCard title="Total des machines" value={8} color="blue" />)
    expect(screen.getByText('Total des machines')).toBeInTheDocument()
  })

  it('doit afficher la valeur numérique passée en prop', () => {
    render(<StatCard title="En fonctionnement" value={4} color="green" />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('doit afficher 0 si la valeur est undefined', () => {
    render(<StatCard title="En panne" color="red" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('doit afficher le sous-titre si fourni', () => {
    render(
      <StatCard
        title="Machines actives"
        value={4}
        color="green"
        subtitle="50% des équipements actifs"
      />
    )
    expect(screen.getByText('50% des équipements actifs')).toBeInTheDocument()
  })

  it('ne doit pas afficher le sous-titre s\'il n\'est pas fourni', () => {
    const { container } = render(
      <StatCard title="Total" value={8} color="blue" />
    )
    // Le footer avec le sous-titre ne doit pas exister
    const footer = container.querySelector('.border-t')
    expect(footer).not.toBeInTheDocument()
  })

  it('doit afficher le badge s\'il est fourni', () => {
    render(
      <StatCard
        title="Total"
        value={8}
        color="blue"
        badgeText="8 unités"
      />
    )
    expect(screen.getByText('8 unités')).toBeInTheDocument()
  })
})

