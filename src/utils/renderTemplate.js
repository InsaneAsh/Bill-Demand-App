export function renderTemplate(body, s) {
  const m = { name: s.name, class: s.class_name, month: s.month, date: s.date, tuition: s.tuition,
    vehicle: s.vehicle, fine: s.fine, annual: s.annual, dues: s.dues, total: s.total, phone: s.phone };
  return body.replace(/\{(\w+)\}/g, (_, k) => (k in m ? (m[k] === "" || m[k] == null ? "—" : m[k]) : `{${k}}`));
}
export const FEE_FIELDS = ["tuition", "vehicle", "fine", "annual", "dues"];
export const calcTotal = (s) =>
  String(FEE_FIELDS.reduce((sum, k) => sum + (parseFloat(String(s[k] || "").replace(/[^\d.\-]/g, "")) || 0), 0));
