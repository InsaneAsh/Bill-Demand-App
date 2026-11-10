import { renderTemplate } from "../utils/renderTemplate.js";
export default function MessagePreview({ template, student }) {
  return (
    <div className="card">
      <h2>Preview <span className="tag">{student?.name || "–"}</span></h2>
      <div className="pv">{student ? renderTemplate(template, student) : "Click Preview on a student."}</div>
    </div>
  );
}
