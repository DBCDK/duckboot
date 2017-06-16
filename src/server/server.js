/**
 * @file
 * Configure and start the server
 */

// Libraries
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
import request from 'superagent';
import BodyParser from 'koa-body';
import config from '../config';
import services from '../../services.json';
import {search, getImage} from './search';
import serve from 'koa-better-serve';
import path from 'path';
import fs from 'fs';


const app = new Koa();
const router = new Router();
const bodyparser = new BodyParser();

function getService(name) {
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

router.post('/image', bodyparser, async (ctx) => {
  try {
    const response = await getImage(ctx.request.body.pids);
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

router.get('/', bodyparser, async (ctx) => {
  ctx.body = fs.readFileSync(path.join(__dirname, '../../', '/deploy/index.html')).toString()
  ctx.status = 200;
});
app.use(cors({origin: false}));
app.use(router.routes());
app.use(serve('./deploy', '/'));


app.on('error', (err) => {
  console.error('Server error', {error: err.message, stack: err.stack});
});

app.listen(config.PORT, () => {
  console.info(`Server is up and running on port ${config.PORT}!`);
});

