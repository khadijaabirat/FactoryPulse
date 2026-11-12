import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MachineList from './pages/MachineList';
import NewMachine from './pages/NewMachine';
import Kanban from './pages/Kanban';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/machines" element={<MachineList />} />
        <Route path="/machines/new" element={<NewMachine />} />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
