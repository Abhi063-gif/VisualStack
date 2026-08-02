import React from 'react';
import { CodeEditor } from './CodeEditor';
import { DiffEditor } from '@monaco-editor/react';

export const CodeTabs: React.FC = () => (
  <div className="h-full w-full">
    <CodeEditor />
  </div>
);

export const CodeViewer: React.FC<{ code: string; language?: string }> = ({ code, language }) => (
  <CodeEditor code={code} language={language} />
);

export const DiffViewer: React.FC<{ original: string; modified: string }> = ({ original, modified }) => (
  <DiffEditor
    height="100%"
    language="typescript"
    theme="vs-dark"
    original={original}
    modified={modified}
    options={{
      readOnly: true,
      fontSize: 12,
      minimap: { enabled: false },
      automaticLayout: true,
    }}
  />
);
