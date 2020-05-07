const Router = require('@koa/router');
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'Yar! Welcome to my Koa.js Application';
});

module.exports = router;
