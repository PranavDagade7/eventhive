const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));


// Test route
app.get("/", (req, res) => {
  res.send("EventHive API is running...");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 EventHive server running on port ${PORT}`);
});
