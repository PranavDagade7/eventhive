🎟️ EventHive – Event Management & Ticket Booking System

A full-stack event management and ticket booking platform built with **React, Node.js, Express, and MongoDB** where organizers can create events and attendees can book tickets and download QR-based event passes.

---

## Features

• User registration & login (JWT authentication)
• Role-based system (**Organizer / Attendee**)
• Organizers can **create, edit, and delete events**
• Attendees can **RSVP and book tickets**
• Ticket booking with **multiple quantity support**
• **QR Code based ticket generation**
• **Downloadable PDF ticket** with event details
• Organizer can **view event attendees**
• Event **search and pagination**
• Event cards with **image, location, date & price**

---

## Tech Stack

React | Node.js | Express | MongoDB | JWT | Axios | PDFKit | QRCode | CSS

---

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## API Endpoints

| Method | Route                           | Description                |
| ------ | ------------------------------- | -------------------------- |
| POST   | /api/auth/register              | Register user              |
| POST   | /api/auth/login                 | Login user                 |
| GET    | /api/events                     | Get all events             |
| POST   | /api/events                     | Create event (Organizer)   |
| PUT    | /api/events/:id                 | Update event               |
| DELETE | /api/events/:id                 | Delete event               |
| POST   | /api/events/:id/rsvp            | RSVP to event              |
| POST   | /api/tickets/book/:eventId      | Book event tickets         |
| GET    | /api/tickets/attendees/:eventId | View attendees (Organizer) |
| GET    | /api/tickets/download/:eventId  | Download ticket PDF        |

---

## Ticket PDF Includes

• Event name
• Event location
• Date & time
• User name & email
• Number of tickets booked
• QR code for event entry

---

## Project Structure

```
eventhive
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   ├── api.js
│   └── App.js
```

---

## Author

**Pranav Dagade**

---

## Future Improvements

• Online payment integration
• Email ticket confirmation
• Event categories & filters
• Mobile responsive UI
• Admin analytics dashboard
