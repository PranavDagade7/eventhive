const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const auth = require("../middleware/authMiddleware");

// CREATE EVENT (Organizer Only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can create events" });
    }

    const event = await Event.create({
      ...req.body,
      organizer: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL EVENTS
const Ticket = require("../models/Ticket");

// GET ALL EVENTS
router.get("/", async (req, res) => {
  try {

    const events = await Event.find();

    const Ticket = require("../models/Ticket");

    const eventsWithAttendees = await Promise.all(
      events.map(async (event) => {

        const tickets = await Ticket.find({ eventId: event._id });

        const totalTickets = tickets.reduce(
          (sum, ticket) => sum + (ticket.ticketCount || 1),
          0
        );

        return {
          ...event._doc,
          attendeesCount: totalTickets
        };

      })
    );

    res.json(eventsWithAttendees);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching events" });
  }
});
// Update Event
router.put("/:id", async (req, res) => {
  
    try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        date: req.body.date   // ✅ VERY IMPORTANT
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event: updatedEvent
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE EVENT
router.delete("/:id", auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Book Ticket
router.post("/:id/book", async (req, res) => {
  try {
    const { quantity } = req.body;

    // Here you can update event tickets or create booking record

    res.json({
      message: `Successfully booked ${quantity} ticket(s)`
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// RSVP TO EVENT
router.post("/:id/rsvp", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if already RSVP
    const alreadyJoined = event.attendees.some(
      (attendee) => attendee.user.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already RSVP'd" });
    }

    event.attendees.push({ user: req.user.id });
    await event.save();

    res.json({ message: "RSVP successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;