import {FieldValidatorInWalker} from './field-validator-in-walker.ts';
import {Helper} from '../helper.ts';
import type {Field, Page} from '../project-types/scheme-types.ts';
import type {ModelStructureStore, MultiboxKey} from '../project-types/model-types.ts';
import type {InvalidFields} from './types.ts';

type ParamMultiboxKey = MultiboxKey | undefined;

export class FormWalker {
	private readonly page: Page | undefined;
	private formValues: ModelStructureStore = {};
	private response: InvalidFields = [];

	constructor(page: Page | undefined) {
		this.page = page;
	}

	run(formValues: ModelStructureStore): InvalidFields {
		this.formValues = formValues;
		this.response = [];

		this.walkPageComponents();

		return this.response;
	}

	private walkPageComponents(): void {
		const components: Field[] | undefined = this.page?.components;
		if (!components?.length) return;

		for (const component of components) {
			this.walk(component);
		}
	}

	private walk(f: Field, intoMultiboxKey: ParamMultiboxKey = undefined): void {
		if (!Helper.isEnableField(f)) return;

		this.validationPart(f, intoMultiboxKey);
		this.recursivePart(f, intoMultiboxKey);
	}

	private validationPart(f: Field, intoMultiboxKey: ParamMultiboxKey): void {
		const res: InvalidFields | undefined = new FieldValidatorInWalker(this.formValues, f).validate(intoMultiboxKey);

		if (res) this.response = this.response.concat(res);
	}

	private recursivePart(f: Field, intoMultiboxKey: ParamMultiboxKey): void {
		// get another components and run recursive
		const children: Field[] | undefined = f.components;
		if (!children?.length) return;

		// when we stay in multibox component, we need to send the current multibox key, for deeper components. By send variable currentMultiboxKey, and use var intoMultiboxKey
		const currentMultiboxKey: ParamMultiboxKey = intoMultiboxKey || Helper.getMultiboxKey(f);

		for (const child of children) {
			this.walk(child, currentMultiboxKey);
		}
	}
}
