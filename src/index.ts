import Koa from 'koa';
import koaBody from 'koa-body';
import koaCompress from 'koa-compress';
import Router from 'koa-router';

import mongodb from './mongodb';
import ApiError from './errors/api-error';

import notFound from './functions/not-found';
import shorten from './functions/shorten';

const app = new Koa();

const router = new Router();

router.post('/shorten', shorten);
router.get('/*', notFound);

app
	.use(async (ctx, next) => {
		try {
			await next();
		} catch(e) {
			if (e instanceof ApiError) {
				ctx.status = e.status;
				ctx.body = {
					error: e.error,
				};
			} else if (ctx.status === 404) {
				ctx.body = {
					error: 'Not found',
				};
			} else {
				ctx.status = 500;
				ctx.body = {
					error: 'Internal error',
				};

				ctx.app.emit('error', e);
			}
		}
	})
	.use(koaCompress({
		threshold: 2048,
		flush: require('zlib').Z_SYNC_FLUSH
	}))
	.use(koaBody({
		multipart: true,
	}))
	.use(router.routes())
	.use(router.allowedMethods());

app.on('error', err => {
	console.error(err.stack);
});

mongodb.connect(err => {
	if (err) {
		console.error('Cannot connect to MongoDB database');
		console.error(err);
		process.exit(1);
	} else {
		app.listen(process.env.PORT);
		console.log(`Listening 👂 on port ${process.env.PORT}`);
	}
});
