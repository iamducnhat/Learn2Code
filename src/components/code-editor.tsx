"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language: "c" | "python" | "cpp" | "java";
  highlightLines?: { start: number; end: number };
  readOnly?: boolean;
  height?: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  c: "c",
  python: "python",
  cpp: "cpp",
  java: "java",
};

export function CodeEditor({
  code,
  language,
  highlightLines,
  readOnly = true,
  height = "300px",
}: CodeEditorProps) {
  const editorRef = React.useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Apply line highlighting if specified
    if (highlightLines) {
      const decorations = editor.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(
              highlightLines.start,
              1,
              highlightLines.end,
              1
            ),
            options: {
              isWholeLine: true,
              className: "highlighted-line",
              linesDecorationsClassName: "highlighted-line-gutter",
            },
          },
        ]
      );

      // Scroll to highlighted line
      editor.revealLineInCenter(highlightLines.start);
    }

    // Configure editor appearance
    monaco.editor.defineTheme("learn2code", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "569CD6" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editor.lineHighlightBackground": "#2D2D30",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#C6C6C6",
      },
    });
    monaco.editor.setTheme("learn2code");
  };

  // Update decorations when highlight changes
  React.useEffect(() => {
    if (editorRef.current && highlightLines) {
      const monaco = (window as any).monaco;
      if (monaco) {
        const editor = editorRef.current;
        editor.deltaDecorations(
          editor.getModel()?.getAllDecorations() || [],
          [
            {
              range: new monaco.Range(
                highlightLines.start,
                1,
                highlightLines.end,
                1
              ),
              options: {
                isWholeLine: true,
                className: "highlighted-line",
                linesDecorationsClassName: "highlighted-line-gutter",
              },
            },
          ]
        );
        editor.revealLineInCenter(highlightLines.start);
      }
    }
  }, [highlightLines]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      <Editor
        height={height}
        language={LANGUAGE_MAP[language]}
        value={code}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: highlightLines ? "none" : "line",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
          folding: false,
          glyphMargin: false,
        }}
        theme="vs-dark"
      />
      <style jsx global>{`
        .highlighted-line {
          background-color: rgba(0, 255, 135, 0.15) !important;
          border-left: 3px solid #00ff87 !important;
        }
        .highlighted-line-gutter {
          background-color: #00ff87;
          width: 3px !important;
          margin-left: 3px;
        }
      `}</style>
    </div>
  );
}
