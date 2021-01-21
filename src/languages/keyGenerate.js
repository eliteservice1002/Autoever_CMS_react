let key = 0;

export function resetKey() {
	key = 0;
}

export function keyGen() {
	let oldKey = key;
	key += 1;
	return oldKey;
}