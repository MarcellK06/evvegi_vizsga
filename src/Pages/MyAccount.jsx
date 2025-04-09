import LoadOwnListings from "../Components/MyAccount/LoadOwnListings";
import LoadOwnPosts from "../Components/MyAccount/LoadOwnPosts";
import LoadProfileData from "../Components/MyAccount/LoadProfileData";
import { FaThList, FaNewspaper } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
function MyAccount() {
  return (
    <div className="user-dashboard">
      <LoadProfileData />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Bejegyzések, Hírdetések és Egyebek</h2>
        </div>
        
        <div className="dashboard-grid">
          <div 
            className="dashboard-card"
            onClick={() => (window.location.href = "/my-account/posts")}
          >
            <div className="card-icon">
              <FaThList />
            </div>
            <p className="card-label">Bejegyzések</p>
          </div>
          
          <div 
            className="dashboard-card"
            onClick={() => (window.location.href = "/my-account/listings")}
          >
            <div className="card-icon">
              <FaNewspaper />
            </div>
            <p className="card-label">Hirdetések</p>
          </div>
          
          <div 
            className="dashboard-card"
            onClick={() => (window.location.href = "/my-account/requests")}
          >
            <div className="card-icon">
              <IoIosPricetags />
            </div>
            <p className="card-label">Árajánlatok</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default MyAccount;
