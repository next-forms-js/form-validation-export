// @ts-nocheck
// noinspection MagicNumberJS,NegatedConditionalExpressionJS,JSUnusedGlobalSymbols

function lastItemOf(arr: unknown[]) {
	return arr[arr.length - 1];
}

function today(): number {
	return new Date().setHours(0, 0, 0, 0);
}

function stripTime(timeValue: number): number {
	return new Date(timeValue).setHours(0, 0, 0, 0);
}

// get month index in normal range (0 - 11) from any number
function normalizeMonth(monthIndex: number): unknown {
	return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
}

function padZero(num: number, length: number) {
	return num.toString().padStart(length, '0');
}

function isCorrectMonth(monthIndex: number): void {
	if (monthIndex < 0 || monthIndex > 11 || Number.isNaN(monthIndex)) {
		throw new Error('Invalid date format. (Month)');
	}
}

function isCorrectYear(year: number): void {
	if (year <= 0 || Number.isNaN(year)) {
		throw new Error('Invalid date format. (Year)');
	}
}

function isCorrectDay(timestamp: number, day: number): void {
	const date = new Date(timestamp);
	// set first day of the month
	date.setDate(1);
	// set next month
	date.setMonth(date.getMonth() + 1);
	// set previous day => last day of the month
	date.setDate(0);
	const daysInMonth = date.getDate();

	if (day <= 0 || day > daysInMonth || Number.isNaN(day)) {
		throw new Error('Invalid date format. (Day)');
	}
}

// pattern for format parts
const reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
// pattern for non date parts
const reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
// cache for parsed formats
const knownFormats = {};
// parse functions for date parts
const parseFns = {
	y(date: number, year: string) {
		const yearInt: number = parseInt(year, 10);
		isCorrectYear(yearInt);

		return new Date(date).setFullYear(yearInt);
	},
	m(date: number, month: string) {
		const newDate = new Date(date);
		const monthIndex = parseInt(month, 10) - 1;

		isCorrectMonth(monthIndex);

		newDate.setMonth(monthIndex);
		// noinspection UnnecessaryLocalVariableJS
		const r = newDate.getMonth() !== normalizeMonth(monthIndex) ? newDate.setDate(0) : newDate.getTime();

		return r;
	},
	d(date: number, day: string) {
		const parsedDay: number = parseInt(day, 10);
		isCorrectDay(date, parsedDay);

		return new Date(date).setDate(parsedDay);
	},
};
// format functions for date parts
const formatFns = {
	d(date: Date) {
		return date.getDate();
	},
	dd(date: Date) {
		return padZero(date.getDate(), 2);
	},
	m(date: Date) {
		return date.getMonth() + 1;
	},
	mm(date: Date) {
		return padZero(date.getMonth() + 1, 2);
	},
	y(date: Date) {
		return date.getFullYear();
	},
	yy(date: Date) {
		return padZero(date.getFullYear(), 2).slice(-2);
	},
	yyyy(date: Date) {
		return padZero(date.getFullYear(), 4);
	},
};

function parseFormatString(format: string): unknown {
	// noinspection SuspiciousTypeOfGuard
	if (typeof format !== 'string') {
		throw new Error('Invalid date format.');
	}
	if (format in knownFormats) {
		return knownFormats[format];
	}

	// split the format string into parts and separators
	const separators = format.split(reFormatTokens);
	const parts = format.match(new RegExp(reFormatTokens, 'g'));
	if (separators.length === 0 || !parts) {
		throw new Error('Invalid date format.');
	}

	// collect format functions used in the format
	const partFormatters = parts.map(token => formatFns[token]);

	// collect parse function keys used in the format
	// iterate over parseFns keys in order to keep the order of the keys.
	const partParserKeys = Object.keys(parseFns).reduce((keys, key) => {
		const token = parts.find(part => part[0] !== 'D' && part[0].toLowerCase() === key);
		if (token) {
			keys.push(key);
		}
		return keys;
	}, []);

	return (knownFormats[format] = {
		parser(dateStr) {
			const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
				if (part.length > 0 && parts[index]) {
					const token = parts[index][0];
					if (token === 'M') {
						dtParts.m = part;
					} else if (token !== 'D') {
						dtParts[token] = part;
					}
				}
				return dtParts;
			}, {});

			// iterate over partParserkeys so that the parsing is made in the oder
			// of year, month and day to prevent the day parser from correcting last
			// day of month wrongly
			return partParserKeys.reduce((origDate, key) => {
				const newDate = parseFns[key](origDate, dateParts[key]);
				// ignore the part failed to parse
				return Number.isNaN(newDate) ? origDate : newDate;
			}, today());
		},
		formatter(date) {
			let dateStr = partFormatters.reduce((str, fn, index) => {
				// noinspection JSUnusedAssignment
				// eslint-disable-next-line no-param-reassign
				return (str += `${separators[index]}${fn(date)}`);
			}, '');
			// separators' length is always parts' length + 1,
			return (dateStr += lastItemOf(separators));
		},
	});
}

export function parseDate(dateStr: string | number | Date, format: string): number {
	// !! throw errors!!! when use -> wrap try catch

	if (dateStr instanceof Date || typeof dateStr === 'number') {
		// cut hours and minutes, save only the date values
		const date: number = stripTime(dateStr);
		return Number.isNaN(date) ? 0 : date;
	}
	if (!dateStr) {
		return 0;
	}
	if (dateStr === 'today') {
		return today();
	}

	if (format && format.toValue) {
		const date = format.toValue(dateStr, format);

		return Number.isNaN(date) ? 0 : stripTime(date);
	}

	return parseFormatString(format).parser(dateStr);
}
