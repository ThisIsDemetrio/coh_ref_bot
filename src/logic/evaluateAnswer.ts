export type AnswerResult = 'VALID' | 'VALID+1' | 'NONVALID' | 'INACCURATE';

const isNumericAnswer = (str: string): boolean => !Number.isNaN(parseInt(str));
const containsUppercase = (str: string): boolean => /[A-Z]/.test(str);

function isOneCharMore(str1: string, str2: string): boolean {
	const longerStr = str1.length > str2.length ? str1 : str2;
	const shorterStr = str1.length > str2.length ? str2 : str1;

	if (longerStr.length - shorterStr.length !== 1) {
		return false; // If the difference in length is not exactly 1, the strings can't satisfy the condition.
	}

	let diffCount = 0;
	let shorterIndex = 0;

	for (let i = 0; i < longerStr.length; i++) {
		if (longerStr.charAt(i) !== shorterStr.charAt(shorterIndex)) {
			diffCount++;
			if (diffCount > 1) {
				return false; // If more than one difference is found, return false.
			}
		} else {
			shorterIndex++;
		}
	}

	return diffCount === 1; // Return true if exactly one difference is found.
}

export function evaluateAnswer(answer: string, expectedAnswer: string): AnswerResult {
	const cleanAnswer = answer.trim();
	const isNumber = isNumericAnswer(expectedAnswer);

	if (isNumber) {
		return cleanAnswer === expectedAnswer ? 'VALID' : 'NONVALID';
	}

	// If the string is the same and has uppercase letters, return INACCURATE
	if (containsUppercase(cleanAnswer) && cleanAnswer.toLowerCase() === expectedAnswer) {
		return 'INACCURATE';
	}

	if (isOneCharMore(cleanAnswer, expectedAnswer)) {
		return 'VALID+1';
	}

	return cleanAnswer === expectedAnswer ? 'VALID' : 'NONVALID';
}
