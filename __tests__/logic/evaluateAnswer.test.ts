import { evaluateAnswer } from '../../src/logic/evaluateAnswer.js';
import { FunctionTestCase } from '../types.js';

const testCases: FunctionTestCase<string, typeof evaluateAnswer>[] = [
	{
		name: 'numeric answer are equal',
		args: ['42', '42'],
		expectedResult: 'VALID',
	},
	{
		name: 'numeric answer are not equal',
		args: ['42', '69'],
		expectedResult: 'NONVALID',
	},
];

describe('function - evaluateAnswer', () => {
	testCases.forEach((testCase) => {
		test(`${testCase.name}`, () => {
			const [answer, expectedAnswer] = testCase.args;
			expect(evaluateAnswer(answer, expectedAnswer)).toEqual(testCase.expectedResult);
		});
	});
});
