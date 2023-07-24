function compareTwoWords(str1, str2) {
	const n = Math.max(str1.length, str2.length)
	let hammingDistance = 0
  
	for (let i = 0; i < n; i++) {
	  const char1 = str1[i]
	  const char2 = str2[i]
	  
	  if (char1 !== char2) {
		hammingDistance++
	  }
	}
  
	const normalizedDistance = hammingDistance / n
  
	return 1 - normalizedDistance
}
  