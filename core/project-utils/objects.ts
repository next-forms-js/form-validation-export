export function deepCopy<T>(subject: T): T {
	// why use JSON.stringify ?
	// because it's the fastest way to deep copy objects in JS
	// this function uses only for data from scheme.json
	// and this data should be only objects without functions. It's safe.

	return JSON.parse(JSON.stringify(subject));
}
