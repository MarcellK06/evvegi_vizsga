import LoadOwnListings from "../Components/MyAccount/LoadOwnListings";
import LoadOwnPosts from "../Components/MyAccount/LoadOwnPosts";
import LoadProfileData from "../Components/MyAccount/LoadProfileData";

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
            <div className="col-6">
              <input
                type="button"
                value="Bejegyzések"
                onClick={() => (window.location.href = "/my-account/posts")}
                className="form-control my-3 hoverbutton"
              />
              <input
                type="button"
                value="Hírdetések"
                onClick={() => (window.location.href = "/my-account/listings")}
                className="form-control my-3 hoverbutton"
              />
              <input
                type="button"
                value="Árajánlatok"
                onClick={() => (window.location.href = "/my-account/requests")}
                className="form-control my-3 hoverbutton"
              />
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
