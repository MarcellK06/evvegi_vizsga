import { useEffect } from "react";
import AddOwnCar from "../Components/OwnCar/AddOwnCar";
import ListOwnCars from "../Components/OwnCar/ListOwnCars";
import Cookie from "js-cookie";
function OwnCars() {
  const handleUser = () => {
    const userLogined = Cookie.get("userid") != null;
    if (!userLogined) {
      window.location.href = "/auth/login?r=own-cars";
    }
    return;
  };
  useEffect(() => {
    handleUser();
  }, []);
  return (
    <>
      <AddOwnCar />
      <ListOwnCars />
    </>
  );
}

export default OwnCars;
