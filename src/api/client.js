const call = async (url, opts) => {
  const r = await fetch("/api" + url, opts);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || r.statusText);
  return d;
};
const send = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) });

export const api = {
  students: () => call("/students"),
  upload: (file) => { const fd = new FormData(); fd.append("file", file); return call("/students/upload", { method: "POST", body: fd }); },
  add: () => call("/students", { method: "POST" }),
  update: (id, b) => call(`/students/${id}`, send("PUT", b)),
  remove: (id) => call(`/students/${id}`, { method: "DELETE" }),
  template: () => call("/templates/default"),
  saveTemplate: (body) => call("/templates/default", send("PUT", { body })),
  resetTemplate: () => call("/templates/reset", { method: "POST" }),
  config: () => call("/messages/config"),
  sendOne: (studentId) => call("/messages/send", send("POST", { studentId })),
  bulk: (studentIds, delayMs, maxPerBatch) => call("/messages/bulk", send("POST", { studentIds, delayMs, maxPerBatch })),
  job: (id) => call(`/messages/jobs/${id}`),
  stopJob: (id) => call(`/messages/jobs/${id}/stop`, { method: "POST" }),
};
