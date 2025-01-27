import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-6 py-4 text-center text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
      <div className="container mx-auto px-4">
        {/* First line: "Made with ❤️ by Caleb Kinney" */}
        <p className="text-gray-400 text-xs font-medium">
          Made with{" "}
          <Heart
            className="inline-block h-4 w-4 text-red-500 animate-pulse"
            aria-label="heart icon"
          />{" "}
          by{" "}
          <a
            href="https://github.com/cak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Caleb Kinney
          </a>
        </p>

        {/* Technologies Section */}
        <p className="mt-2 text-gray-400 text-xs font-medium">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Tailwind CSS
          </a>
          , and{" "}
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            shadcn/ui
          </a>
          . Deployed on{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Vercel
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
