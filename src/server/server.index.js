/**
 * @file
 * Configure and start the server
 */

// Libraries
const Koa = require('koa');
const Router = require('koa-router');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const request = require('superagent');
const BodyParser = require('koa-body');


const services = require('../../services.json');


const app = new Koa();
const router = new Router();
const bodyparser = new BodyParser();


const PORT = 3001;

function getService(name) {
  console.log(name);
  const result = services.filter(service => service.name === name);
  if (result.length) {
    return result[0];
  }

  return null;
}

function promiseRequest({method, url, query = {}, body = {}}) {
  return new Promise((resolve, reject) => {
    request[method](url)
      .query(query)
      .send(body)
      .end((err, response) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(response);
        }
      });
  });
}


router.post('/:service', bodyparser, async((ctx) => {
  console.log('øheo');
  const service = getService(ctx.params.service);
  console.log(ctx.request.body, "body");
  if (service) {
    const response = await(promiseRequest({method: service.method, url: service.url, query: ctx.query, body: ctx.request.body}));
    ctx.body = response.body;
    ctx.status = response.status;
  }
  ctx.status = 402;
}));

app.use(router.routes());
app.on('error', (err) => {
  console.error('Server error', {error: err.message, stack: err.stack});
});

app.listen(PORT, () => {
  console.info(`Server is up and running on port ${PORT}!`);
});

