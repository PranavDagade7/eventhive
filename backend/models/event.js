const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  location: String,
  price: Number,
  image:String,
  date:String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  attendees: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);