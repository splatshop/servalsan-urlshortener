const dbMixin = require('../mixins/db.mixin');
const {Errors} = require('moleculer');
const generateZWS = require('../util/generate-zws');

const {MoleculerClientError} = Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/**
 * @typedef {import('mongodb').Collection} Collection MongoDB collection
 */

module.exports = {
	name: 'urls',

	/**
	 * Mixins
	 */
	mixins: [dbMixin('urls')],

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		list: false,
		find: false,
		update: false,
		remove: false,
		insert: false,
		get: false,
		create: false,

		/**
		 * Shorten a long URL
		 *
		 * @param {string} url Long URL to be shortened
		 * @returns The new short ID
		 */
		shorten: {
			rest: {
				method: 'POST',
				path: '/'
			},
			params: {
				url: {type: 'url'}
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				ctx.meta.$statusCode = 201;
				let zws = '';

				/** @type {Collection} */
				const {collection} = this.adapter;

				// This generates random URLs until it finds one that is unique
				// In the future this should use the cache, but manually doing that is a pain
				// Using the built-in DB mixin will query extra data we don't need and can add latency
				while (zws === '') {
					const generated = generateZWS();
					// eslint-disable-next-line no-await-in-loop
					const unique = !(await collection.find({zws: generated}).count());

					if (unique) {
						zws = generated;
						break;
					}
				}

				const buf = Buffer.from(zws);

				await this.adapter.insert({
					zws: buf.toString('base64'),
					url: ctx.params.url
				});

				return {zws: buf.toString()};
			}
		},

		/**
		 * Visit a shortened URL.
		 *
		 * @param {String} zws Short ID for the string (this is ZWS chars)
		 */
		visit: {
			rest: {method: 'GET', path: '/:zws'},
			params: {
				zws: 'string'
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const zws = Buffer.from(ctx.params.zws).toString('base64');

				const doc = await this.adapter.findOne({zws});

				if (doc) {
					ctx.meta.$statusCode = 302;
					ctx.meta.$location = doc.url;

					// Raw MongoDB operations
					/** @type {Collection} */
					const {collection} = this.adapter;

					console.log(this.adapter);

					// Record the current timestamp
					collection.updateOne({zws}, {$push: {visits: Date.now()}});
				} else {
					throw new MoleculerClientError('No such shortened URL', 404);
				}
			}
		},
		/**
		 * Get stats for a short ID.
		 *
		 * @param {String} zws Short ID for the string (this is ZWS chars)
		 */
		stats: {
			rest: {method: 'GET', path: '/:zws/stats'},
			params: {
				zws: 'string'
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const zws = Buffer.from(ctx.params.zws).toString('base64');

				const doc = await this.adapter.findOne({zws});

				if (doc) {
					return {visits: doc.visits};
				}

				throw new MoleculerClientError('No such shortened URL', 404);
			}
		}
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {}
};
