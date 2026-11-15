import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MachineList from "./components/MachineList";
import NewMachine from "./components/NewMachine";
import Kanban from "./components/Kanban";
import Toast from "./components/Toast";
import useMachines from "./hooks/useMachines";

/**
 * Composant racine App :
 * Configure le routage de l'application et partage l'état global fourni par useMachines.
 */
export default function App() {
  const {
    machines,
    isLoading,
    error,
    toast,
    setToast,
    addMachine,
    updateStatus,
    deleteMachine,
  } = useMachines();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        {/* Barre de navigation latérale */}
        <Sidebar />

        {/* Zone de contenu dynamique selon la route */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            {/* Route 1 : Tableau de bord avec les 3 indicateurs KPI en direct */}
            <Route
              path="/"
              element={
                <Dashboard
                  machines={machines}
                  isLoading={isLoading}
                  error={error}
                />
              }
            />

            {/* Route 2 : Gestion des machines (liste, filtres, tri, export CSV) */}
            <Route
              path="/machines"
              element={
                <MachineList
                  machines={machines}
                  isLoading={isLoading}
                  error={error}
                  onStatusChange={updateStatus}
                  onDelete={deleteMachine}
                />
              }
            />

            {/* Route 3 : Formulaire contrôlé d'ajout d'une machine */}
            <Route
              path="/machines/new"
              element={
                <NewMachine
                  onAdd={addMachine}
                  machines={machines}
                />
              }
            />

            {/* Route 4 (Challenge) : Tableau Kanban interactif */}
            <Route
              path="/kanban"
              element={
                <Kanban
                  machines={machines}
                  onStatusChange={updateStatus}
                />
              }
            />
          </Routes>
        </main>
      </div>

      {/* Notification Toast globale */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </BrowserRouter>
  );
}
