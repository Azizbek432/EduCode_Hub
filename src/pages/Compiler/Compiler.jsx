import React, { useState } from "react";
import "./Compiler.css";

const DEFAULT_TEMPLATES = {
  javascript: `// JavaScript kodingizni yozing...\nconsole.log("Salom, EduCode Hub!");\n\nlet a = 10;\nlet b = 20;\nconsole.log("Natija:", a + b);`,
  python: `# Python kodingizni yozing...\nprint("Salom, EduCode Hub!")\n\na = 10\nb = 20\nprint("Natija:", a + b)`,
  cpp: `// C++ kodingizni yozing...\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Salom, EduCode Hub!" << endl;\n    int a = 10, b = 20;\n    cout << "Natija: " << a + b << endl;\n    return 0;\n}`,
  html: `<!-- HTML/CSS kodingizni yozing -->\n<div style="padding: 20px; color: #40c9ff;">\n  <h1>Salom, EduCode Hub!</h1>\n  <p>Dasturlashni qulay muhitda o'rganing.</p>\n</div>`
};

function Compiler() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_TEMPLATES.javascript);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_TEMPLATES[newLang] || "");
    setOutput("");
  };

  const lineNumbers = code.split("\n").map((_, index) => index + 1).join("\n");

  const runJavaScript = () => {
    let logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
      error: (...args) => logs.push("❌ " + args.join(" ")),
      warn: (...args) => logs.push("⚠️ " + args.join(" ")),
      info: (...args) => logs.push("ℹ️ " + args.join(" "))
    };

    try {
      const script = new Function("console", code);
      script(customConsole);
      setOutput(logs.join("\n") || "⚡️ Kod bajarildi (hech qanday console ma'lumoti yo'q).");
    } catch (err) {
      setOutput("❌ Xatolik: " + (err.message || err));
    }
  };

  const runPistonApi = async (lang, version) => {
    setIsLoading(true);
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          version: version,
          files: [{ content: code }]
        })
      });
      const data = await res.json();
      if (data.run) {
        setOutput(data.run.output || "⚡️ Kod bajarildi.");
      } else {
        setOutput("❌ Xatolik: Serverdan ma'lumot olinmadi.");
      }
    } catch (err) {
      setOutput("❌ Server xatoligi: " + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const runCode = () => {
    setOutput("");
    if (language === "javascript") {
      runJavaScript();
    } else if (language === "python") {
      runPistonApi("python", "3.10.0");
    } else if (language === "cpp") {
      runPistonApi("cpp", "10.2.0");
    } else if (language === "html") {
      setOutput("HTML mode active");
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
          <select className="language-select" value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript (Node.js/Browser)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="html">HTML / Preview</option>
          </select>
        </div>
        <div className="compiler-actions">
          <button className="clear-btn" onClick={clearOutput}>
            Tozalash
          </button>
          <button className="compile-run-btn" onClick={runCode} disabled={isLoading}>
            {isLoading ? "Bajarilmoqda..." : "Kodni ishga tushirish ▶"}
          </button>
        </div>
      </div>

      <div className="compiler-body">
        <div className="editor-side">
          <div className="line-numbers">{lineNumbers}</div>
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
            <span>TERMINAL / PREVIEW</span>
            <span className="status-indicator">{isLoading ? "EXECUTING..." : "ONLINE"}</span>
          </div>
          {language === "html" ? (
            <iframe
              title="html-preview"
              className="html-preview-frame"
              srcDoc={code}
            />
          ) : (
            <pre className="output-screen">
              {output || "// Natija shu yerda ko'rinadi..."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compiler;