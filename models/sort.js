const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sort = new Schema(
    {
  unix: {
    type: Number,
    required: true
  }, 
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  symbol: {
    type: String,
    required: true
  },
  open: {
    type: Number,
    required: true
        },
  high: {
    type: Number,
    required: true
        },
   low: {
    type: Number,
    required: true
        },
   close: {
    type: Number,
    required: true
        },
   'Volume BTC': {
    type: Number,
    required: true
        },
   'Volume USDT': {
    type: Number,
    required: true
        },
   tradecount: {
    type: Number,
    required: true
        },
},
  { versionKey: false, timestamps: true }
);

const Sort = mongoose.model("sort", sort);

module.exports = Sort;