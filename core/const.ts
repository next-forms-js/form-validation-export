const Consts = {
	allowedComponentsForModelData: [
		'InputText',
		'InputPassword',
		'InputEmail',
		'InputDate',
		'Selector',
		'Textarea',
		'Checkbox',
		'Radiobuttons',
	],
	errorTexts: {
		required: 'errors.required',
	},
} as const;

Object.freeze(Consts);
export {Consts};
