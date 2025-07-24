/* eslint-disable no-undef */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import DisqusComments from "./DisqusComments";

export async function generateMetadata({ params }) {
  const { slug } = await params; 
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontMatter } = matter(fileContent);
  
  return {
    title: frontMatter.title,
    description: frontMatter.excerpt,
    openGraph: {
      title: frontMatter.title,
      description: frontMatter.excerpt,
      url: `https://yumana.my.id/blog/${slug}`,
      siteName: "Yuma Nur Alfath blog Website",
      images: [
        {
          url: frontMatter.image,
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      alternateLocale: ["id_ID"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: frontMatter.title,
      description: frontMatter.excerpt,
      images: [frontMatter.image],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params; 
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontMatter, content } = matter(fileContent);
  const htmlContent = marked(content);

  return (
    <div className="min-h-screen p-6 pt-24 bg-black text-cyan-200 font-mono">
      <article className="max-w-5xl mx-auto bg-[#111827] border border-cyan-500 rounded-2xl shadow-xl p-8 mt-8 mb-16 transition-all duration-300 hover:shadow-cyan-500/30">
        <div className="top-0 bg-[#111827] z-10 pb-4 border-b border-cyan-700">
          <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg mb-3">
            {frontMatter.title}
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 font-semibold bg-pink-600 text-white rounded-full shadow-md">
              {frontMatter.category}
            </span>
            <span className="text-cyan-400 opacity-80">
              {new Date(frontMatter.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div
          className="prose prose-invert prose-lg max-w-none mt-8 text-cyan-100"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
      <DisqusComments slug={slug} />
    </div>
  );
}