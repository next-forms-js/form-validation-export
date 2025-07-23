import type {Field, Scheme, ValidationParams, Page} from '../core/project-types/scheme-types.ts';
import type {MultiboxKey} from '../core/project-types/model-types.ts';

export class Helper {
	static getRules(scheme: Field): undefined | ValidationParams {
		if (!scheme) return;

		if (scheme.attrs?.element?.disabled === true) {
			// in scheme, attr 'disabled': true - skip validation
			return;
		}

		const rules: ValidationParams | undefined = scheme.validation;
		if (!rules || !this.hasRules(rules)) return;

		return rules;
	}

	static hasRules(rules: ValidationParams): boolean {
		return !!(rules && Object.keys(rules).length);
	}

	static getMultiboxKey(f: Field): MultiboxKey | undefined {
		if (!this.isComponentMultibox(f)) return;

		return f?.common?.model as MultiboxKey;
	}

	static isEnableField(f: Field): boolean {
		if (f?.common?.enable === false) return false;

		return true;
	}

	static isComponentMultibox(f: Field): boolean {
		return f?.common?.type === 'MultiBox';
	}

	static getPageByKey(scheme: Scheme, key: string): Page | undefined {
		if (!scheme || !key || !scheme.pages) return;

		return scheme.pages.find(page => page.key === key);
	}
}
