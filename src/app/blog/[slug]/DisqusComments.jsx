"use client";

import { useEffect } from "react";

export default function DisqusComments({ slug }) {
  useEffect(() => {
    const disqusScript = document.createElement("script");
    disqusScript.src = "https://yumana.disqus.com/embed.js";
    disqusScript.setAttribute("data-timestamp", +new Date());
    document.body.appendChild(disqusScript);

    return () => {
      document.body.removeChild(disqusScript);
    };
  }, [slug]);

  return (
    <div
      id="disqus_thread"
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16"
    ></div>
  );
}
