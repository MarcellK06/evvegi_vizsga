import { pdfjs, Document, Page } from "react-pdf";
import PDF from "../Media/DEVDOC.pdf";
import { useState } from "react";
function DEVDOC() {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const [page, setPage] = useState(1);

  const decrementPages = () => {
    if (page == 1) return;
    setPage(page - 1);
  };
  const incrementPages = () => {
    if (page == 8) return;
    setPage(page + 1);
  };

  return (
    <>
      <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        <iframe
          src="https://api.szalkacar.hu/devdoc"
          style={{ border: 0, width: "100%", height: "100%" }}
          title="DEVDOC iframe"
        >
          Your browser doesn't support iFrames.
        </iframe>
      </div>
      <div></div>
    </>
  );
}
export default DEVDOC;
