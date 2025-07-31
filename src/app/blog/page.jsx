/* eslint-disable no-undef */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

const POSTS_PER_PAGE = 6;

export const metadata = {
  title: "Blog",
  description:
    "Blog with random thoughts and ideas but mostly about technology",
  openGraph: {
    title: "Yuma Nur Alfath Blog Site",
    description:
      "Blog with random thoughts and ideas but mostly about technology",
    url: "https://yumana.my.id/blog",
    siteName: "Yuma Nur Alfath Website Blog",
    images: [
      {
        url: "https://yumana.my.id/hero_metadata.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "website",
  },
};

export default async function BlogPage(props) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page) || 1;

  const blogDir = path.join(process.cwd(), "src/content/blog");
  const files = fs.readdirSync(blogDir);

  const posts = files.map((filename) => {
    const fileContent = fs.readFileSync(path.join(blogDir, filename), "utf-8");
    const { data: frontMatter } = matter(fileContent);

    return {
      slug: filename.replace(".md", ""),
      title: frontMatter.title,
      date: frontMatter.date,
      excerpt: frontMatter.excerpt,
      category: frontMatter.category,
      image: frontMatter.image || "https://picsum.photos/400/300?grayscale",
    };
  });

  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen px-4 pt-20 pb-10 dark:bg-gradient-to-br dark:from-black dark:via-zinc-900 dark:to-black dark:text-cyan-300 font-mono">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-4 dark:bg-gradient-to-r  text-gray-950 dark:from-pink-500 dark:via-purple-500 dark:to-blue-500 dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          Explore My Notes
        </h1>
        <p className="text-center mb-10 text-lg font-medium text-gray-700 dark:text-cyan-400 drop-shadow">
          Random thoughts and ideas about programming and life
        </p>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
              <div className="bg-zinc-900 border dark:border-cyan-500/20 rounded-xl dark:shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-cyan-400/40 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={293}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="dark:bg-pink-600 text-white px-2 py-1 rounded-full shadow-md dark:shadow-pink shadow-white ">
                      {post.category}
                    </span>
                    <span className="text-gray-400">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-100 dark:text-cyan-200 mb-2 transition-colors duration-300 dark:group-hover:text-pink-400 group-hover:text-gray-400">
                    {post.title}
                  </h2>

                  <p className="dark:text-cyan-400 leading-relaxed line-clamp-3 text-gray-100">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center items-center gap-6">
          {currentPage > 1 && (
            <a
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 rounded bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md shadow-pink-500/40 hover:brightness-125 transition"
            >
              ⬅ Previous
            </a>
          )}

          <span className="text-cyan-300 text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <a
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/40 hover:brightness-125 transition"
            >
              Next ➡
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
