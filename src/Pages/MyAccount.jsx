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
          </div>
          <div className="row my-2">
            <div className="col-3"></div>
            <div className="col-6 d-flex">
              <div className="form-control my-3 hoverbutton d-flex flex-column text-center mx-3 p-2"
                onClick={() => (window.location.href = "/my-account/posts")}>
                <FaThList size={20} className="mx-auto"/>
                <p className="m-0 my-1">Bejegyzések
                </p>
              </div>
              <div className="form-control my-3 hoverbutton d-flex flex-column text-center mx-3 p-2"
                onClick={() => (window.location.href = "/my-account/listings")}>
                <FaNewspaper size={20} className="mx-auto"/>
                <p className="m-0 my-1">
                Hirdetések
                </p>
              </div>
              <div className="form-control my-3 hoverbutton d-flex flex-column text-center mx-3 p-2"
                onClick={() => (window.location.href = "/my-account/requests")}>
                <IoIosPricetags size={20} className="mx-auto"/>
                <p className="m-0 my-1">
                Árajánlatok
                </p>
              </div>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default MyAccount;
