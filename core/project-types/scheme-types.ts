// noinspection DuplicatedCode

export interface ValidationParams {
	readonly required?: boolean;
	readonly pattern?: string;
	readonly requiredOnlyIfVisible?: boolean;
	readonly texts?: {
		readonly [key: string]: string;
	};
}

export interface RestrictParams {
	mask?: string;
	pattern?: string;
}

export interface CustomParams {
	[key: string]: any;
}

export interface CommonClasses {
	readonly container?: string;
	readonly element?: string;
}

export interface CommonParams {
	readonly type: string;
	readonly model?: string;
	readonly enable?: boolean;
	readonly class?: CommonClasses;
	readonly renderInHTMLTag?: string; // if true, then render in html tag. Not render in
	// virtual component
}

export interface AttrsParams {
	readonly container?: Record<string, unknown>;
	readonly element?: Record<string, unknown>;
}
export interface TextParams {
	readonly value?: string;
	readonly placeholder?: string;
	readonly label?: string;
	readonly hint?: string;
	readonly addButton?: string;
}
export interface StylesParams {
	readonly value?: string | string[]; // that line or lines ->
	// transform to total string of styles
}
export interface HtmlParams {}
export interface ModuleParams {}

export interface InitializeValuesParams {
	mode: 'self' | 'custom';
	custom?: {
		'source-from': 'STORAGE';
		'source-key': 'saved-page-model';
		'page-key': string;
		'field-model-name': string;
	};
}

export interface AppProcessValues {
	multi?: {
		readonly name: string;
		key: number;
	};
}

export interface Field {
	readonly common: CommonParams;
	readonly attrs?: AttrsParams;
	custom?: CustomParams;
	readonly validation?: ValidationParams;
	readonly restrict?: RestrictParams;
	readonly text?: TextParams;
	readonly styles?: StylesParams;
	readonly html?: HtmlParams;
	readonly module?: ModuleParams;
	readonly initialize?: InitializeValuesParams;
	components?: Field[];
	appProcess?: AppProcessValues;
}

export interface Page {
	readonly id: number;
	readonly key: string;
	readonly description?: string;
	readonly class?: string;
	readonly styles?: StylesParams;
	readonly submitActionUrl?: string;
	components?: Field[];
}

export interface LocalizationConfig {
	readonly defaultLang?: string;
	readonly availableLangs?: string[];
}
/**
 * {
 *		defaultLang: "en"
 *		availableLangs: ["en", "fr"]
 * }
 */

export interface ModuleConfig {
	readonly forEachField?: Record<string, unknown>;
	readonly [key: string]: any;
}
// "config": {
// 	"locales": {
// 		"relations": {
// 			"ua": "uk",
// 			"en": "en-AU",
// 			"fr": "fr"
// 		}
// 	},
// 	"forEachField": {
// 		"format": "mm/dd/yyyy",
// 		"autohide": true
// 	}
// }

export interface Module {
	readonly name: string;
	readonly enable?: boolean;
	readonly config?: ModuleConfig;
}

export interface Variables {
	readonly [key: string]: unknown;
}

export interface Configurations {
	readonly modules?: Module[];
	readonly localization?: LocalizationConfig;
	readonly styles?: StylesParams;
	readonly variables?: Variables;
	readonly apiBaseUrl?: string;
}

export interface Scheme {
	readonly config: Configurations;
	pages: Page[];
}
