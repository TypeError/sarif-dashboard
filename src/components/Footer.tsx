import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-500">
      <p>
        Made with <Heart className="inline-block w-4 h-4 text-red-500 mx-1" />{" "}
        by
        <a
          href="https://github.com/cak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Caleb Kinney
        </a>
        .
      </p>
      <p>
        Powered by
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Vercel
        </a>
        .
      </p>
    </footer>
  );
}
