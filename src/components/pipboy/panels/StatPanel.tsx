import { profile } from "@/data/profile";

export function StatPanel() {
  return (
    <section className="panel">
      <h2>{profile.name}</h2>
      <p className="muted">{profile.role}</p>
      <p>{profile.bio}</p>
      <div className="statsGrid">
        {profile.specialStats.map((stat) => (
          <div key={stat.label} className="statRow">
            <span>{stat.label}</span>
            <span>{stat.value}/10</span>
          </div>
        ))}
      </div>
    </section>
  );
}
