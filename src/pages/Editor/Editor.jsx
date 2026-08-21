import React, { useState } from "react";
import { FiPlay, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { supabase } from "../../lib/supabaseClient";
import "./Editor.css";

const LANGUAGE_TEMPLATES = {
  javascript: `// JavaScript kodi
let ism = "Azizbek";
console.log("Salom, " + ism + "!");
print(2 + 2 * 2);`,
  python: `# Python kodi
ism = "Azizbek"
print("Salom,", ism)
print(2 + 2 * 2)`,
  golang: `// Go kodi
package main
import "fmt"

func main() {
    fmt.Println("Salom EduCodeHub!")
}`,
  cpp: `// C++ kodi
#include <iostream>
using namespace std;

int main() {
    cout << "Salom C++!" << endl;
    return 0;
}`,
  html: `<!-- HTML/CSS kodi -->
<h1 style="color: #00ffcc;">Salom EduCodeHub!</h1>
<p>Interaktiv HTML ko'rinishi.</p>`
};

function Editor() {
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [output, setOutput] = useState("");
  const [xpEarned, setXpEarned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    setCode(LANGUAGE_TEMPLATES[lang] || "");
    setOutput("");
  };

  const runCode = () => {
    let logs = [];

    const customConsole = {
      log: (...args) => {
        logs.push(
          args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" ")
        );
      },
      error: (err) => logs.push("Xatolik: " + err),
      warn: (warn) => logs.push("Ogohlantirish: " + warn),
    };

    const customPrint = (...args) => {
      logs.push(args.map((arg) => String(arg)).join(" "));
    };

    try {
      if (selectedLang === "javascript" || selectedLang === "html") {
        const script = new Function("console", "print", code);
        script(customConsole, customPrint);
        setOutput(logs.length > 0 ? logs.join("\n") : "Kod bajarildi (natija yo'q)");
      } else if (selectedLang === "python") {
        const lines = code.split("\n");
        lines.forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
            let inner = trimmed.slice(6, -1).trim();
            if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
              logs.push(inner.slice(1, -1));
            } else {
              try {
                logs.push(Function(`"use strict"; return (${inner})`)());
              } catch {
                logs.push(inner);
              }
            }
          }
        });
        setOutput(logs.length > 0 ? logs.join("\n") : "Python kodi bajarildi.");
      } else if (selectedLang === "golang") {
        const match = code.match(/Println\((.*)\)/);
        if (match) logs.push(match[1].replace(/"/g, ''));
        setOutput(logs.length > 0 ? logs.join("\n") : "Go kodi bajarildi.");
      } else if (selectedLang === "cpp") {
        const match = code.match(/cout\s*<<\s*["']([^"']+)["']/);
        if (match) logs.push(match[1]);
        setOutput(logs.length > 0 ? logs.join("\n") : "C++ kodi bajarildi.");
      }
    } catch (err) {
      setOutput("Xatolik: " + err.message);
    }
  };

  const completeLesson = async () => {
    if (xpEarned || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_points")
          .eq("id", user.id)
          .single();

        const currentXP = profile?.xp_points || 0;
        const updatedXP = currentXP + 50;

        await supabase
          .from("profiles")
          .update({ xp_points: updatedXP })
          .eq("id", user.id);

        setXpEarned(true);
        alert("Tabriklaymiz! Dars tugatildi va sizga +50 EXP berildi! 🚀");
      } else {
        alert("EXP olish uchun hisobingizga kiring!");
      }
    } catch (err) {
      console.error("EXP berishda xatolik:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-header">
        <div className="editor-info">
          <select value={selectedLang} onChange={handleLangChange} className="lang-select">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="golang">Go (Golang)</option>
            <option value="cpp">C++</option>
            <option value="html">HTML / CSS</option>
          </select>
          <h3>Kod Muharriri</h3>
        </div>

        <div className="editor-actions">
          <button className="run-button" onClick={runCode}>
            <FiPlay /> Ishga tushirish ⚡
          </button>
          <button
            className={`complete-btn ${xpEarned ? "earned" : ""}`}
            onClick={completeLesson}
            disabled={xpEarned || isSubmitting}
          >
            <FiCheckCircle /> {xpEarned ? "Tugatildi (+50 EXP)" : "Darsni tugatish"}
          </button>
        </div>
      </div>

      <div className="editor-main-content">
        <div className="code-area">
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
              <FiTrash2 /> Tozalash
            </button>
          </div>
          {selectedLang === "html" ? (
            <iframe
              title="html-preview"
              srcDoc={code}
              className="html-preview-box"
            />
          ) : (
            <pre className="console-box">{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;