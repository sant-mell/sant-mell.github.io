"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  extension?: string;
}

interface FileTreeProps {
  data: FileNode[];
  title?: string;
  className?: string;
}

interface FileItemProps {
  node: FileNode;
  depth: number;
}

// Grayscale glyph per extension to stay consistent with the monochrome theme.
function getFileGlyph(extension?: string): string {
  const map: Record<string, string> = {
    tsx: "⚛",
    ts: "◆",
    jsx: "⚛",
    js: "◆",
    py: "◐",
    cpp: "◈",
    c: "◈",
    sql: "▤",
    css: "◈",
    json: "{}",
    md: "◊",
    svg: "◐",
    ino: "▣",
  };
  return map[extension ?? "default"] ?? "◇";
}

function FileItem({ node, depth }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const glyph = getFileGlyph(node.extension);

  return (
    <div className="select-none">
      <button
        type="button"
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={cn(
          "group relative flex w-full items-center gap-2 rounded-md px-2 py-1 text-left",
          "transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400/60",
          !isFolder && "cursor-default",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        aria-expanded={isFolder ? isOpen : undefined}
      >
        {/* caret / spacer */}
        <span className="flex h-4 w-4 items-center justify-center">
          {isFolder ? (
            <svg
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
              className={cn("text-zinc-500 transition-transform duration-200", isOpen && "rotate-90")}
              aria-hidden="true"
            >
              <path d="M1 1L5 4L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="text-xs text-zinc-500" aria-hidden="true">{glyph}</span>
          )}
        </span>

        {/* folder / file icon */}
        <span className={cn("flex h-5 w-5 items-center justify-center", isFolder ? "text-zinc-300" : "text-zinc-400")}>
          {isFolder ? (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor" aria-hidden="true">
              <path d="M1.5 1C0.671573 1 0 1.67157 0 2.5V11.5C0 12.3284 0.671573 13 1.5 13H14.5C15.3284 13 16 12.3284 16 11.5V4.5C16 3.67157 15.3284 3 14.5 3H8L6.5 1H1.5Z" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true">
              <path d="M1.5 0C0.671573 0 0 0.671573 0 1.5V14.5C0 15.3284 0.671573 16 1.5 16H12.5C13.3284 16 14 15.3284 14 14.5V4.5L9.5 0H1.5Z" />
            </svg>
          )}
        </span>

        <span
          className={cn(
            "font-mono text-sm transition-colors duration-200",
            isFolder ? "text-zinc-200" : "text-zinc-400 group-hover:text-zinc-200",
          )}
        >
          {node.name}
        </span>
      </button>

      {hasChildren && isOpen && (
        <div className="border-l border-white/10" style={{ marginLeft: `${depth * 16 + 15}px` }}>
          <div style={{ marginLeft: -1 }}>
            {node.children!.map((child) => (
              <FileItem key={child.name} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FileTree({ data, title = "santiago@portfolio: ~/projects", className }: FileTreeProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-zinc-950 font-mono shadow-2xl",
        className,
      )}
    >
      {/* Ubuntu / Yaru style title bar: title on the left, window controls on the right */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* minimize, maximize, close (Yaru places controls on the right) */}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[8px] text-zinc-300" aria-hidden="true">–</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-[7px] text-zinc-300" aria-hidden="true">▢</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-600 text-[8px] text-zinc-100" aria-hidden="true">✕</span>
        </div>
      </div>

      {/* Tree body */}
      <div className="space-y-0.5 p-3">
        {data.map((node) => (
          <FileItem key={node.name} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
