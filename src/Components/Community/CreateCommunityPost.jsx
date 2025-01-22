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
    var images = "";
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/community/create-post`,
      type: "post",
      data: {
        userid: userid,
        title: title,
        description: description,
        images: images,
      },
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
                <label htmlFor="title" className="text-center">
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
                <label htmlFor="description" className="text-center">
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
                    className="buttoncolor text p-1 pt-1 ps-3 ms-1"
                    style={{ marginRigth: "30px" }}
                  >
                    Fájlok csatolása{" "}
                    <FaFile
                    className=" ms-autoborder-0 rounded-circle buttoncolor"
                    size={30}
                 
                    />
                  </div>
                </div>
                <div className="d-flex text-center">
                  <div
                    className="buttoncolor text p-1 pt-1 ps-3 ms-1"
                    style={{ marginRigth: "30px" }}
                  >
                    Küldés{" "}
                    <IoMdSend
                      onClick={CreatePost}
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
