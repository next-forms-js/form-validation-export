import {Helper} from '../../core/helper.ts';
import {stringToRegex} from '../../core/project-utils/regexp.ts';
import type {ValidationParams} from '../../core/project-types/scheme-types.ts';
import type {ErrorKey} from '../../core/types.ts';

export class TextValidator {
	private readonly rules: ValidationParams = {};

	constructor(rules: ValidationParams) {
		this.rules = rules;
	}

	validate(fieldValue: string): ErrorKey {
		// if there are no rules in the scheme ->  field becomes valid
		if (!Helper.hasRules(this.rules)) return '';

		if (!this.isValidRequired(fieldValue)) {
			// Can't find error text, ' ' - fix for show error,
			// because empty string not show error, need some text.
			return this.rules.texts?.required || 'field required';
		} else if (!this.isValidPattern(fieldValue)) {
			return this.rules.texts?.pattern || 'not correct value';
		}

		return '';
	}

	private isValidRequired(fieldValue: string): boolean {
		// if required is false -> field valid
		if (!this.rules.required) return true;

		// if required is true -> check fieldValue
		return Boolean(fieldValue);
	}

	private isValidPattern(fieldValue: string): boolean {
		// if no pattern and no required, rules have not useful options
		// -> field valid
		if (!this.rules.pattern) return true;

		try {
			const regexp: RegExp = stringToRegex(this.rules.pattern);
			return regexp.test(fieldValue);
		} catch {
			console.error('FieldValidator.isValidPattern: validation pattern is broken');
			return false;
		}
	}
}
