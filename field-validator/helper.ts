import {Helper} from '../core/helper.ts';
import type {Field, ValidationParams} from '../core/project-types/scheme-types.ts';

export class FieldValidatorHelper {
	static allowValidation(f: Field): boolean {
		const rules: ValidationParams | undefined = Helper.getRules(f);
		if (!rules) return false;

		return Boolean(rules.pattern || rules.required);
	}

	static allowValidationByRequired(f: Field): boolean {
		const rules: ValidationParams | undefined = Helper.getRules(f);
		if (!rules) return false;

		return rules.required as boolean;
	}
}
