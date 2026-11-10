import { api } from "../api/client.js";
import { FEE_FIELDS, calcTotal } from "../utils/renderTemplate.js";

const COLS = [["name", "Name"], ["class_name", "Class"], ["month", "Month"], ["date", "Date"], ["tuition", "Tuition"],
  ["vehicle", "Vehicle"], ["fine", "Late Fine"], ["annual", "Annual"], ["dues", "Back Dues"], ["total", "Total"], ["phone", "Phone"]];

export default function StudentTable({ students, setStudents, selected, setSelected, onPreview, onSend, onError }) {
  const edit = (id, field, value) =>
    setStudents((list) => list.map((s) => {
      if (s.id !== id) return s;
      const n = { ...s, [field]: value, status: "pending" };
      if (FEE_FIELDS.includes(field)) n.total = calcTotal(n);
      return n;
    }));
  const save = async (s) => { try { await api.update(s.id, s); } catch (e) { onError(e.message); } };
  const toggle = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = (on) => setSelected(on ? new Set(students.map((s) => s.id)) : new Set());
  const add = async () => { try { setStudents([...students, await api.add()]); } catch (e) { onError(e.message); } };
  const del = async (id) => { try { await api.remove(id); setStudents(students.filter((s) => s.id !== id)); } catch (e) { onError(e.message); } };

  return (
    <div className="card">
      <h2>3. Students <span className="tag">{students.length}</span></h2>
      <div className="scroll">
        <table>
          <thead><tr>
            <th><input type="checkbox" checked={students.length > 0 && selected.size === students.length} onChange={(e) => toggleAll(e.target.checked)} /></th>
            <th>#</th>{COLS.map(([, l]) => <th key={l}>{l}</th>)}<th>Status</th><th></th>
          </tr></thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td><input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} /></td>
                <td>{i + 1}</td>
                {COLS.map(([k]) => (
                  <td key={k}><input value={s[k] ?? ""} onChange={(e) => edit(s.id, k, e.target.value)} onBlur={() => save(s)} /></td>
                ))}
                <td className={"st-" + s.status}>{s.status}</td>
                <td className="nowrap">
                  <button onClick={() => onPreview(s)}>Preview</button>{" "}
                  <button className="pri" onClick={() => onSend(s)}>Send</button>{" "}
                  <button onClick={() => del(s.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!students.length && <p className="note">No students yet. Upload a file or add a row.</p>}
      <button onClick={add} style={{ marginTop: 8 }}>+ Add row</button>
    </div>
  );
}
