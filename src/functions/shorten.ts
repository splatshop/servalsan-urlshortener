import { Context } from 'koa';
import ApiError from '../errors/api-error';
import { getMainCollection } from '../mongodb';

function validateURL(string : string) {
	try {
		const url = new URL(string);

		return ['ftp:', 'https:', 'http:'].includes(url.protocol);
	} catch (e) {
		return false;
	}
}

export default async (ctx : Context) => {
	if (!validateURL(ctx.request.body.url))
		throw new ApiError(400, 'Invalid URL');

	// lets assume this is zws
	const zws = 'lal';

	const entry = {
		url: ctx.request.body.url,
		zws: Buffer.from(zws).toString('base64'),
		visits: [],
	};

	await getMainCollection()
		.insertOne(entry);

	ctx.body = entry;
};
