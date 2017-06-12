/**
 * @file
 * Configure and start the server
 */

// Libraries
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const request = require('superagent');
const BodyParser = require('koa-body');
const config = require('../config').default;

const services = require('../../services.json');
const search = require('./search').search;

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

router.post('/search', bodyparser, async (ctx) => {
  try {
    const response = await search(ctx.request.body);
    ctx.body = response.data;
    ctx.status = response.statusCode;
  }
  catch (e) {
    console.error(e);
  }
});

router.post('/:service', bodyparser, async (ctx) => {
  const service = getService(ctx.params.service);
  if (service) {
    try {
      const response = await promiseRequest({
        method: service.method,
        url: service.url,
        query: ctx.query,
        body: ctx.request.body
      });
      ctx.body = response.body;
      ctx.status = response.status;
    }
    catch (e) {
      console.error(e);
    }
  }
  else {
    ctx.status = 404;
  }
});

app.use(cors({origin: false}));
app.use(router.routes());

app.on('error', (err) => {
  console.error('Server error', {error: err.message, stack: err.stack});
});

app.listen(PORT, () => {
  console.info(`Server is up and running on port ${PORT}!`);
});

