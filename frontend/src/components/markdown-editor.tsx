"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      const res = await fetch("http://localhost:3005/api/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const imageMarkdown = `\n![image](${data.url})\n`;
        onChange(value + imageMarkdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 relative" data-color-mode="light">
      <div className="flex justify-end absolute -top-12 right-0">
        <label className="cursor-pointer bg-secondary px-3 py-1 text-xs font-black border-2 border-black uppercase hover:shadow-brutal transition-shadow text-secondary-foreground inline-flex items-center gap-2">
          {uploading ? "Uploading..." : "Upload Image to Editor"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      <div className="border-4 border-black shadow-brutal">
         <MDEditor
           value={value}
           onChange={(val) => onChange(val || "")}
           height={400}
         />
      </div>
    </div>
  );
}
