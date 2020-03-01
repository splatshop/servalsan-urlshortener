/**
 * Zero-width characters to use
 * @see https://docs.google.com/spreadsheets/d/1df3avAKG_Iq8aTY7x7bnFhrjg9rxWX-GDjmw3zcK5Y0/edit#gid=0 The spreadsheet where characters are compared
 */
const chars = [
	'\u{E0000}',
	'\u{E0002}',
	'\u{E0003}',
	'\u{E0004}',
	'\u{E0005}',
	'\u{E0006}',
	'\u{E0007}',
	'\u{E0008}',
	'\u{E0009}',
	'\u{E000A}',
	'\u{E000B}',
	'\u{E000C}',
	'\u{E000D}',
	'\u{E000E}',
	'\u{E000F}',
	'\u{E0010}',
	'\u{E0011}',
	'\u{E0012}',
	'\u{E0013}',
	'\u{E0014}',
	'\u{E0015}',
	'\u{E0016}',
	'\u{E0017}',
	'\u{E0018}',
	'\u{E0019}',
	'\u{E001A}',
	'\u{E001B}',
	'\u{E001C}',
	'\u{E001D}',
	'\u{E001E}',
	'\u{E001F}'
];

/**
 * Generate a string of zero-width characters.
 * @param {number} [length=5] Length of string to generate
 * @returns {string} The ZWS string
 */
module.exports = function(length = 5) {
	/** @type {string[]} */
	let zws = new Array(length);

	return zws
		.fill(null)
		.map(() => chars[Math.floor(Math.random() * chars.length)])
		.join('');
};
