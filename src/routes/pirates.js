const Router = require('@koa/router');
const pirateModel = require('../models/pirate');
const { put } = require('../controllers/pirates');
const router = new Router();

router.prefix('/pirates');

router.get('/', async (ctx) => {
  const pirates = await pirateModel.find().populate('ship');

  ctx.body = pirates;
});

router.get('/:id', async (ctx) => {
  const { id } = ctx.params;

  let pirate = await pirateModel.findById(id).populate('ship');

  if (!pirate) {
    ctx.throw(404, `Pirate with ID ${id} not found.`);
  }

  ctx.body = pirate;
});

router.post('/', async (ctx) => {
  const { name, bio } = ctx.request.body;

  if (!name) {
    ctx.throw(400, 'name is required.');
  }

  if (!bio) {
    ctx.throw(400, 'bio is required.');
  }

  const pirate = new pirateModel({ name, bio });

  const result = await pirate.save();

  ctx.body = result;
});

router.put('/:id', put);

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;

  const result = await pirateModel.findOneAndDelete({ _id: id });

  ctx.body = result;
});

module.exports = router;
