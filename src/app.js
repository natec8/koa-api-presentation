const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = new Koa();

mongoose.connect('mongodb://dev.thememories.com:27017/demo', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.connection.on('error', console.error);

// Error handler, should be set very first so that it is run very last after all middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    ctx.app.emit('error', err, ctx);
  }
});

// Application error handler, can write to a file, to a DB, etc.
app.on('error', (err, ctx) => {
  if (ctx.status >= 400) {
    console.error(err);
  }
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${time}`);
});

app.use(logger());
app.use(bodyParser());
app.use(routes());

module.exports = app;
