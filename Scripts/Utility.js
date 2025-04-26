export function RandomBetween(minInclusive, maxExclusive)
{
	return Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive);
}

export function Shuffle(arrayCopy)
{
	const result = arrayCopy.slice();
	for (let i = 0; i < result.length; i++) {
		const randIdx = RandomBetween(i, result.length);
		const temp = result[i];
		result[i] = result[randIdx];
		result[randIdx] = temp;
	}
	return result;
}

export function Swap(a, b)
{
	const temp = a;
	a = b;
	b = temp;
}