import React, { useContext, useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/hu";
import "react-big-calendar/lib/css/react-big-calendar.css";
import $ from "jquery";
import API from "../../config.json";
import Cookies from "js-cookie";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { ModalContext } from "../../Providers/ModalProvider";
import { useNavigate } from "react-router-dom";
function AppointmentsAdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const localizer = momentLocalizer(moment);
  const { CreateModal } = useContext(ModalContext);
  const navi = useNavigate();
  const CheckUser = () => {
    var rankid = Cookies.get("rank");
    if (rankid != 1) {
      navi("/");
    }
  };

  const AddEvent = (title, start, data) => {
    return {
      title: title,
      start: start,
      end: new Date(start).setHours(start.getHours() + 1),
      bgcolor: Color[data.status.toLowerCase()].split("-")[0],
      bordercolor: Color[data.status.toLowerCase()].split("-")[1],
      data: data,
    };
  };

  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: event.bgcolor,
        border: "none",
        borderLeft: `5px solid ${event.bordercolor}`,
      },
    };
  };

  const formats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
        end,
        "HH:mm",
        culture
      )}`,
  };

  const messages = {
    next: <MdOutlineKeyboardArrowRight size={25} className="arrows" />,
    previous: <MdOutlineKeyboardArrowLeft size={25} className="arrows" />,
    today: <span className="today">Ma</span>,
    month: "Hónap",
    week: "Hét",
    day: "Nap",
    agenda: "Napló",
    date: "Dátum",
    time: "Idő",
    event: "Esemény",
    sun: "Vas",
    mon: "Hét",
    tue: "Ked",
    wed: "Sze",
    thu: "Csü",
    fri: "Pén",
    sat: "Szo",
    jan: "Jan",
    feb: "Feb",
    mar: "Márc",
    apr: "Ápr",
    may: "Máj",
    jun: "Jún",
    jul: "Júl",
    aug: "Aug",
    sep: "Szept",
    oct: "Okt",
    nov: "Nov",
    dec: "Dec",
  };

  const CustomToolbar = ({ label, onNavigate }) => {
    return (
      <div className="rbc-toolbar">
        <button onClick={() => onNavigate("PREV")} aria-label="Előző hónap">
          <MdOutlineKeyboardArrowLeft size={25} className="arrows" />
        </button>
        <button onClick={() => onNavigate("NEXT")} aria-label="Következő hónap">
          <MdOutlineKeyboardArrowRight size={25} className="arrows" />
        </button>
        <span className="rbc-toolbar-label">{label}</span>
        <button className="create" onClick={() => AddEvent()}>
          + Létrehozás
        </button>
      </div>
    );
  };

  useEffect(() => {
    CheckUser();
    $.ajax({
      url: `${API.API}/appointments/get-all`,
      success: function (response) {
        const newAppointments = response.map((i) =>
          AddEvent(i.name, new Date(i.date + "T" + i.time), i)
        );
        setAppointments(newAppointments);
      },
    });
  }, []);

  const ChangeStatus = (newS) => {
    $.ajax({
      url: `${API.API}/appointments/set-car-state/${selected.current}`,
      type: "post",
      data: {
        status: newS,
      },
      success: function () {},
    });
  };

  const Color = {
    ok: "#64b500-#8cff00",
    "szerelés alatt": "red-pink",
    "szerelésre vár": "#fcb103-#d1ab00",
    "átvételre vár": "#03d3fc-#038cfc",
  };

  const selected = useRef();

  const View = (data) => {
    var car_data = JSON.parse(data.data);
    console.log(car_data);
    return (
      <>
        <div className="">
          <p className="fw-bold">Státusz: </p>
          <select
            onChange={(e) => ChangeStatus(e.target.value)}
            className="form-control"
          >
            <option value="Ok" selected={data.status == "Ok"}>
              Ok
            </option>
            <option
              value="Szerelés Alatt"
              selected={data.status == "Szerelés Alatt"}
            >
              Szerelés Alatt
            </option>
            <option
              value="Szerelésre vár"
              selected={data.status == "Szerelésre vár"}
            >
              Szerelésre vár
            </option>
            <option
              value="Átvételre vár"
              selected={data.status == "Átvételre vár"}
            >
              Átvételre vár
            </option>
          </select>
          <div className="mt-3">
            <div>
              <p className="fs-4 fw-bold my-0">Kapcsolattartási adatok</p>
              <div className="d-flex flex-column">
                <p className="fw-bold my-0 mt-2">Telefonszám</p>
                <p>{data.phone}</p>
              </div>
              <div className="d-flex flex-column">
                <p className="fw-bold my-0 mt-2">Email cím</p>
                <p>{data.email}</p>
              </div>
            </div>
            <p className="fs-4 fw-bold my-0">Probléma</p>
            <p>{data.complaint}</p>
            <p className="fs-4 fw-bold my-0">Probléma reprodukálása</p>
            <p>{data.stepstorep}</p>
          </div>
        </div>
        <p className="fs-4 fw-bold my-0">Autó adatai</p>
        <div className="d-flex">
          <div className="d-flex flex-column mx-3 justify-content-center text-center">
            <p className="fw-bold my-0 mt-2">Márka</p>
            <p>{car_data.brand}</p>
          </div>
          <div className="d-flex flex-column mx-3 justify-content-center text-center">
            <p className="fw-bold my-0 mt-2">Modell</p>
            <p>{car_data.model}</p>
          </div>{" "}
          <div className="d-flex flex-column mx-3 justify-content-center text-center">
            <p className="fw-bold my-0 mt-2">Motorkód</p>
            <p>{car_data.engineCode}</p>
          </div>{" "}
          <div className="d-flex flex-column mx-3 justify-content-center text-center">
            <p className="fw-bold my-0 mt-2">Alvázszám</p>
            <p>{data.vin}</p>
          </div>{" "}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="h-100 mt-3 mx-2">
        <Calendar
          localizer={localizer}
          events={appointments}
          timeslots={1}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["week"]}
          step={60}
          selectable
          defaultDate={new Date()}
          style={{ height: "90%" }}
          eventPropGetter={eventPropGetter}
          formats={formats}
          messages={messages}
          onSelectEvent={(event) => {
            var data = event.data;
            CreateModal(
              <>
                <p className="my-0">{data.name} időpontja</p>
                <hr />
              </>,
              View(data),
              true
            );
            selected.current = data.car_id;
          }}
          components={{
            toolbar: (props) => <CustomToolbar {...props} />, // Egyéni toolbar
          }}
        />
      </div>
    </>
  );
}

export default AppointmentsAdminPanel;
