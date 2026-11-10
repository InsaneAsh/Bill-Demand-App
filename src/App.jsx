import { useEffect, useState } from "react";
import { api } from "./api/client.js";
import FileUploader from "./components/FileUploader.jsx";
import TemplateEditor from "./components/TemplateEditor.jsx";
import StudentTable from "./components/StudentTable.jsx";
import MessagePreview from "./components/MessagePreview.jsx";
import SendPanel from "./components/SendPanel.jsx";

export default function App() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [template, setTemplate] = useState("");
  const [saved, setSaved] = useState("");
  const [preview, setPreview] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");

  const loadStudents = () => api.students().then(setStudents).catch((e) => setError(e.message));
  useEffect(() => {
    loadStudents();
    api.template().then((t) => { setTemplate(t.body); setSaved(t.body); }).catch((e) => setError(e.message));
    api.config().then(setConfig).catch(() => {});
  }, []);

  const onStudents = (list) => { setStudents(list); setSelected(new Set(list.map((s) => s.id))); setError(""); };
  const saveTemplate = async () => { try { await api.saveTemplate(template); setSaved(template); } catch (e) { setError(e.message); } };
  const resetTemplate = async () => { try { const t = await api.resetTemplate(); setTemplate(t.body); setSaved(t.body); } catch (e) { setError(e.message); } };
  const sendOne = async (s) => {
    if (!confirm(`Send bill to ${s.name || "this student"}?`)) return;
    try { await api.sendOne(s.id); setError(""); } catch (e) { setError(e.message); }
    loadStudents();
  };

  return (
    <main>
      <h1>🧾 Demand Bill Sender</h1>
      <p className="sub">Upload, edit, preview and send fee bills on WhatsApp.</p>
      {error && <div className="err" onClick={() => setError("")}>{error} (click to dismiss)</div>}
      <div className="grid two">
        <FileUploader onStudents={onStudents} onError={setError} />
        <TemplateEditor value={template} onChange={setTemplate} onSave={saveTemplate} onReset={resetTemplate} dirty={template !== saved} />
      </div>
      <StudentTable students={students} setStudents={setStudents} selected={selected} setSelected={setSelected}
        onPreview={setPreview} onSend={sendOne} onError={setError} />
      <div className="grid two">
        <MessagePreview template={template} student={preview && (students.find((s) => s.id === preview.id) || preview)} />
        <SendPanel selected={selected} students={students} config={config} onJobUpdate={loadStudents} onError={setError} />
      </div>
    </main>
  );
}
