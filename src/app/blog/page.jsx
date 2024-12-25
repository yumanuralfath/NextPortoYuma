import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

const BlogPage = () => {
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

  // Urutkan post berdasarkan tanggal terbaru
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen p-8 pt-24 bg-gradient-to-br from-indigo-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Explore Our Blog
        </h1>
        <p className="text-gray-700 text-center mb-16 text-lg font-medium">
          Insights, tutorials, and inspiration for web enthusiasts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sortedPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-3 transition-colors duration-300 group-hover:text-purple-600">
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
      </div>
    </div>
  );
};

export default BlogPage;
