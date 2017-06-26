/**
 * @file
 * Configure and start the server
 */

// Libraries
import Router from 'koa-router';
import BodyParser from 'koa-body';
import {search, getImage} from '../clients/openplatform.client';
import services from '../../../services.json';
import path from 'path';
import fs from 'fs';

const router = new Router();
const bodyparser = new BodyParser();

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
  const response = await callRecommender(ctx.params.service, ctx.query, ctx.request.body);
  ctx.status = response.status;
  ctx.body = response.body || null;
});

router.get('/', bodyparser, async (ctx) => {
  ctx.body = fs.readFileSync(path.join(__dirname, '../../', '/build/index.html')).toString();
  ctx.status = 200;
});


export default router;