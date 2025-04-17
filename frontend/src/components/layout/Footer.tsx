import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear} Bason Park. All rights reserved.
          {/* Optional: Add links to terms, privacy, docs etc. */}
          {/* <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 ml-2"
          >
            Docs
          </a> */}
        </p>
      </div>
    </footer>
  );
}
