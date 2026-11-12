// Composant réutilisable — carte d'une machine
// Props: machine (objet), onStatusChange (fn), onDelete (fn)

function MachineCard({ machine, onStatusChange, onDelete }) {
  return (
    <div>
      <h3>{machine?.nom}</h3>
    </div>
  );
}

export default MachineCard;
