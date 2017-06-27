/**
 * @file
 * Configure and start the server
 */

// Libraries
import Koa from 'koa';
import cors from 'koa2-cors';
import config from '../config';
import serve from 'koa-better-serve';
import router from './router/router';
const app = new Koa();

app.use(cors({origin: false}));
app.use(router.routes());
app.use(serve('./build', '/'));


app.on('error', (err) => {
  console.error('Server error', {error: err.message, stack: err.stack});
});

app.listen(config.PORT, () => {
  console.info(`Server is up and running on port ${config.PORT}!`);
});

