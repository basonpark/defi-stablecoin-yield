"use client";

import React from 'react';
// Using a lightweight syntax highlighter. You could swap this for 'react-syntax-highlighter' for more features.
// Install: npm install react-simple-code-editor prismjs
// Add prismjs theme CSS to your global CSS or layout: import 'prismjs/themes/prism-okaidia.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-solidity'; // Add solidity support
import 'prismjs/themes/prism-okaidia.css'; // Choose a theme

interface CodeBlockProps {
  code: string;
  language: 'solidity' | 'javascript' | 'typescript' | 'json'; // Add more as needed
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const langDefinition = languages[language] || languages.javascript; // Default to JS if language not found

  return (
    <div className="my-4 rounded-md border bg-muted p-4 text-sm relative font-mono overflow-hidden shadow-inner">
      <Editor
        value={code.trim()} // Trim whitespace
        onValueChange={() => {}} // Read-only
        highlight={(code) => highlight(code, langDefinition, language)}
        padding={10}
        readOnly
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 13,
          outline: 'none',
          backgroundColor: 'transparent',
          caretColor: 'transparent', // Hide caret for read-only
        }}
        textareaClassName="focus:outline-none"
      />
      <span className="absolute top-2 right-3 text-xs text-muted-foreground uppercase select-none">
        {language}
      </span>
    </div>
  );
};
