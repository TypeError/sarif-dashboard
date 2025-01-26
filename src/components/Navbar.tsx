"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <header className="w-full border-b border-border bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo / Title */}
        <div className="flex items-center space-x-4">
          <h1
            className="text-3xl font-extrabold bg-clip-text text-transparent
                       animate-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
          >
            SARIF Dashboard
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link
            href="https://github.com/TypeError/sarif-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm 
                       font-medium text-muted-foreground transition-colors hover:bg-muted/20"
          >
            <Github size={18} />
            <span>GitHub</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
