import React, { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import * as monaco from "monaco-editor";
import { saveCodeToFirestore, loadCodeFromFirestore } from "../firebaseConfig";
import "./CodeEditor.css"; 

function CodeEditor() {
  const { roomId } = useParams();
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const ydocRef = useRef(null);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(roomId, ydoc, {
      signaling: ["wss://y-webrtc.fly.dev"],
    });
    const yText = ydoc.getText("monaco");

    providerRef.current = provider;
    ydocRef.current = ydoc;

    setTimeout(() => {
      if (provider.awareness.states.size === 1) {
        setIsFirstUser(true);
        loadCodeFromFirestore(roomId).then((savedCode) => {
          if (savedCode && savedCode.trim() !== "" && yText.toString().trim() === "") {
            yText.insert(0, savedCode);
          }
        });
      }
    }, 2000);

    provider.awareness.setLocalStateField("user", {
      name: "User " + Math.floor(Math.random() * 100),
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    const yText = ydocRef.current.getText("monaco");
    new MonacoBinding(yText, editor.getModel(), new Set([editor]));

    // Enable language services for better error detection
    monaco.editor.setModelLanguage(editor.getModel(), language);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFirstUser) {
        saveCodeToFirestore(roomId, editorRef.current.getValue());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [roomId, isFirstUser]);

  // Get all supported languages dynamically
  const supportedLanguages = monaco.languages.getLanguages().map((lang) => ({
    id: lang.id,
    name: lang.aliases?.[0] || lang.id,
  }));

  return (
    <div className="editor-container">
      {/* Language Selector */}
      <select className="language-selector" value={language} onChange={(e) => setLanguage(e.target.value)}>
        {supportedLanguages.map((lang) => (
          <option key={lang.id} value={lang.id}>{lang.name}</option>
        ))}
      </select>

      {/* Monaco Editor */}
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        defaultValue="// Start coding..."
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default CodeEditor;
