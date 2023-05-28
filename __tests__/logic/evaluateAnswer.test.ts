import {
	CORRECT,
	CORRECT_PLUS_ONE,
	EvaluateAnswerOptions,
	INACCURATE,
	WRONG,
	WRONG_BY_TOO_MANY_INACCURACIES,
	evaluateAnswer,
} from '../../src/logic/evaluateAnswer.js';
import { FunctionTestCase } from '../types.js';

const testCases: FunctionTestCase<[string, string, EvaluateAnswerOptions?], typeof evaluateAnswer>[] = [
	{
		name: 'numeric answer are equal',
		args: ['42', '42'],
		expectedResult: CORRECT,
	},
	{
		name: 'numeric answer are not equal',
		args: ['42', '69'],
		expectedResult: WRONG,
	},
	{
		name: 'string answer are equal',
		args: ['john cena', 'john cena'],
		expectedResult: CORRECT,
	},
	{
		name: 'string answer is wrong',
		args: ['John cena', 'cm punk'],
		expectedResult: WRONG,
	},
	{
		name: 'string answer contains an uppercase',
		args: ['John cena', 'john cena'],
		expectedResult: INACCURATE,
	},
	{
		name: 'string answer contains an uppercase but inaccuracies are not allowed',
		args: ['John cena', 'john cena', { noInaccuracies: true }],
		expectedResult: WRONG_BY_TOO_MANY_INACCURACIES,
	},
	{
		name: "string answer contains an uppercase but it's wrong",
		args: ['John cena', 'cm punk'],
		expectedResult: WRONG,
	},
	{
		name: 'there a +1',
		args: ['cm punk', 'cm punnk'],
		expectedResult: CORRECT_PLUS_ONE,
	},
];

describe('function - evaluateAnswer', () => {
	testCases.forEach(({ name, args, expectedResult }) => {
		test(name, () => {
			const [answer, expectedAnswer, options] = args;
			expect(evaluateAnswer(answer, expectedAnswer, options)).toEqual(expectedResult);
		});
	});
});
