import {Helper} from './core/helper.ts';
import {FormWalker} from './core/form-walker';
import type {ModelStructureStore} from './core/project-types/model-types.ts';
import type {Page, Scheme} from './core/project-types/scheme-types.ts';
import type {InvalidFields, ValidationResponse} from './core/form-walker/types.ts';

export class FormValidation {
	private readonly scheme: Scheme;
	private readonly page: Page | undefined;
	private readonly walker: FormWalker;

	constructor(scheme: Scheme, pageName: Page['key']) {
		this.scheme = scheme;
		this.page = Helper.getPageByKey(scheme, pageName);

		this.walker = new FormWalker(this.page);
	}

	validate(formValues: ModelStructureStore): ValidationResponse {
		const invalidFields: InvalidFields = this.walker.run(formValues);

		if (!invalidFields.length) {
			return {
				valid: true,
				invalidFields: [],
			};
		}

		return {
			valid: false,
			invalidFields: invalidFields,
		};
	}
}
