const shipModel = require('../models/ship');
const pirateModel = require('../models/pirate');

const put = async (ctx) => {
  const { id } = ctx.params;
  const { name, bio, shipId } = ctx.request.body;
  let updateData = {};
  let result;

  if (name) {
    updateData.name = name;
  }

  if (bio) {
    updateData.bio = bio;
  }

  if (shipId) {
    let ship;

    try {
      ship = await shipModel.findById(shipId);
    } catch (err) {
      ctx.throw(404, err);
    }

    updateData.ship = ship._id;
  }

  try {
    result = await pirateModel.findOneAndUpdate({ _id: id }, updateData).populate('ship');
  } catch (error) {
    ctx.throw(500, error);
  }

  // Get a fresh document from the DB
  const pirate = await pirateModel.findById(result._id).populate('ship');

  ctx.body = pirate;
};

module.exports = { put };
