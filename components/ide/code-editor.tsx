'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useIDEStore } from '@/lib/store/ide-store';
import { Loader2 } from 'lucide-react';

export function CodeEditor() {
  const { sketches, activeSketchId, updateSketchCode } = useIDEStore();
  const activeSketch = sketches.find((s) => s.id === activeSketchId);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeSketchId) {
      updateSketchCode(activeSketchId, value);
    }
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        theme="vs-dark"
        value={activeSketch?.code || ''}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          glyphMargin: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        }
      />
    </div>
  );
}
