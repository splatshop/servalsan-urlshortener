declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production';

		readonly PORT: number
		readonly MONGODB_URI: string;
		readonly MONGODB_DB: string;
		readonly MONGODB_COLLECTION: string;
	}
}