"use client";

import { useEffect } from "react";

interface DisqusCommentsProps {
  slug: string;
}

export default function DisqusComments({ slug }: DisqusCommentsProps) {
  useEffect(() => {
    const disqusScript = document.createElement("script");
    disqusScript.src = "https://yumana.disqus.com/embed.js";
    disqusScript.setAttribute("data-timestamp", String(+new Date()));
    document.body.appendChild(disqusScript);

    return () => {
      document.body.removeChild(disqusScript);
    };
  }, [slug]);

  return (
    <div
      id="disqus_thread"
      className="max-w-6xl mx-auto dark:bg-black dark:text-cyan-200 font-mono dark:rounded-xl dark:shadow-lg p-8 mb-16"
    ></div>
  );
}
