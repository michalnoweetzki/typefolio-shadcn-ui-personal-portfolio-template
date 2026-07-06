"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { SiteContent } from "@/lib/site-content";

const emptyContent: SiteContent = {
  hero: {
    name: "",
    title: "",
    location: "",
    email: "",
    github: "",
    linkedin: "",
    dribbble: "",
  },
  about: {
    heading: "",
    description: "",
    services: [],
  },
  featuredWork: [],
  experienceData: [],
  educationData: [],
  projectOverview: {
    caseStudies: [],
    sideProjects: [],
  },
};

const adminCredentials = {
  username: "admin",
  password: "portfolio2026",
};

export default function CmsPage() {
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [status, setStatus] = useState("Loading...");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content");
        const data = await res.json();
        setContent(data);
        setStatus("Ready to edit");
      } catch {
        setStatus("Failed to load content");
      }
    };
    load();
  }, []);

  const save = async () => {
    setStatus("Saving...");
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      setStatus("Saved successfully");
    } else {
      setStatus("Saving failed");
    }
  };

  const login = (event: FormEvent) => {
    event.preventDefault();
    if (authForm.username === adminCredentials.username && authForm.password === adminCredentials.password) {
      setIsAuthenticated(true);
      setStatus("Welcome back, admin");
    } else {
      setStatus("Invalid username or password");
    }
  };

  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateAbout = (field: keyof SiteContent["about"], value: string | string[]) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value as never },
    }));
  };

  const addProject = () => {
    setContent((prev) => ({
      ...prev,
      featuredWork: [
        ...prev.featuredWork,
        {
          title: "New project",
          description: "Add description",
          roles: ["Role"],
          image: "/images/feature-work/feature-img-1.png",
        },
      ],
    }));
  };

  const updateProject = (index: number, field: keyof SiteContent["featuredWork"][number], value: string | string[]) => {
    setContent((prev) => ({
      ...prev,
      featuredWork: prev.featuredWork.map((item, i) => (i === index ? { ...item, [field]: value as never } : item)),
    }));
  };

  const deleteProject = (index: number) => {
    setContent((prev) => ({
      ...prev,
      featuredWork: prev.featuredWork.filter((_, i) => i !== index),
    }));
  };

  const uploadProjectImage = async (index: number, file: File | null) => {
    if (!file) return;
    setStatus("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      updateProject(index, "image", data.url);
      setStatus("Image uploaded");
    } else {
      setStatus("Image upload failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:w-80 lg:self-start">
          <div className="mb-6 border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Portfolio CMS</p>
            <h1 className="mt-2 text-2xl font-semibold">WordPress-style editor</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your hero, about section, and projects from one place.</p>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold">Status</p>
              <p className="mt-1 text-slate-600">{status}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold">Access</p>
              <p className="mt-1 text-slate-600">{isAuthenticated ? "Signed in as admin" : "Sign in to edit content"}</p>
            </div>
          </div>
        </aside>

        <section className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {!isAuthenticated ? (
            <form onSubmit={login} className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Secure login</p>
              <h2 className="mt-2 text-2xl font-semibold">Sign in to continue</h2>
              <p className="mt-2 text-sm text-slate-600">Use the default admin credentials to open the CMS.</p>
              <div className="mt-6 space-y-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Username
                  <input
                    value={authForm.username}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))}
                    className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5 outline-none ring-0"
                    placeholder="admin"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5 outline-none ring-0"
                    placeholder="portfolio2026"
                  />
                </label>
                <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Log in
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
                  <h2 className="text-2xl font-semibold">Edit your portfolio content</h2>
                </div>
                <button onClick={save} className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
                  Save changes
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold">Hero section</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Name
                    <input value={content.hero.name} onChange={(e) => updateHero("name", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Title
                    <input value={content.hero.title} onChange={(e) => updateHero("title", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Location
                    <input value={content.hero.location} onChange={(e) => updateHero("location", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Email
                    <input value={content.hero.email} onChange={(e) => updateHero("email", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    GitHub
                    <input value={content.hero.github} onChange={(e) => updateHero("github", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    LinkedIn
                    <input value={content.hero.linkedin} onChange={(e) => updateHero("linkedin", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Dribbble
                    <input value={content.hero.dribbble} onChange={(e) => updateHero("dribbble", e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold">About section</h3>
                <div className="mt-4 grid gap-4">
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Heading
                    <textarea value={content.about.heading} onChange={(e) => updateAbout("heading", e.target.value)} className="min-h-24 rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Description
                    <textarea value={content.about.description} onChange={(e) => updateAbout("description", e.target.value)} className="min-h-24 rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    Services (comma separated)
                    <input value={content.about.services.join(", ")} onChange={(e) => updateAbout("services", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5" />
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <button onClick={addProject} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                    Add project
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {content.featuredWork.map((project, index) => (
                    <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-semibold text-slate-800">Project #{index + 1}</p>
                        <button onClick={() => deleteProject(index)} className="text-sm font-semibold text-rose-600 transition hover:text-rose-700">
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                          Title
                          <input value={project.title} onChange={(e) => updateProject(index, "title", e.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                          Roles
                          <input value={project.roles.join(", ")} onChange={(e) => updateProject(index, "roles", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                          Description
                          <textarea value={project.description} onChange={(e) => updateProject(index, "description", e.target.value)} className="min-h-24 rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                          Image
                          <input type="file" accept="image/*" onChange={(e) => uploadProjectImage(index, e.target.files?.[0] || null)} className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                          Image path
                          <input value={project.image} onChange={(e) => updateProject(index, "image", e.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5" />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
