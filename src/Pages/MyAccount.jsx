import LoadOwnListings from "../Components/MyAccount/LoadOwnListings";
import LoadOwnPosts from "../Components/MyAccount/LoadOwnPosts";
import LoadProfileData from "../Components/MyAccount/LoadProfileData";
import { FaThList, FaNewspaper  } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
function MyAccount() {
  return (
    <div className="my-3">
      <LoadProfileData />
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row text-center border-bottom">
            <p className="fs-3">Bejegyzések, Hírdetések és Egyebek</p>
          </div><div className="row p-0 mx-auto">
            <div className="col-0 col-md-2"></div>
            <div className="col-12 col-md-8">
              <div className="row justify-content-center">
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/my-account/posts")}
                  >
                    <FaThList size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Bejegyzések</p>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/my-account/listings")}
                  >
                    <FaNewspaper size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Hirdetések</p>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3 mb-3">
                  <div
                    className="form-control my-3 hoverbutton d-flex flex-column text-center container px-3"
                    onClick={() => (window.location.href = "/my-account/requests")}
                  >
                    <IoIosPricetags size={20} className="mx-auto" />
                    <p className="mb-0 pt-2">Árajánlatok</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default MyAccount;
