function StatCard({ label, value, description, colour }) {
  return (
    <div className={`card stat-card ${colour}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </div>
  );
}

export default StatCard;