import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import API from "../api";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = () => {

  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {


const res = await API.get("/events");

      const formattedEvents = res.data
        .filter(event => event.date)
        .map(event => {

          // combine date and time
          const dateTime = event.time
            ? moment(`${event.date} ${event.time}`, "YYYY-MM-DD HH:mm").toDate()
            : moment(event.date).toDate();

          return {
            title: event.title,
            start: dateTime,
            end: moment(dateTime).add(1, "hour").toDate(),
            allDay: false
          };
        });

      setEvents(formattedEvents);

    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  return (
    <div style={{ height: "70vh", margin: "20px" }}>
      <h2 style={{ color: "lightgreen" }}>Event Calendar 📅</h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"

        date={date}
        view={view}

        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView)}

        style={{ height: 500 }}
      />

    </div>
  );
};

export default CalendarView;
