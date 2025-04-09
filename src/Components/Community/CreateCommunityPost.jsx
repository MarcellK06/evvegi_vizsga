import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { FaFile, FaImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

function CreateCommunityPost() {
  var API = CONFIG.API;

  const titleRef = useRef();
  const descriptionRef = useRef();
  const imagesRef = useRef();

  const CreatePost = () => {
    var title = titleRef.current.value;
    var description = descriptionRef.current.value;
    if (title == "" || description == "") return;
    var images = imagesRef.current.files;
    console.log(images);
    var userid = Cookie.get("userid");
    var data = new FormData();
    data.append("userid", userid);
    data.append("title", title);
    data.append("description", description);
    var l = images.length;
    for (var k = 0; k < l; k++) {
      data.append(`images-${k}`, images[k]);
    }
    $.ajax({
      url: `${API}/community/create-post`,
      type: "post",
      data: data,
      processData: false,
      contentType: false,
      success: function (resp) {
        window.location.reload();
      },
    });
  };

  return (
    <>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="create-post-card bg-white rounded-3 shadow-sm p-4 mb-4">
              <h4 className="mb-4 fw-bold">Bejegyzés közzététele</h4>
              
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Cím
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  ref={titleRef}
                  required
                  className="form-control form-control-lg border"
                  placeholder="Add meg a bejegyzés címét"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold">
                  Törzs
                </label>
                <textarea
                  cols="10"
                  rows="5"
                  ref={descriptionRef}
                  className="form-control"
                  placeholder="Írd le a bejegyzés tartalmát..."
                ></textarea>
              </div>
              
              <div className="file-upload-preview mb-3" id="filePreviewContainer">
                {/* File previews will be displayed here via JavaScript */}
              </div>
              
              <div className="d-flex flex-wrap justify-content-between align-items-center mt-4">
                <button
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => document.getElementById("file").click()}
                >
                  <FaImage className="me-2" />
                  <span>Fájlok csatolása</span>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    ref={imagesRef}
                    style={{ display: "none" }}
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      // Display file names when files are selected
                      const fileContainer = document.getElementById("filePreviewContainer");
                      fileContainer.innerHTML = "";
                      
                      if (e.target.files.length > 0) {
                        const fileList = document.createElement("div");
                        fileList.className = "list-group mt-2";
                        
                        for (let i = 0; i < e.target.files.length; i++) {
                          const fileItem = document.createElement("div");
                          fileItem.className = "list-group-item d-flex align-items-center";
                          fileItem.innerHTML = `
                            <FaFile className="me-2 text-primary" />
                            <span>${e.target.files[i].name}</span>
                          `;
                          fileList.appendChild(fileItem);
                        }
                        
                        fileContainer.appendChild(fileList);
                      }
                    }}
                  />
                </button>
                
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={CreatePost}
                >
                  <span className="me-2">Küldés</span>
                  <IoMdSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCommunityPost;
