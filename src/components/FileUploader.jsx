import { useState } from "react";
import { api } from "../api/client.js";
import PdfViewer from "./PdfViewer.jsx";

export default function FileUploader({ onStudents, onError }) {
  const [pdf, setPdf] = useState(null);
  const [busy, setBusy] = useState(false);

  const uploadData = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBusy(true);
    try { onStudents(await api.upload(f)); } catch (err) { onError(err.message); }
    setBusy(false);
    e.target.value = "";
  };
  const sample = () => {
    const csv = "Name,Class,Month,Date,Tuition,Vehicle,Late Fine,Annual Fee,Back Dues,Phone\nKanak Tiwari,IX,August,01/08/2026,1500,400,,,800,7779932889\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students-sample.csv";
    a.click();
  };

  return (
    <div className="card">
      <h2>1. Upload files</h2>
      <label>CSV / XLSX (student data)</label>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={uploadData} disabled={busy} />
      <p className="note">Uploading replaces the current list. <button onClick={sample}>Sample CSV</button></p>
      <hr />
      <label>PDF (optional reference)</label>
      <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0] || null)} />
      <PdfViewer file={pdf} />
    </div>
  );
}
