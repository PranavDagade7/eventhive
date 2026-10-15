
import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [attendees, setAttendees] = useState([]);
  const [, setSelectedEvent] = useState(null);
  const [showAttendees, setShowAttendees] = useState(false);
  const eventsPerPage = 4;

  const role = (localStorage.getItem("role") || "")
    .toLowerCase()
    .trim();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: "",
    date: "",
    time: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createEvent = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        ...form,
        date:
          form.date && form.time
            ? `${form.date}T${form.time}`
            : form.date
      };

      if (form._id) {
        await API.put(`/events/${form._id}`, eventData);
        alert("Event Updated ✅");
      } else {
        await API.post("/events", eventData);
        alert("Event Created ✅");
      }

      setForm({
        title: "",
        description: "",
        location: "",
        price: "",
        image: "",
        date: "",
        time: ""
      });

      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const editEvent = (event) => {
    setForm({
      ...event,
      date: event.date ? event.date.substring(0, 10) : "",
      time: event.date ? event.date.substring(11, 16) : ""
    });

    window.scrollTo(0, 0);
  };

  const deleteEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      alert("Event Deleted 🗑");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const rsvp = async (id) => {
    try {
      await API.post(`/events/${id}/rsvp`);
      alert("RSVP Successful 🎉");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "RSVP Failed");
    }
  };

  // Book tickets using the deployed Render API
  const bookTicket = async (id) => {
    const quantity = prompt("Enter number of tickets:");

    if (
      !quantity ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      alert("Please enter a valid number of tickets");
      return;
    }

    try {
      const res = await API.post(`/tickets/book/${id}`, {
        quantity: Number(quantity)
      });

      alert(res.data.message || "Ticket Booked Successfully 🎟");
      await fetchEvents();
    } catch (err) {
      console.error(
        "Booking error:",
        err.response?.data || err.message
      );

      alert(err.response?.data?.message || "Booking failed ❌");
    }
  };

  // Download ticket using the deployed Render API
  const downloadTicket = async (eventId) => {
    try {
      const response = await API.get(
        `/tickets/download/${eventId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = "ticket.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ticket download failed:", err);

      // Axios may return an error response as a Blob.
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const data = JSON.parse(text);
          alert(data.message || "Failed to download ticket");
          return;
        } catch {
          // Use the fallback message below.
        }
      }

      alert(
        err.response?.data?.message ||
        "Failed to download ticket. Please try again."
      );
    }
  };

  // View attendees using the deployed Render API
  const viewAttendees = async (eventId) => {
    try {
      const res = await API.get(`/tickets/attendees/${eventId}`);

      setAttendees(res.data);
      setSelectedEvent(eventId);
      setShowAttendees(true);
    } catch (err) {
      console.error(
        "Error fetching attendees:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        "Failed to fetch attendees"
      );
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirst,
    indexOfLast
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      {/* CREATE EVENT */}
      {role === "organizer" && (
        <div className="form-container">
          <h2>{form._id ? "Edit Event" : "Create Event"}</h2>

          <form onSubmit={createEvent}>
            <input
              name="title"
              value={form.title}
              placeholder="Event Title"
              onChange={handleChange}
              required
            />

            <input
              name="description"
              value={form.description}
              placeholder="Event Description"
              onChange={handleChange}
              required
            />

            <input
              name="location"
              value={form.location}
              placeholder="Event Location"
              onChange={handleChange}
              required
            />

            <input
              name="price"
              type="number"
              value={form.price}
              placeholder="Ticket Price"
              onChange={handleChange}
              required
            />

            <input
              name="image"
              value={form.image}
              placeholder="Image URL"
              onChange={handleChange}
            />

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="time"
              value={form.time || ""}
              onChange={handleChange}
            />

            <button type="submit">
              {form._id ? "Update Event" : "Create Event"}
            </button>
          </form>
        </div>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: "10px", margin: "20px 0", width: "100%" }}
      />

      <h2 style={{ marginBottom: "20px", color: "lightblue" }}>
        All Events
      </h2>

      {currentEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-grid">
          {currentEvents.map((event) => (
            <div key={event._id} className="event-card">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}

              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <p>
                <strong>Location:</strong> {event.location}
              </p>

              <p>
                <strong>Price:</strong> ₹{event.price}
              </p>

              <p>
                <strong>Date &amp; Time:</strong>{" "}
                {event.date
                  ? new Date(event.date).toLocaleString()
                  : "No Date"}
              </p>

              <p>
                <strong>Total Attendees:</strong>{" "}
                {event.attendeesCount || 0}
              </p>

              {role === "attendee" && (
                <>
                  <button onClick={() => rsvp(event._id)}>
                    RSVP
                  </button>

                  <button
                    onClick={() => bookTicket(event._id)}
                    style={{
                      marginLeft: "10px",
                      background: "orange",
                      color: "#fff"
                    }}
                  >
                    Book Ticket 🎟
                  </button>

                  <button
                    onClick={() => downloadTicket(event._id)}
                    style={{
                      marginTop: "10px",
                      background: "red",
                      color: "#fff"
                    }}
                  >
                    Download Ticket
                  </button>
                </>
              )}

              {role === "organizer" && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => editEvent(event)}>
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEvent(event._id)}
                    style={{
                      marginLeft: "10px",
                      background: "red",
                      color: "#fff"
                    }}
                  >
                    Delete
                  </button>

                  <br />

                  <button
                    onClick={() => viewAttendees(event._id)}
                    style={{
                      marginTop: "10px",
                      background: "green",
                      color: "#fff"
                    }}
                  >
                    View Attendees 👥
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ATTENDEE LIST MODAL */}
      {showAttendees && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "10px"
          }}
        >
          <h3>Attendee List</h3>

          {attendees.length === 0 ? (
            <p>No attendees for this event</p>
          ) : (
            Object.values(
              attendees.reduce((acc, ticket) => {
                const key = ticket.email;

                if (!acc[key]) {
                  acc[key] = {
                    name: ticket.name,
                    email: ticket.email,
                    count: 0
                  };
                }

                acc[key].count += ticket.ticketCount;

                return acc;
              }, {})
            ).map((person, index) => (
              <p key={index}>
                👤 {person.name} ({person.count} tickets)
              </p>
            ))
          )}

          <button
            onClick={() => {
              setShowAttendees(false);
              setAttendees([]);
              setSelectedEvent(null);
            }}
            style={{
              background: "red",
              color: "white",
              padding: "8px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        {Array.from(
          {
            length: Math.ceil(
              filteredEvents.length / eventsPerPage
            )
          },
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "5px",
                padding: "5px 10px",
                background:
                  i + 1 === currentPage ? "#333" : "#eee",
                color: i + 1 === currentPage ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;
