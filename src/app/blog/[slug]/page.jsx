import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export const metadata = {
  title: "Blog Post",
};

const BlogPost = async props => {
  const params = await props.params;
  const { slug } = params;
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontMatter, content } = matter(fileContent);
  const htmlContent = marked(content);

  return (
    <div className="min-h-screen p-4 pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-y-auto">
      <article className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-16">
        <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
          <h1 className="text-4xl font-bold mb-4">{frontMatter.title}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
              {frontMatter.category}
            </span>
            <span className="text-gray-500">
              {new Date(frontMatter.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div
          className="prose prose-lg max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
};

export default BlogPost;
