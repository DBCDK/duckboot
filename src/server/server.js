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
import {search, getImage} from './clients/search';
import serve from 'koa-better-serve';
import path from 'path';
import fs from 'fs';


const app = new Koa();
const router = new Router();
const bodyparser = new BodyParser();

function getService(name) {
  const result = services.filter(service => service.proxy === name);
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
    const response = await search(ctx.request.body.query, ctx.request.body.profile);
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

router.get('/buttons', async (ctx) => {
  try {
    const response = services.map(service => {
      return {
        name: service.name,
        url: service.proxy
      };
    });
    ctx.body = response;
    ctx.status = 200;
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
        method: service.method || 'post',
        url: service.url,
        query: ctx.query,
        body: ctx.request.body
      });
      ctx.body = response.body;
      ctx.status = response.status;
    }
    catch (e) {
      ctx.status = 500;
      ctx.body = e.body;
    }
  }
  else {
    ctx.status = 404;
  }
});

router.get('/', bodyparser, async (ctx) => {
  ctx.body = fs.readFileSync(path.join(__dirname, '../../', '/build/index.html')).toString()
  ctx.status = 200;
});
app.use(cors({origin: false}));
app.use(router.routes());
app.use(serve('./build', '/'));


app.on('error', (err) => {
  console.error('Server error', {error: err.message, stack: err.stack});
});

app.listen(config.PORT, () => {
  console.info(`Server is up and running on port ${config.PORT}!`);
});

