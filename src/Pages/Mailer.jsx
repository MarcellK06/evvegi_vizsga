import { useContext, useEffect, useRef, useState } from "react";
import $ from "jquery";
import API from "../config.json";
import Cookies from "js-cookie";
import { ModalContext } from "../Providers/ModalProvider";
import { useNavigate } from "react-router-dom";
function Mailer() {
  const [mails, setMails] = useState([]);

  const { CreateModal } = useContext(ModalContext);

    const navi = useNavigate();
  const CheckUser = () => {
    var rankid = Cookies.get("rank");
    if (rankid != 1) {
      navi("/");
  }
};
  const previewTitle = useRef();
  const previewBody = useRef();
  const PreviewElement = () => {
    return (
      <>
        <div>
          <div
            style={{
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              padding: "5px 0",
            }}
          >
            <img
              src="https://code1-web.paraghtibor.hu/static/media/logo.054ff8c9fa696cfba909.png"
              style={{ width: "25%" }}
              alt="Logo"
            />
          </div>
          <h2
            style={{
              textAlign: "center",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            ref={previewTitle}
          ></h2>
          <div
            style={{
              padding: "0 15px",
              textAlign: "center",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div ref={previewBody}></div>
          </div>
          <div
            style={{
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              padding: "5px 0",
              color: "#fff",
            }}
          >
            <p style={{ margin: "0" }}>2025 SzalkaAutó</p>
          </div>
        </div>
      </>
    );
  };
  const [Preview, setPreview] = useState(PreviewElement("", ""));

  const toRef = useRef();
  const subjectRef = useRef();
  const messageBody = useRef();
  const titleRef = useRef();

  const MailWriter = (title, message) => {
    return (
      <>
        <div className="row">
          <div className="col-sm">
            <div className="input-group mb-2">
              <input
                type=""
                placeholder="Címzett"
                className="form-control"
                ref={toRef}
              />
            </div>
            <div className="input-group mb-2">
              <input
                type=""
                placeholder="Tárgy"
                className="form-control"
                ref={subjectRef}
              />
            </div>
            <div className="input-group mb-2">
              <input
                type=""
                placeholder="Cím"
                className="form-control"
                ref={titleRef}
                onInput={() => DataChanged()}
              />
            </div>
            <div className="input-group mb-2">
              <textarea
                className="form-control"
                placeholder="Üzenet"
                ref={messageBody}
                onInput={() => DataChanged()}
              ></textarea>
            </div>
            <div className="input-group mb-2">
              <button className="btn btn-dark" onClick={SendMail}>
                Küldés
              </button>
            </div>
          </div>
          <div className="col-sm">
            Preview
            {Preview}
          </div>
        </div>
      </>
    );
  };
  const DataChanged = () => {
    previewTitle.current.innerText = titleRef.current.value;
    previewBody.current.innerHTML = messageBody.current.value;
  };

  useEffect(() => {
    CheckUser();
    $.ajax({
      url: `${API.API}/mail`,

      data: { userid: Cookies.get("userid") },
      type: "post",
      headers: {
        token: API.TOKEN,
      },
      success: function (res) {
        setMails(res);
      },
    });
  }, []);

  const SendMail = () => {
    $.ajax({
      url: `${API.API}/mailer/send`,
      type: "post",
      headers: {
        token: API.TOKEN,
      },
      data: {
        to: toRef.current.value,
        subject: subjectRef.current.value,
        title: titleRef.current.value,
        body: messageBody.current.value,
      },
      success: function (res) {
        CreateModal(
          "Sikeres küldés",
          <>
            <hr />
            <h5>Az email sikersen elküldve!</h5>
          </>,
          true
        );
      },
    });
  };

  const EmailViewer = (item) => {
    const HTML = () => {
      return (
        <>
          <div className="mt-5">
            <p>
              Feladó: <b>{item.from}</b>
            </p>
            <p>
              Tárgy: <b>{item.subject}</b>
            </p>
            <p className="mt-4">{item.body}</p>
          </div>
        </>
      );
    };
    CreateModal("Email megtekintése", HTML, true);
  };

  return (
    <>
      <div
        className="loader-center"
        style={{ display: mails.length == 0 ? "flex" : "none" }}
      >
        <div className="loader"></div>
      </div>

      <div
        className="container"
        style={{ visibility: mails.length == 0 ? "hidden" : "visible" }}
      >
        <div className="d-flex justify-content-end my-3">
          <button
            className="btn btn-primary"
            onClick={() => CreateModal("Levélírás", MailWriter(), true)}
          >
            + Levélírás
          </button>
        </div>
        <div className="p-4 mails">
          <hr />
          {mails.map((i) => (
            <>
              <div className="d-flex" onClick={() => EmailViewer(i)}>
                <div className="ms-2">{i.from}</div>
                <div className="ms-2">{i.subject}</div>
                <div className="ms-auto">
                  {
                    new Date(i.date)
                      .toISOString()
                      .split("T")
                      .join(" ")
                      .split(".")[0]
                  }
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
    </>
  );
}
export default Mailer;
