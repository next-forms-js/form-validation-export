import {FieldValidator} from '../../field-validator';
import {deepCopy} from '../project-utils/objects.ts';
import {Consts} from '../const.ts';
import type {CommonParams, Field} from '../project-types/scheme-types.ts';
import type {FieldKey, FieldValue, ModelStructureStore, MultiboxContainer, MultiboxKey} from '../project-types/model-types.ts';
import type {InvalidFields, ValidationFieldResponse} from './types.ts';
import type {ErrorKey} from '../types.ts';

export class FieldValidatorInWalker {
	private readonly formValues: ModelStructureStore = {};
	private readonly f: Field;

	private readonly model: CommonParams['model'];
	private readonly type: CommonParams['type'];

	constructor(formValues: ModelStructureStore, f: Field) {
		this.formValues = formValues;
		this.f = f;

		this.model = this.f?.common?.model;
		this.type = this.f?.common?.type;
	}

	validate(intoMultiboxKey: MultiboxKey = ''): InvalidFields | undefined {
		if (!this.isAllowedToValidation()) return;

		if (intoMultiboxKey) {
			// we stay into multibox component

			const res: InvalidFields | undefined = this.processFieldInMultibox(intoMultiboxKey);
			if (res?.length) return res;
		} else {
			const res: ValidationFieldResponse | undefined = this.processField();
			if (res) return [res]; // transform to ValidationResponse;
		}
	}

	private isAllowedToValidation(): boolean {
		const allowedTypes: readonly string[] = Consts.allowedComponentsForModelData;
		return allowedTypes.includes(this.type);
	}

	private processField(): ValidationFieldResponse | undefined {
		const value = this.formValues[this.model as FieldKey] as FieldValue;

		if (this.isFieldNotVisible(value)) return;

		const res: ErrorKey = FieldValidator.validate(this.f, value);
		if (!res) return;

		return this.generateResponseItem(value, res);
	}

	private processFieldInMultibox(activeMultiboxKey: MultiboxKey): ValidationFieldResponse[] | undefined {
		// we stay in any component into multibox component
		const multiboxDataContainer = this.formValues[activeMultiboxKey] as MultiboxContainer | undefined;

		// validate only multiboxItems. When no multiboxItems, no rendered any inputs on page in multibox component.
		// So, no need to validate, because no rendered inputs. validate only rendered inputs!!!
		if (!multiboxDataContainer?.length) return;

		const output: ValidationFieldResponse[] = [];

		// take one field in scheme in multibox component.
		// and validate this field in all multiboxItems models.
		for (const multiboxItem of multiboxDataContainer) {
			const value: FieldValue = multiboxItem[this.model as FieldKey];

			if (this.isFieldNotVisible(value)) continue;

			const res: ErrorKey = FieldValidator.validate(this.f, value);
			if (!res) continue;

			// process error response from validation field
			const item: ValidationFieldResponse = this.generateResponseItem(value, res);
			output.push(item);
		}

		return output;
	}

	private generateResponseItem(value: FieldValue, res: ErrorKey): ValidationFieldResponse {
		return {
			model: this.model,
			value,
			errorKey: res,
			field: deepCopy(this.f), // use deepCopy for safe reference to the field in scheme.
		};
	}

	private isFieldNotVisible(value: FieldValue): boolean {
		// when field value is empty, but validation have flag requiredOnlyIfVisible
		//
		// we need to validate only if field is visible:
		// 'if field is visible' === field has value in our model
		// no value in our model, no need to validate.
		// has value in our model, validate field!

		return Boolean(this.f.validation?.requiredOnlyIfVisible && !value);
	}
}
