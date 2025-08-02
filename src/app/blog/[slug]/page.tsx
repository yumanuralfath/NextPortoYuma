import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DisqusComments from "./DisqusComments";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return {
        title: "Not Found",
        description: "The page you are looking for does not exist.",
      };
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontMatter } = matter(fileContent);
    return {
      title: frontMatter.title,
      description: frontMatter.excerpt,
      openGraph: {
        title: frontMatter.title,
        description: frontMatter.excerpt,
        url: `https://yumana.my.id/blog/${slug}`,
        siteName: "Yuma Nur Alfath's Blog",
        images: [
          {
            url: frontMatter.image || "/default-blog-image.jpg",
            width: 1200,
            height: 630,
          },
        ],
        locale: "en_US",
        alternateLocale: ["id_ID"],
        type: "article",
        publishedTime: new Date(frontMatter.date).toISOString(),
        authors: ["Yuma Nur Alfath"],
      },
      twitter: {
        card: "summary_large_image",
        title: frontMatter.title,
        description: frontMatter.excerpt,
        images: [frontMatter.image || "/default-blog-image.jpg"],
      },
    };
  } catch (error) {
    return {
      title: `Not Found: ${error}`,
      description: "The page you are looking for does not exist.",
    };
  }
}

const BlogHeader = ({
  title,
  date,
  category,
}: {
  title: string;
  date: string;
  category: string;
}) => (
  <div className="text-center mb-8 pb-8 border-b border-cyan-900/50">
    <div className="mb-4">
      <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold">
        {category}
      </span>
    </div>
    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-4">
      {title}
    </h1>
    <p className="text-slate-400 text-sm">
      Published on{" "}
      {new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>
);

const BlogBody = ({ content }: { content: string }) => (
  <div
    className="prose prose-lg prose-invert max-w-none text-slate-300 
               prose-headings:text-cyan-400 prose-a:text-pink-500 hover:prose-a:text-pink-400 
               prose-strong:text-slate-100 prose-blockquote:border-l-cyan-500 
               prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded-md"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontMatter, content } = matter(fileContent);
  const htmlContent = await marked(content);

  return (
    <div className="min-h-screen bg-slate-900/50 text-white font-mono p-4 sm:p-6 pt-24">
      <main className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </Link>
        <article className="bg-slate-900 border border-cyan-900/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 md:p-10">
          <BlogHeader
            title={frontMatter.title}
            date={frontMatter.date}
            category={frontMatter.category}
          />
          <BlogBody content={htmlContent} />
        </article>
        <div className="mt-16">
          <DisqusComments slug={slug} />
        </div>
      </main>
    </div>
  );
}
