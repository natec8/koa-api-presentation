const mongoose = require('mongoose');

module.exports = mongoose.model(
  'pirate',
  new mongoose.Schema({
    name: String,
    bio: String,
    ship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ship',
    },
  })
);
