import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MachineList from "./components/MachineList";
import NewMachine from "./components/NewMachine";
import Kanban from "./components/Kanban";

export default function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-slate-50 text-slate-900">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/machines" element={<MachineList />} />
                        <Route path="/machines/new" element={<NewMachine />} />
                        <Route path="/kanban" element={<Kanban />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}