const mongoose = require('mongoose');

module.exports = mongoose.model(
  'ship',
  new mongoose.Schema({
    name: String,
    description: String,
    pirates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pirate',
      },
    ],
  })
);
