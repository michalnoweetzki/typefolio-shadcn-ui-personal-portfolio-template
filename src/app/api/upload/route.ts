import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  if (supabase) {
    const { data, error } = await supabase.storage.from("portfolio-images").upload(filename, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

    if (!error && data?.path) {
      const { data: publicData } = supabase.storage.from("portfolio-images").getPublicUrl(data.path);
      return NextResponse.json({ url: publicData.publicUrl });
    }
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(uploadPath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
