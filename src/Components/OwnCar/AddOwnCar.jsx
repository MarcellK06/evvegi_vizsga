import { useContext, useRef, useState } from "react"
import CONFIG from "../../config.json"
import $ from "jquery"
import Cookie from "js-cookie"
import { FaCar, FaUpload, FaIdCard } from "react-icons/fa"
import { ModalContext } from "../../Providers/ModalProvider"

function AddOwnCar() {
  const { CreateModal } = useContext(ModalContext)
  const [fileCount, setFileCount] = useState(0)
  var API = CONFIG.API
  const nicknameRef = useRef()
  const brandRef = useRef()
  const modelRef = useRef()
  const yearRef = useRef()
  const licenseplateRef = useRef()
  const vinRef = useRef()
  const requiredImagesRef = useRef()

  const HandleCarAdd = () => {
    var userid = Cookie.get("userid")
    var nickname = nicknameRef.current.value
    var brand = brandRef.current.value
    var model = modelRef.current.value
    var year = yearRef.current.value
    var licenseplate = licenseplateRef.current.value
    var vin = vinRef.current.value
    if (
      nickname == "" ||
      brand == "" ||
      model == "" ||
      year == "" ||
      year.length < 4 ||
      licenseplate == "" ||
      licenseplate.length < 6 ||
      vin == "" ||
      vin.length != 17
    ) {
      CreateModal(
        <div className="modal-header">
          <h4 className="modal-title text-danger">A jármű hozzáadása sikertelen!</h4>
        </div>,
        <div className="modal-body">
          <div className="alert alert-danger">Kérjük ellenőrizze adatait, hogy mindent jól adott meg!</div>
          <ul className="text-muted">
            <li>Az évjáratnak legalább 4 számjegyből kell állnia</li>
            <li>A rendszámnak legalább 6 karakterből kell állnia</li>
            <li>Az alvázszámnak pontosan 17 karakterből kell állnia</li>
          </ul>
        </div>,
        true,
      )
      return
    }
    var requiredImages = requiredImagesRef.current.files
    if (!requiredImages) {
      CreateModal(
        <div className="modal-header">
          <h4 className="modal-title text-danger">Hibás adatbevitel</h4>
        </div>,
        <div className="modal-body">
          <div className="alert alert-warning">Kérem, adja meg a kötelező képeket.</div>
        </div>,
        true,
      )
      return
    }
    if (requiredImages.length != 3) {
      CreateModal(
        <div className="modal-header">
          <h4 className="modal-title text-danger">Hibás adatbevitel</h4>
        </div>,
        <div className="modal-body">
          <div className="alert alert-warning">
            Kérem, adja meg az összes szükséges képet! Pontosan 3 fájlt kell feltölteni.
          </div>
          <p className="text-muted small">Szükséges dokumentumok: forgalmi eleje, forgalmi hátúlja, alvázszám</p>
        </div>,
        true,
      )
      return
    }
    var data = new FormData()
    data.append("userid", userid)
    data.append("nickname", nickname)
    data.append("brand", brand)
    data.append("model", model)
    data.append("year", year)
    data.append("licenseplate", licenseplate)
    data.append("vin", vin)
    data.append("registration_file_1", requiredImages[0])
    data.append("registration_file_2", requiredImages[1])
    data.append("registration_file_3", requiredImages[2])
    $.ajax({
      url: `${API}/car/add`,
      data: data,
      processData: false,
      contentType: false,
      type: "post",
      success: (resp) => {
        CreateModal(
          <div className="modal-header">
            <h4 className="modal-title text-success">
              <FaCar className="me-2" />
              Sikeres jármű hozzáadás
            </h4>
          </div>,
          <div className="modal-body">
            <div className="alert alert-success">Járművét sikeresen hozzáadtuk a rendszerhez!</div>
            <p>Kérjük várjon, míg egy adminisztrátor átnézi jármű adatait és jóváhagyja azt!</p>
          </div>,
          true,
        )
      },
    })
  }

  const handleFileChange = (e) => {
    setFileCount(e.target.files.length)
  }

  const AddCarModal = () => {
    return (
      <div className="add-car-form">
        <div className="info-message mb-4">
          <div className="alert alert-info">
            Járművét feltöltése után egyik adminisztrátorunknak jóvá kell hagynia, ez egy napig is eltarthat!
          </div>
        </div>

        <div className="form-section mb-4">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="nickname"
              placeholder="Pl. Családi autó"
              ref={nicknameRef}
              required
            />
            <label htmlFor="nickname">Jármű azonosítója</label>
          </div>
        </div>

        <div className="form-section mb-4">
          <h5 className="section-title">Jármű adatok</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  placeholder="Pl. Toyota"
                  ref={brandRef}
                  required
                />
                <label htmlFor="brand">Gyártó</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="model"
                  placeholder="Pl. Corolla"
                  ref={modelRef}
                  required
                />
                <label htmlFor="model">Gyártmány</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input type="text" className="form-control" id="year" placeholder="Pl. 2018" ref={yearRef} required />
                <label htmlFor="year">Évjárat</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section mb-4">
          <h5 className="section-title">Azonosító adatok</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="licenseplate"
                  placeholder="Pl. ABC-123"
                  ref={licenseplateRef}
                  required
                />
                <label htmlFor="licenseplate">Rendszám</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="vin"
                  placeholder="17 karakteres alvázszám"
                  ref={vinRef}
                  required
                />
                <label htmlFor="vin">Alvázszám</label>
                <div className="form-text">Pontosan 17 karakter hosszú</div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section mb-4">
          <h5 className="section-title">Dokumentumok</h5>
          <div className="document-upload">
            <label htmlFor="images" className="form-label">
              <FaIdCard className="me-2" />
              Forgalmi eleje, hátúlja, alvázszám (3 kép)
            </label>
            <div className="input-group">
              <input
                type="file"
                className="form-control"
                id="images"
                ref={requiredImagesRef}
                required
                accept="image/png, image/jpeg"
                multiple
                onChange={handleFileChange}
              />
              <span className={`input-group-text ${fileCount === 3 ? "bg-success text-white" : ""}`}>
                {fileCount}/3
              </span>
            </div>
            <div className="form-text">
              Kérjük, töltse fel a forgalmi mindkét oldalát és az alvázszámról készült képet
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={HandleCarAdd}>
            <FaUpload className="me-2" />
            Jármű feltöltése
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="add-car-container">
      <div className="container py-3">
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary add-car-button"
            onClick={() =>
              CreateModal(
                <div className="modal-header">
                  <h4 className="modal-title">
                    <FaCar className="me-2" />
                    Jármű Hozzáadása
                  </h4>
                </div>,
                AddCarModal(),
                true,
              )
            }
          >
            <FaCar className="me-2" />
            Jármű Hozzáadása
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddOwnCar

