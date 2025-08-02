/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";

// Extend the Window interface to include DISQUS
declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        [x: string]: any;
        reload: boolean;
        config: () => void;
      }) => void;
    };
  }
}

interface DisqusCommentsProps {
  slug: string;
}

export default function DisqusComments({ slug }: DisqusCommentsProps) {
  useEffect(() => {
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = window.location.href;
          this.page.identifier = slug;
        },
      });
    } else {
      const disqusScript = document.createElement("script");
      disqusScript.src = "https://yumana.disqus.com/embed.js";
      disqusScript.setAttribute("data-timestamp", String(+new Date()));
      document.body.appendChild(disqusScript);
    }

    return () => {
      const disqusThread = document.getElementById("disqus_thread");
      if (disqusThread) {
        while (disqusThread.firstChild) {
          disqusThread.removeChild(disqusThread.firstChild);
        }
      }
    };
  }, [slug]);

  return (
    <div className="bg-slate-900 border border-cyan-900/50 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 md:p-10">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 pb-4 border-b border-cyan-900/50">
        Join the Discussion
      </h2>
      <div id="disqus_thread"></div>
    </div>
  );
}
