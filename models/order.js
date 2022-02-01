const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const order = new Schema(
  {
  lastUpdateId: {
    type: Number,
    required: true
  }, 
  bids: {
    type: Array,
    required: [true, 'Bids is required'],
  },
  asks: {
    type: Array,
    required: [true, 'Asks is required'],
  },
 
},
  { versionKey: false, timestamps: true }
);

const Order = mongoose.model("order", order);

module.exports = Order;