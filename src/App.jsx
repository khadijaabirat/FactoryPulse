import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MachineList from "./components/MachineList";
import NewMachine from "./components/NewMachine";
import Kanban from "./components/Kanban";
import Toast from "./components/Toast";
import useMachines from "./hooks/useMachines";

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
      <div className="flex min-h-screen bg-zinc-100/70 text-zinc-900">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
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

            <Route
              path="/machines/new"
              element={
                <NewMachine
                  onAdd={addMachine}
                  machines={machines}
                />
              }
            />

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
