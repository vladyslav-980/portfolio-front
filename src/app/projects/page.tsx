import type { Metadata } from "next";
import ProjectsPortfolio from "@/components/ProjectsPortfolio";

export const metadata: Metadata = {
  title: "Projects | Vladyslav Huminiuk",
  description: "Selected web development projects and client testimonials by Vladyslav Huminiuk.",
};

export default function ProjectsPage() {
  return <ProjectsPortfolio />;
}
