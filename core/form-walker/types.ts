import type {FieldValue} from '../project-types/model-types.ts';
import type {CommonParams, Field} from '../project-types/scheme-types.ts';
import type {ErrorKey} from '../types.ts';

export interface ValidationFieldResponse {
	model: CommonParams['model'] | undefined;
	value: FieldValue | undefined;
	errorKey: ErrorKey;
	field: Field;
}

export type InvalidFields = ValidationFieldResponse[];

export type ValidationResponse = {
	valid: boolean;
	invalidFields: InvalidFields;
};
