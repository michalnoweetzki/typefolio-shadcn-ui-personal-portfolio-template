import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectSlug, getSiteContent } from "@/lib/site-content";

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.featuredWork.map((project) => ({ slug: getProjectSlug(project) }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getSiteContent();
  const project = content.featuredWork.find((item) => getProjectSlug(item) === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 hover:text-sky-700">
          ← Back to portfolio
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div className="flex flex-col gap-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Selected project</p>
              <h1 className="text-3xl font-semibold sm:text-4xl">{project.title}</h1>
              <p className="max-w-2xl text-lg text-slate-600">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.roles.map((role) => (
                  <span key={role} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
              <Image
                src={project.image}
                alt={project.title}
                width={900}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">Project details</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {project.details || "This project is ready to be expanded with richer case study content from the CMS."}
          </p>
        </section>
      </div>
    </main>
  );
}
