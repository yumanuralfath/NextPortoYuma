import * as fs from "fs";
import * as path from "path";
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

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image: string;
}

interface SearchParams {
  page?: string;
}

interface BlogPageProps {
  searchParams: SearchParams;
}

export default async function BlogPage(props: BlogPageProps) {
  const searchParams = props.searchParams;
  const currentPage = parseInt(searchParams.page || "1");

  const blogDir = path.join(process.cwd(), "src/content/blog");
  const files = fs.readdirSync(blogDir);

  const posts: Post[] = files.map((filename) => {
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

  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (isNaN(dateA) || isNaN(dateB)) {
      console.error("Invalid date string encountered:", a.date, b.date);
      return 0;
    }

    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-indigo-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Explore My Notes
        </h1>
        <p className="text-gray-700 text-center mb-8 text-lg font-medium">
          Random thoughts and ideas about programming and life
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={293}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-300" />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-purple-600">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          {currentPage > 1 && (
            <a
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Previous
            </a>
          )}

          <span className="text-lg font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <a
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
