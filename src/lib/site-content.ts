import { list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export type FeaturedWorkItem = {
  title: string;
  description: string;
  roles: string[];
  image: string;
};

export type ExperienceItem = {
  icon: string;
  role: string;
  location: string;
  startYear: string;
  endYear: string;
  bulletPoints: string[];
};

export type EducationItem = {
  date: string;
  title: string;
  subtitle: string;
};

export type ProjectOverviewData = {
  caseStudies: Array<{ name: string; url: string }>;
  sideProjects: Array<{ name: string; url?: string; comingSoon?: boolean }>;
};

export type SiteContent = {
  hero: {
    name: string;
    title: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    dribbble: string;
  };
  about: {
    heading: string;
    description: string;
    services: string[];
  };
  featuredWork: FeaturedWorkItem[];
  experienceData: ExperienceItem[];
  educationData: EducationItem[];
  projectOverview: ProjectOverviewData;
};

const defaultContent: SiteContent = {
  hero: {
    name: "Michał Noweetzki",
    title: "Frontend Developer & UI Designer",
    location: "Warsaw, Poland",
    email: "hello@mnoweetzki.dev",
    github: "https://github.com/mnoweetzki",
    linkedin: "https://www.linkedin.com",
    dribbble: "https://dribbble.com",
  },
  about: {
    heading:
      "Hey there. I'm Michał — a frontend developer and UI designer based in Warsaw, creating modern web experiences that blend clean design with thoughtful engineering.",
    description:
      "I enjoy turning ideas into fast, elegant, and user-friendly products for startups, agencies, and ambitious brands.",
    services: [
      "React",
      "Next.js",
      "UI Design",
      "Design Systems",
      "Accessibility",
      "Responsive Web Apps",
      "Web Performance",
      "Creative Coding",
      "Figma",
      "Tailwind CSS",
      "Product Thinking",
    ],
  },
  featuredWork: [
    {
      title: "Modern Portfolio for a Creative Agency",
      description:
        "Crafted a polished, high-performance website experience that highlighted services, case studies, and a strong visual identity.",
      roles: ["Frontend Developer", "UI Designer"],
      image: "/images/feature-work/feature-img-1.png",
    },
    {
      title: "Dashboard Redesign for a SaaS Product",
      description:
        "Delivered a cleaner information architecture and design system update that improved clarity, usability, and onboarding flow.",
      roles: ["Product Designer", "Developer"],
      image: "/images/feature-work/feature-img-2.png",
    },
  ],
  experienceData: [
    {
      icon: "/images/icon/tailwind-icon.svg",
      role: "Frontend Developer & UI Engineer",
      location: "Remote",
      startYear: "2023",
      endYear: "Present",
      bulletPoints: [
        "Built polished, production-ready web apps with Next.js, React, and Tailwind CSS",
        "Collaborated closely with product and design teams to ship fast, accessible interfaces",
        "Improved front-end performance and component consistency across several projects",
      ],
    },
    {
      icon: "/images/icon/asana-icon.svg",
      role: "Product Designer & Developer",
      location: "Warsaw, Poland",
      startYear: "2020",
      endYear: "2023",
      bulletPoints: [
        "Designed and developed landing pages, dashboards, and brand experiences for digital products",
        "Turned client ideas into modern interfaces with a strong focus on usability",
        "Created reusable UI patterns that sped up delivery across multiple launches",
      ],
    },
  ],
  educationData: [
    {
      date: "2018 - 2022",
      title: "B.Sc. in Computer Science",
      subtitle: "University of Warsaw — Warsaw, Poland",
    },
    {
      date: "2021",
      title: "UI/UX Design Certificate",
      subtitle: "Google UX Design — Coursera",
    },
    {
      date: "2020",
      title: "Frontend Development Bootcamp",
      subtitle: "General Assembly — Remote",
    },
  ],
  projectOverview: {
    caseStudies: [
      { name: "Astra Studio", url: "#" },
      { name: "Northstar Finance", url: "#" },
    ],
    sideProjects: [
      { name: "Design System Toolkit", url: "#" },
      { name: "Motion UI Playground", comingSoon: true },
      { name: "Portfolio CMS", comingSoon: true },
      { name: "AI Landing Page Generator", comingSoon: true },
    ],
  },
};

const contentBlobName = "site-content.json";
const contentPath = path.join(process.cwd(), "src", "data", "site-content.json");

async function readLocalContent(): Promise<SiteContent | null> {
  try {
    const raw = await fs.readFile(contentPath, "utf8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

async function writeLocalContent(content: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf8");
}

export async function getSiteContent(): Promise<SiteContent> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: contentBlobName, limit: 10 });
      const savedBlob = blobs.find((blob) => blob.pathname === contentBlobName || blob.pathname.endsWith(contentBlobName));
      if (savedBlob?.url) {
        const response = await fetch(savedBlob.url);
        if (response.ok) {
          return (await response.json()) as SiteContent;
        }
      }
    } catch {
      // fall back to local file
    }
  }

  const localContent = await readLocalContent();
  if (localContent) {
    return localContent;
  }

  await writeLocalContent(defaultContent);
  return defaultContent;
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put(contentBlobName, JSON.stringify(content, null, 2), {
        access: "public",
        contentType: "application/json",
      });
      await writeLocalContent(content);
      return content;
    } catch {
      // fall back to local file
    }
  }

  await writeLocalContent(content);
  return content;
}
