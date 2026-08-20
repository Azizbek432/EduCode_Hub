import React, { useState } from "react";
import "./Compiler.css";

function Compiler() {
  const [code, setCode] = useState(
    `// JavaScript kodingizni yozing...\nconsole.log("Salom, EduCode Hub!");\n\nlet a = 10;\nlet b = 20;\nconsole.log("Natija:", a + b);`
  );
  const [output, setOutput] = useState("");

  const runCode = () => {
    let logs = [];
    const customConsole = {
      log: (...args) =>
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
            )
            .join(" ")
        ),
      error: (err) => logs.push("❌ Xatolik: " + err),
    };

    try {
      const script = new Function("console", code);
      script(customConsole);
      setOutput(logs.join("\n") || "⚡️ Kod muvaffaqiyatli bajarildi (natija yo'q).");
    } catch (err) {
      setOutput("❌ Xatolik: " + err.message);
    }
  };

  const clearOutput = () => setOutput("");

  return (
    <div className="compiler-page">
      <div className="compiler-header">
        <div className="compiler-title">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="filename">⚡️ main.js — EduCode Playground</span>
        </div>
        <div className="compiler-actions">
          <button className="clear-btn" onClick={clearOutput}>Tozalash</button>
          <button className="compile-run-btn" onClick={runCode}>
            Kodni ishga tushirish ▶
          </button>
        </div>
      </div>

      <div className="compiler-body">
        <div className="editor-side">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            autoFocus
            placeholder="Kodingizni shu yerga yozing..."
          />
        </div>

        <div className="output-side">
          <div className="output-label">
            <span>Terminal / Console</span>
            <span className="status-indicator">Online</span>
          </div>
          <pre className="output-screen">{output || "// Natija shu yerda ko'rinadi..."}</pre>
        </div>
      </div>
    </div>
  );
}

export default Compiler;