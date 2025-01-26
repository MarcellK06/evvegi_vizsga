import React, { useContext, useEffect, useState } from "react";
import AuthCheck from "../Components/Authentication/AuthCheck";
import { NavigatorContext } from "../Providers/NavigatorProvider";
function Appointment() {
  const { _Navigator } = useContext(NavigatorContext);
  useEffect(() => {
    _Navigator.footerFix();
  }, []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const formatDate = (date) => {
    return date.toLocaleDateString("hu-HU", {
      month: "short",
      day: "numeric",
    });
  };

  const getWeekDates = () => {
    const weekDates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    for (let i = 0; i < 5; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDates.push(day);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  return (
    <>
      <AuthCheck />
      <div className="container mt-3">
        <h3 className="text-center mb-5">Időpont foglalás</h3>
        <div className="appointment">
          <div className="row">
            <div className="col-1 mx-auto arrow" onClick={handlePreviousWeek}>
              <div>{"<"}</div>
            </div>
            {weekDates.map((date, index) => (
              <div className="col-2 mx-auto" key={index}>
                <div>
                  {date.toLocaleDateString("hu-HU", { weekday: "long" })}
                </div>
                <div>{formatDate(date)}</div>
                <div className="mt-3">
                  <div className="ido foglalt">12:00</div>
                  <div className="ido">14:00</div>
                </div>
              </div>
            ))}
            <div className="col-1 mx-auto arrow" onClick={handleNextWeek}>
              <div>{">"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointment;
