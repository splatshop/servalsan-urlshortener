export default class ApiError extends Error {
	status : number;
	error : string;

	constructor(status : number, error : string) {
		super(error);

		this.name = this.constructor.name;
		this.status = status;
		this.error = error;

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(error)).stack;
		}
	}
}