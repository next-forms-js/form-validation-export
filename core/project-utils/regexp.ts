export function stringToRegex(str: string): RegExp | never {
	if (!str) {
		throw new Error('regexp: source string for create regexp is empty');
	}

	let output;

	try {
		// Main regex
		// @ts-expect-error
		const main: string = str.match(/\/(.+)\/.*/)[1];
		// Regex options
		// @ts-expect-error
		const options: string = str.match(/\/.+\/(.*)/)[1];

		// Compiled regex
		output = new RegExp(main, options);
	} catch {
		throw new Error('regexp: not correct source string');
	}

	return output;
}
