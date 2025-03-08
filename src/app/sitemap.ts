import * as fs from "fs";
import * as path from "path";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Path ke folder blog posts
  const blogDir = path.join(process.cwd(), "src/content/blog");

  // Baca semua file di direktori blog
  const files = fs.readdirSync(blogDir);

  // Generate URL untuk setiap post berdasarkan nama file
  const blogUrls = files.map((filename) => ({
    url: `${baseUrl}/blog/${filename.replace(".md", "")}`,
    lastModified: new Date().toISOString(), // Tambahkan lastModified untuk SEO
  }));

  // URL statis seperti halaman project
  const staticUrls = [
    { url: `${baseUrl}/blog`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/project`, lastModified: new Date().toISOString() },
  ];

  // Gabungkan URL statis dan dinamis
  return [...staticUrls, ...blogUrls];
}
