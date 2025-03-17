import React, { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { saveCodeToFirestore, loadCodeFromFirestore } from "../firebaseConfig";

function CodeEditor() {
  const { roomId } = useParams();
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const ydocRef = useRef(null);
  const [isFirstUser, setIsFirstUser] = useState(false); // Track if this is the first user in the room

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(roomId, ydoc, {
      signaling: ["wss://y-webrtc.fly.dev"],
    });
    const yText = ydoc.getText("monaco");

    providerRef.current = provider;
    ydocRef.current = ydoc;

    // Check if this is the first user in the room
    setTimeout(() => {
      if (provider.awareness.states.size === 1) {
        setIsFirstUser(true);
        loadCodeFromFirestore(roomId).then((savedCode) => {
          if (savedCode && savedCode.trim() !== "" && yText.toString().trim() === "") {
            yText.insert(0, savedCode); // Load only if no content exists in Yjs
          }
        });
      }
    }, 2000); // Small delay to allow WebRTC connections to establish

    provider.awareness.setLocalStateField("user", {
      name: "User " + Math.floor(Math.random() * 100),
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    const yText = ydocRef.current.getText("monaco");
    new MonacoBinding(yText, editor.getModel(), new Set([editor]));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFirstUser) {
        saveCodeToFirestore(roomId, editorRef.current.getValue());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [roomId, isFirstUser]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        onMount={handleEditorDidMount}
      />
    </div>
  );
}

export default CodeEditor;
