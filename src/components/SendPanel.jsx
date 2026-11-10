import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function SendPanel({ selected, students, config, onJobUpdate, onError }) {
  const [delay, setDelay] = useState(10);
  const [max, setMax] = useState(20);
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (config) { setDelay(Math.round(config.delayMs / 1000)); setMax(config.maxBatch); }
  }, [config]);

  // Poll job progress
  useEffect(() => {
    if (!job || job.state !== "running") return;
    const t = setInterval(async () => {
      try { const j = await api.job(job.id); setJob(j); onJobUpdate(); } catch (e) { onError(e.message); }
    }, 1500);
    return () => clearInterval(t);
  }, [job?.id, job?.state]);

  const start = async () => {
    try { setJob(await api.bulk([...selected], delay * 1000, max)); } catch (e) { onError(e.message); }
  };
  const stop = async () => { try { setJob(await api.stopJob(job.id)); } catch (e) { onError(e.message); } };
  const nameOf = (id) => students.find((s) => s.id === id)?.name || "#" + id;
  const running = job?.state === "running";
  const done = job ? job.items.filter((i) => i.status === "sent").length : 0;

  return (
    <div className="card">
      <h2>4. WhatsApp sending {config && <span className="tag">mode: {config.mode}</span>}</h2>
      <div className="row">
        <div><label>Wait between messages (sec)</label><input type="number" min="3" value={delay} onChange={(e) => setDelay(+e.target.value)} /></div>
        <div><label>Max per batch (server cap {config?.maxBatch})</label><input type="number" min="1" value={max} onChange={(e) => setMax(+e.target.value)} /></div>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="pri" onClick={start} disabled={running || !selected.size}>Send {selected.size} selected in bulk</button>
        <button onClick={stop} disabled={!running}>Stop</button>
      </div>
      {config?.mode === "dry" && <p className="note">Dry-run mode: nothing is actually sent. Set WHATSAPP_MODE in server/.env.</p>}
      {job && (
        <div style={{ marginTop: 10 }}>
          <p><b>{job.state}</b> · {done}/{job.items.length} sent{job.skipped ? ` · ${job.skipped} skipped (batch cap)` : ""}</p>
          <ul className="jobs">
            {job.items.map((i) => (
              <li key={i.studentId} className={"st-" + i.status}>{nameOf(i.studentId)}: {i.status}{i.error ? ` (${i.error})` : ""}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
