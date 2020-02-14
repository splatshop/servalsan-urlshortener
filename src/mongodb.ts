import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export function getMainCollection() {
	return client.db(process.env.MONGODB_DB)
		.collection('urls');
}

export default client;
