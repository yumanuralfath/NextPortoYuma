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
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // URL statis seperti halaman project
  const staticUrls = [
    { 
      url: `${baseUrl}/`, 
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    { 
      url: `${baseUrl}/log-book`, 
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/blog`, 
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    { 
      url: `${baseUrl}/project`, 
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];
  
  // Gabungkan URL statis dan dinamis
  return [...staticUrls, ...blogUrls];
}