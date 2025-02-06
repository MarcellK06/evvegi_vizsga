import { pdfjs, Document, Page } from "react-pdf";
import PDF from "../Media/GDPR.pdf";
import { useState } from "react";
function GDPR() {
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
          src="https://code2-api.paraghtibor.hu/gdpr"
          style={{ border: 0, width: "100%", height: "100%" }}
          title="GDPR iframe"
        >
          Your browser doesn't support iFrames.
        </iframe>
      </div>
      <div></div>
      {/*<div className="row">
            <div className="col-4"></div>
        <div className="col-4">
        <Document file={PDF} renderAnnotationLayer={false}>
            <Page pageNumber={page}/>
        </Document>
      <p className='text-center'>
        {page}. oldal a 8-ból
      </p>
      <div className="d-flex">
        <input type="button" value="<" onClick={decrementPages} className='form-control hoverbutton' />
        <input type="button" value=">" onClick={incrementPages}  className='form-control hoverbutton' /></div>
        </div>
        <div className="col-4">

        </div>

        </div>*/}
    </>
  );
}
export default GDPR;
