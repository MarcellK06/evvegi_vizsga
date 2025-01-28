import React, { useContext, useEffect, useRef, useState } from "react";
import AuthCheck from "../Components/Authentication/AuthCheck";
import { NavigatorContext } from "../Providers/NavigatorProvider";
import CONFIG from "../config.json";
import $ from "jquery";
import { ModalContext } from "../Providers/ModalProvider";
import Cookie from "js-cookie";
function Appointment() {
  const { _Navigator } = useContext(NavigatorContext);
  const { CreateModal } = useContext(ModalContext);
  const API = CONFIG.API;
  useEffect(() => {
    _Navigator.footerFix();
  }, []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [times, setTimes] = useState({});
  const [ownCars, setOwnCars] = useState([]);

  class TimeClass {
    constructor(id, date, time, taken) {
      this.id = id;
      this.date = date;
      this.time = time;
      this.taken = taken;
    }
  }

  const FormatDate = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if (month < 10)
      month = `0${month}`
    if (day < 10)
      day = `0${day}`
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const getWeekDates = () => {
    const vweekDates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    for (let i = 0; i < 5; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      vweekDates.push(FormatDate(day));
    }
    return vweekDates;
  };
  const [weekDates, setWeekDates] = useState(getWeekDates());
  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
    setWeekDates(getWeekDates());
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
    setWeekDates(getWeekDates());
  };
  class OwnCar {
    constructor(id, data, vin, images, status) {
      this.id = id;
      this.data = data;
      this.vin = vin;
      this.images = images;
      this.status = status;
    }
  }

  const LoadOwnCars = () => {
    var userid = Cookie.get("userid");
    $.ajax({
      url: `${API}/car/load/all/${userid}`,
      success: function (resp) {
        var c = [];
        resp.forEach((el) => {
          var car = JSON.parse(el.data);
          c.push(new OwnCar(el.id, car, el.vin, el.images, el.status));
        });
        setOwnCars(c);
      },
    });
  };

  const ownCarEntry = (i) => {
    var vin = i.vin;
    var carid = i.id;
    return (
      <>
        <option value={carid}>{vin}</option>
      </>
    );
  };

  useEffect(() => {
    LoadOwnCars();
  }, []);

  const complaintRef = useRef();
  const problemReplicationRef = useRef();
  const ownCarRef = useRef();

  const MakeAppointment = (i, date) => {
    var userid = Cookie.get("userid");
    var complaint = complaintRef.current.value;
    var stepstorep = problemReplicationRef.current.value;
    var carid = ownCarRef.current.value;
    var date = FormatDate(date);
    var timeid = i.id;
    $.ajax({
      url: `${API}/appointments/create`,
      type: "post",
      data: {
        userid: userid,
        carid: carid,
        complaint: complaint,
        stepstorep: stepstorep,
        date: date,
        timeid: timeid,
      },
      success: function (resp) {
        window.location.reload();
      },
    });
  };

  const AppointmentModal = (i, date) => {
    return (
      <>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <div className="row my-2">
              <label htmlFor="complaint">Panasz</label>
              <input
                type="text"
                name="complaint"
                id="complaint"
                className="form-control"
                ref={complaintRef}
              />
            </div>
            <div className="row my-2">
              <label htmlFor="stepstorep">
                A probléma replikálásának lépései
              </label>
              <input
                type="text"
                name="stepstorep"
                id="stepstorep"
                className="form-control"
                ref={problemReplicationRef}
              />
            </div>
            <div className="row my-2">
              <label htmlFor="owncar">
                Jármű választása, alvázszám szerint
              </label>
              <select
                name="owncar"
                id="owncar"
                className="form-control"
                ref={ownCarRef}
              >
                {ownCars.map((i) => ownCarEntry(i))}
              </select>
            </div>
            <div className="row">
              <input
                type="button"
                value="Foglalás"
                className="form-control my-2 hoverbutton"
                onClick={() => MakeAppointment(i, date)}
              />
            </div>
          </div>
          <div className="col-sm-2"></div>
        </div>
      </>
    );
  };

  const ShowAppointmentModal = (i, date) => {
    CreateModal(
      <p className="fs-3">Időpont foglalás</p>,
      AppointmentModal(i, date),
      true
    );
  };

  const TimeEntry = (i, date) => {
    var time = i.time;
    var foglalt = i.taken == 1;
    var c = foglalt ? "ido foglalt" : `ido`;
    return (
      <div
        className={`${c} pointer`}
        onClick={foglalt ? null : () => ShowAppointmentModal(i, date)}
      >
        {time.substr(0, 5)}
      </div>
    );
  };
  const getTimes = () => {
    weekDates.forEach((dateObj) => {
      const formattedDate = dateObj;
  
      $.ajax({
        url: `${API}/appointments/get`,
        type: "post",
        data: { date: formattedDate },
        success: (resp) => {
          const timesList = resp[0].map((t) => {
            const isTaken = resp[1].some((j) => j.timeid === t.id);
            return new TimeClass(t.id, t.date, t.time, isTaken ? 1 : 0);
          });
  
          // Use functional state update for immutability
          setTimes((prev) => ({
            ...prev,
            [formattedDate]: timesList,
          }));
        },
      });
    });
  };
  const WeekDay = (date) => {
    const formattedDate = `${date}`;

  
    const timesForDay = times[formattedDate] || []; // Default to empty array if no data
  
    return (
      <div className="col-2 mx-auto">
        <div className="fs-4 text-center">{date}</div>
        <div className="mt-3">
          {timesForDay.length > 0 ? (
            timesForDay.map((time) => TimeEntry(time, date))
          ) : (
            <div>No appointments available</div>
          )}
        </div>
      </div>
    );
  };
  
  

  useEffect(() => {
    getTimes();
  }, [weekDates]);

  return (
    <>
      <AuthCheck />
      <div className="container mt-3">
        <h3 className="text-center mb-5">Időpont foglalás</h3>
        <div className="appointment">
          <div className="row">
            <div
              className="col-1 mx-auto arrow"
              onClick={() => handlePreviousWeek()}
            >
              <div>{"<"}</div>
            </div>
            {weekDates.map((date, index) => WeekDay(date, index))}
            <div className="col-1 mx-auto arrow" onClick={() => handleNextWeek()}>
              <div>{">"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointment;
