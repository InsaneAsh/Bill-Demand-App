export default function TemplateEditor({ value, onChange, onSave, onReset, dirty }) {
  return (
    <div className="card">
      <h2>2. Message template</h2>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
      <div className="row" style={{ marginTop: 8 }}>
        <button className="pri" onClick={onSave} disabled={!dirty}>Save template</button>
        <button onClick={onReset}>Reset to default</button>
      </div>
      <p className="note">Placeholders: {"{name} {class} {month} {date} {tuition} {vehicle} {fine} {annual} {dues} {total} {phone}"}</p>
    </div>
  );
}
