const Router = require('@koa/router');
const shipModel = require('../models/ship');
const pirateModel = require('../models/pirate');
const router = new Router();

router.prefix('/ships');

router.get('/', async (ctx) => {
  const ships = await shipModel.find().populate('pirates');

  ctx.body = ships;
});

router.get('/:id', async (ctx) => {
  const { id } = ctx.params;

  let ship = await shipModel.findById(id).populate('pirates');

  if (!ship) {
    ctx.throw(404, `ship with ID ${id} not found.`);
  }

  ctx.body = ship;
});

router.post('/', async (ctx) => {
  const { name, description } = ctx.request.body;

  if (!name) {
    ctx.throw(400, 'name is required.');
  }

  if (!description) {
    ctx.throw(400, 'description is required.');
  }

  const ship = new shipModel({ name, description });

  const result = await ship.save();

  ctx.body = result;
});

router.put('/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, description, pirateIds } = ctx.request.body;
  let updateData = {};
  let result;

  if (name) {
    updateData.name = name;
  }

  if (description) {
    updateData.description = description;
  }

  if (pirateIds) {
    if (!Array.isArray(pirateIds)) {
      ctx.throw(400, 'pirateIds must be an array');
    }
    updateData.pirates = [];

    for (let i = 0; i < pirateIds.length; i++) {
      let pirate;
      try {
        pirate = await pirateModel.findById(pirateIds[i]);
      } catch (err) {
        ctx.throw(500, err);
      }

      updateData.pirates.push(pirate._id);
    }
  }

  try {
    result = await shipModel.findOneAndUpdate({ _id: id }, updateData).populate('pirates');
  } catch (error) {
    ctx.throw(404, error);
  }

  // Get a fresh document from the DB
  const ship = await shipModel.findById(result._id).populate('pirates');

  ctx.body = ship;
});

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;

  const result = await shipModel.findOneAndDelete({ _id: id });

  ctx.body = result;
});

module.exports = router;
