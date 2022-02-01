const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const norder = new Schema(
  {
  bids: {
    type: Array,
    required: [true, 'Bids is required'],
  },
  asks: {
    type: Array,
    required: [true, 'Asks is required'],
  },
 
},
  { versionKey: false, timestamps: false }
);

const Norder = mongoose.model("norder", norder);

module.exports = Norder;