import { useRef } from "react";
import CONFIG from "../../config.json";
import $ from "jquery";
import Cookie from "js-cookie";
import { FaFile } from "react-icons/fa";
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
    for(var k = 0; k < l; k++)
    {
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
      <div className="container">
        <div className="row">
          <div className="col-sm-6 mx-auto">
            <div className="post w-100 mt-5">
              <h5>Bejegyzés létrehozása</h5>
              <div>
                <label htmlFor="title" className="text-center noselect">
                  Cím
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  ref={titleRef}
                  required
                  className="my-1 border-0 rounded post w-100 mx-auto h-50 bg-white"
                />
                <label htmlFor="description" className="text-center noselect">
                  Törzs
                </label>
                <textarea
                  cols="10"
                  rows="5"
                  ref={descriptionRef}
                  className="form-control w-100"
                ></textarea>
              </div>
              <div className="container-fluid d-flex justify-content-end mt-3">
                <div className="d-flex text-center">
                  <div
                    className="buttoncolor text p-1 pt-1 ps-3 ms-1 noselect"
                    style={{ marginRigth: "30px" }}
                    onClick={() => document.getElementById('file').click()}
                  >
                    <input type="file" name="file" id="file" ref={imagesRef} style={{display: "none"}} multiple accept="images/png, images/jpeg" />
                    Fájlok csatolása{" "}
                    <FaFile
                      className=" ms-autoborder-0 rounded-circle buttoncolor"
                      size={30}
                    />
                  </div>
                </div>
                <div className="d-flex text-center">
                  <div
                    className="buttoncolor text p-1 pt-1 ps-3 ms-1 noselect"
                    onClick={CreatePost}
                    style={{ marginRigth: "30px" }}
                  >
                    Küldés{" "}
                    <IoMdSend
                      className="ms-auto border-0 rounded-circle buttoncolor"
                      size={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCommunityPost;
