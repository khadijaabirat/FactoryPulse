// Composant réutilisable — carte d'indicateur (Total, En fonctionnement, En panne)
// Props: title (string), value (number), color (string)

function StatCard({ title, value, color }) {
  return (
    <div style={{ borderLeft: `4px solid ${color}` }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default StatCard;
