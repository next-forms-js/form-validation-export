import {TextValidator} from './text';
import {FieldValidatorHelper} from './helper.ts';
import {Consts} from '../core/const.ts';
import type {Field, ValidationParams} from '../core/project-types/scheme-types.ts';
import type {FieldValue} from '../core/project-types/model-types.ts';
import type {ErrorKey} from '../core/types.ts';

// import {DatepickerValidator} from './core/fields/datepicker/validator';
// import type {DatepickerOptions} from './core/fields/datepicker/types';

export class FieldValidator {
	static validateText(f: Field, fieldValue: string): ErrorKey {
		// sometimes this function used like as basic input validation

		if (!FieldValidatorHelper.allowValidation(f)) return '';

		const TV = new TextValidator(f.validation as ValidationParams);

		return TV.validate(fieldValue);
	}

	static validateCheckbox(f: Field, fieldValue: boolean): ErrorKey {
		if (!FieldValidatorHelper.allowValidationByRequired(f)) return '';

		if (fieldValue) return '';
		return Consts.errorTexts.required;
	}

	static validateRadiobutton(f: Field, fieldValue: string): ErrorKey {
		if (!FieldValidatorHelper.allowValidationByRequired(f)) return '';

		if (fieldValue) return '';
		return Consts.errorTexts.required;
	}

	static validateDate(f: Field, fieldValue: string): ErrorKey {
		return this.validateText(f, fieldValue);
	}

	static validate(f: Field, fieldValue: FieldValue): ErrorKey {
		switch (f.common.type) {
			case 'InputText':
			case 'InputEmail':
			case 'InputPassword':
			case 'Textarea':
			case 'Selector':
				return this.validateText(f, fieldValue);

			case 'Checkbox':
				return this.validateCheckbox(f, fieldValue as unknown as boolean);

			case 'Radiobuttons':
				return this.validateRadiobutton(f, fieldValue);

			case 'InputDate':
				return this.validateDate(f, fieldValue);

			default:
				// validate only upper field types
				return '';
		}
	}

	// static validateDate(
	// 	f: Field,
	// 	mask: string,
	// 	datepickerFieldOptions: DatepickerOptions,
	// 	multiboxInfo: MultiboxCoordinatesInModel,
	// 	fieldValue: string
	// ): ErrorKey {
	// 	const dv = new DatepickerValidator(f, mask, datepickerFieldOptions, multiboxInfo);
	// 	const r: ErrorKey = dv.validate(fieldValue);
	//
	// 	return r;
	// }
}
