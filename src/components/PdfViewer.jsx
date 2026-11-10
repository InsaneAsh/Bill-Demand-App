import { useEffect, useState } from "react";
export default function PdfViewer({ file }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) return setUrl(null);
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!url) return null;
  return (
    <div>
      <iframe src={url} title="PDF preview" className="pdf" />
      <p className="note">{file.name} · <a href={url} target="_blank" rel="noreferrer">open in new tab</a></p>
    </div>
  );
}
