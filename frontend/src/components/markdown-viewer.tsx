"use client";
import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

export default function MarkdownViewer({ source }: { source: string }) {
  return (
    <div data-color-mode="light" className="bg-transparent font-sans">
      <MarkdownPreview 
        source={source} 
        style={{ backgroundColor: 'transparent', color: 'inherit', fontFamily: 'inherit' }} 
        wrapperElement={{
          "data-color-mode": "light"
        }}
      />
    </div>
  );
}
