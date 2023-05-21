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
	{
		name: 'string answer are equal',
		args: ['john cena', 'john cena'],
		expectedResult: 'VALID',
	},
	{
		name: 'string answer is wrong',
		args: ['John cena', 'cm punk'],
		expectedResult: 'NONVALID',
	},
	{
		name: 'string answer contains an uppercase',
		args: ['John cena', 'john cena'],
		expectedResult: 'INACCURATE',
	},
	{
		name: "string answer contains an uppercase but it's wrong",
		args: ['John cena', 'cm punk'],
		expectedResult: 'NONVALID',
	},
	{
		name: 'there a +1',
		args: ['cm punk', 'cm punnk'],
		expectedResult: 'VALID+1',
	},
];

describe('function - evaluateAnswer', () => {
	testCases.forEach(({ name, args, expectedResult }) => {
		test(name, () => {
			const [answer, expectedAnswer] = args;
			expect(evaluateAnswer(answer, expectedAnswer)).toEqual(expectedResult);
		});
	});
});
