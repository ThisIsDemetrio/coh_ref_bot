export type AnswerResult = 'VALID' | 'VALID+1' | 'NONVALID' | 'INACCURATE';

const isNumericAnswer = (str: string): boolean => !Number.isNaN(parseInt(str));
const containsUppercase = (str: string): boolean => /[A-Z]/.test(str);

export function evaluateAnswer(answer: string, expectedAnswer: string): AnswerResult {
	const cleanAnswer = answer.trim();
	const isNumber = !isNumericAnswer(expectedAnswer);

	if (isNumber) {
		return cleanAnswer === expectedAnswer ? 'VALID' : 'NONVALID';
	}

	// If the string is the same and has uppercase letters, return INACCURATE
	if (containsUppercase(answer) && cleanAnswer.toLowerCase() === expectedAnswer) {
		return 'INACCURATE';
	}

	if (expectedAnswer.length === cleanAnswer.length + 1) {
		// TODO: Handle +1
	}

	return cleanAnswer === expectedAnswer ? 'VALID' : 'NONVALID';
}
