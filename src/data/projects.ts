export type PortfolioProject = {
  id: string;
  title: string;
  status: "Live" | "In Progress" | "Coming Soon";
  description: string;
  notionUrl: string;
};

export const projects: PortfolioProject[] = [
  {
    id: "youtuber-site",
    title: "Sito YouTuber/Artista",
    status: "In Progress",
    description: "End-to-end redesign with full UX case study and implementation notes.",
    notionUrl: "https://www.notion.so/your-public-case-study"
  },
  {
    id: "senior-collab",
    title: "Collab con Programmatore Senior",
    status: "Coming Soon",
    description: "Design system collaboration, handoff process, and teamwork case notes.",
    notionUrl: "https://www.notion.so/your-public-case-study"
  }
];
