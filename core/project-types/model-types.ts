export type FieldKey = string; // first, second, surname
export type FieldValue = string; // 'abc', and boolean for checkbox

export type MultiboxKey = string; // multi_box_1
export type MultiboxIndex = number;
export type MultiboxCoordinatesInModel = {
	key: MultiboxKey;
	index: MultiboxIndex;
};

export type ModelStoreItem = Record<FieldKey, FieldValue>; // {...fields}
export type MultiboxItem = ModelStoreItem; // {...fields}
export type MultiboxContainer = MultiboxItem[]; //  [MultiboxItem, MultiboxItem, ...]

export type ModelStructureStore = Record<FieldKey | MultiboxKey, FieldValue | MultiboxContainer>;

/* ModelStructureStore =
 * {
 *	"multi_box_1": [
 * 		{}
 * 	],
 * 	"first": "",
 * 	"second": "",
 * 	"surname": "abc"
 * }
 */
