import { useState } from "react";
import "./Editor.css";

function Editor() {
  const [code, setCode] = useState(`// Bu yerga kod yozing...
let ism = "Azizbek";
console.log("Salom, " + ism + "!");
console.log(2 + 2 * 2);`);
  const [output, setOutput] = useState("");

  const runCode = () => {
    let logs = [];

    // Maxsus console obyekti yaratamiz
    const customConsole = {
      log: (...args) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" "),
        );
      },
      error: (err) => logs.push("Xatolik: " + err),
      warn: (warn) => logs.push("Ogohlantirish: " + warn),
    };

    try {
      // eval() o'rniga xavfsizroq New Function ishlatamiz
      // Bu kodni alohida scope'da ishga tushiradi
      const script = new Function("console", code);
      script(customConsole); // Bizning custom console-ni uzatamiz

      setOutput(
        logs.length > 0 ? logs.join("\n") : "Kod bajarildi (natija yo'q)",
      );
    } catch (err) {
      setOutput("Xatolik: " + err.message);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-header">
        <div className="editor-info">
          <span className="lang-badge">JavaScript</span>
          <h3>Kod Muharriri</h3>
        </div>
        <button className="run-button" onClick={runCode}>
          Ishga tushirish ⚡
        </button>
      </div>

      <div className="editor-main-content">
        <div className="code-area">
          {/* Qator raqamlari uchun div qo'shishni tavsiya qilaman kelajakda */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            autoFocus
          />
        </div>

        <div className="output-area">
          <div className="output-label">
            <span>Natija (Console)</span>
            <button className="clear-btn" onClick={() => setOutput("")}>
              Tozalash
            </button>
          </div>
          <pre className="console-box">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default Editor;
