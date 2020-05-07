const combineRouters = require('koa-combine-routers');

const defaultRouter = require('./default');
const piratesRouter = require('./pirates');
const shipsRouter = require('./ships');

module.exports = combineRouters(defaultRouter, piratesRouter, shipsRouter);
