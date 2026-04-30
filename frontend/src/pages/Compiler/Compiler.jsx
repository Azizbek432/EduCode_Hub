import { useState } from "react";
import "./Compiler.css";

function Compiler() {
  const [code, setCode] = useState(
    `// JavaScript kodingizni yozing...\nconsole.log("Salom, EduCode Hub!");\n\nlet a = 10;\nlet b = 20;\nconsole.log("Natija:", a + b);`,
  );
  const [output, setOutput] = useState("");

  const runCode = () => {
    let logs = [];
    const customConsole = {
      log: (...args) =>
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg),
            )
            .join(" "),
        ),
      error: (err) => logs.push("❌ Xatolik: " + err),
    };

    try {
      const script = new Function("console", code);
      script(customConsole);
      setOutput(logs.join("\n") || "Kod bajarildi.");
    } catch (err) {
      setOutput("❌ Xatolik: " + err.message);
    }
  };

  return (
    <div className="compiler-page">
      <div className="compiler-header">
        <div className="compiler-title">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
          <span className="filename">main.js — JavaScript</span>
        </div>
        <button className="compile-run-btn" onClick={runCode}>
          Kodni ishga tushirish ▶
        </button>
      </div>

      <div className="compiler-body">
        <div className="editor-side">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            autoFocus
          />
        </div>

        <div className="output-side">
          <div className="output-label">Terminal / Console</div>
          <pre className="output-screen">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default Compiler;
