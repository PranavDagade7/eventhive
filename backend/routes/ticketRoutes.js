
const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");
const authMiddleware = require("../middleware/authMiddleware");

const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const Event = require("../models/event");
router.post("/book/:eventId", authMiddleware, async (req, res) => {
  try {

    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid ticket quantity" });
    }

    const ticket = new Ticket({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      eventId: req.params.eventId,
      ticketCount: quantity
    });

    await ticket.save();

    res.json({
      message: `${quantity} ticket(s) booked successfully`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Booking failed" });
  }
});
router.get("/download/:eventId", authMiddleware, async (req, res) => {
  try {

    const tickets = await Ticket.find({
      eventId: req.params.eventId,
      user: req.user._id
    });

    const event = await Event.findById(req.params.eventId);

    if (!tickets.length) {
      return res.status(404).json({ message: "No tickets found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=event-ticket.pdf"
    );

    doc.pipe(res);

    for (let ticket of tickets) {

      const qrData = `
      Event: ${event.title}
      Name: ${ticket.name}
      Email: ${ticket.email}
      Ticket ID: ${ticket._id}
      `;

      const qrImage = await QRCode.toDataURL(qrData);
      const base64 = qrImage.replace(/^data:image\/png;base64,/, "");
      const qrBuffer = Buffer.from(base64, "base64");

      doc.fontSize(24).text("EVENT TICKET", { align: "center" });

      doc.moveDown();

      // EVENT IMAGE
      if (event.image) {
        const imageBuffer = await fetch(event.image)
          .then(res => res.arrayBuffer());

        doc.image(Buffer.from(imageBuffer), {
          fit: [400, 200],
          align: "center"
        });

        doc.moveDown();
      }

      doc.fontSize(16).text(`Event: ${event.title}`);
      doc.text(`Location: ${event.location}`);
      doc.text(`Date: ${new Date(event.date).toLocaleString()}`);

      doc.moveDown();

      doc.text(`Name: ${ticket.name}`);
      doc.text(`Email: ${ticket.email}`);
      doc.text(`Tickets Booked: ${ticket.ticketCount}`);

      doc.moveDown();

      doc.image(qrBuffer, {
        fit: [130, 130],
        align: "center"
      });

      doc.moveDown();
      doc.fontSize(12).text("Show this QR at event entry", { align: "center" });

      doc.addPage();
    }

    doc.end();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating ticket" });
  }
});
router.get("/attendees/:eventId", async (req, res) => {
  try {

    const attendees = await Ticket.find({
      eventId: req.params.eventId
    });

    res.json(attendees);

  } catch (error) {
    res.status(500).json({ message: "Error fetching attendees" });
  }
});

module.exports = router;