import { promises as fs } from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";
import {
  defaultContent,
  type FeaturedWorkItem,
  type SiteContent,
} from "@/lib/site-content-model";

export type { FeaturedWorkItem, ExperienceItem, EducationItem, ProjectOverviewData, SiteContent } from "@/lib/site-content-model";
export { getProjectSlug, slugify } from "@/lib/site-content-model";

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
  if (supabase) {
    try {
      const { data, error } = await supabase.from("site_content").select("content").eq("id", "main").single();
      if (!error && data?.content) {
        return data.content as SiteContent;
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
  if (supabase) {
    try {
      const { error } = await supabase.from("site_content").upsert({ id: "main", content });
      if (!error) {
        await writeLocalContent(content);
        return content;
      }
    } catch {
      // fall back to local file
    }
  }

  await writeLocalContent(content);
  return content;
}
