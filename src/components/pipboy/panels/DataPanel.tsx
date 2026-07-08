import { profile } from "@/data/profile";

export function DataPanel() {
  return (
    <section className="panel">
      <h2>Contact Data</h2>
      <ul className="linkList">
        <li>
          <a href={`mailto:${profile.contacts.email}`}>{profile.contacts.email}</a>
        </li>
        <li>
          <a href={profile.contacts.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={profile.contacts.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </section>
  );
}
