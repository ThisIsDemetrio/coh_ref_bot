import {
	CORRECT,
	CORRECT_PLUS_ONE,
	INACCURATE,
	WRONG,
	WRONG_BY_TOO_MANY_INACCURACIES,
} from '../../src/logic/evaluateAnswer.js';
import { Rules, SimpleMatch } from '../../src/match-types/simpleMatch.js';

const baseRules: Rules = {
	pointsNeeded: 5,
	inaccuraciesAllowed: 1,
};

describe('class - simple match', () => {
	it('should accept a right answer', () => {
		const simpleMatch = new SimpleMatch({ ...baseRules });
		simpleMatch.addParticipants(['player1', 'player2']);
		simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');
		const result = simpleMatch.receiveAndEvaluateAnswer('seth rollins', 'player2');

		expect(result).toEqual(CORRECT);
		expect(simpleMatch.score['player1']).toEqual(0);
		expect(simpleMatch.score['player2']).toEqual(1);
	});

	it('should accept a wrong answer', () => {
		const simpleMatch = new SimpleMatch({ ...baseRules });
		simpleMatch.addParticipants(['player1', 'player2']);
		simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');
		const result = simpleMatch.receiveAndEvaluateAnswer('aj styles', 'player2');

		expect(result).toEqual(WRONG);
		expect(simpleMatch.score['player1']).toEqual(1);
		expect(simpleMatch.score['player2']).toEqual(0);
	});

	it('should accept a +1', () => {
		const simpleMatch = new SimpleMatch({ ...baseRules });
		simpleMatch.addParticipants(['player1', 'player2']);
		simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');
		const result = simpleMatch.receiveAndEvaluateAnswer('seth rolllins', 'player2');

		expect(result).toEqual(CORRECT_PLUS_ONE);
		expect(simpleMatch.score['player1']).toEqual(0);
		expect(simpleMatch.score['player2']).toEqual(1);
	});

	it('should accept an inaccuracy', () => {
		const simpleMatch = new SimpleMatch({ ...baseRules });
		simpleMatch.addParticipants(['player1', 'player2']);
		simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');
		const result = simpleMatch.receiveAndEvaluateAnswer('Seth rollins', 'player2');

		expect(result).toEqual(INACCURATE);
		expect(simpleMatch.score['player1']).toEqual(0);
		expect(simpleMatch.score['player2']).toEqual(0);
	});

	test('the second inaccuracy (declared in rules) should award the opponent with a point', () => {
		const simpleMatch = new SimpleMatch({ ...baseRules });
		simpleMatch.addParticipants(['player1', 'player2']);
		simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');

		const firstAnswer = simpleMatch.receiveAndEvaluateAnswer('Seth rollins', 'player2');
		expect(firstAnswer).toEqual(INACCURATE);

		const secondAnswer = simpleMatch.receiveAndEvaluateAnswer('seth Rollins', 'player2');

		expect(secondAnswer).toEqual(WRONG_BY_TOO_MANY_INACCURACIES);
		expect(simpleMatch.score['player1']).toEqual(1);
		expect(simpleMatch.score['player2']).toEqual(0);
	});

	it('should be able to cancel a question', () => {
		const simpleMatch = new SimpleMatch({ ...baseRules });
		simpleMatch.addParticipants(['player1', 'player2']);
		simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');

		simpleMatch.cancelQuestion();

		expect(simpleMatch.score['player1']).toEqual(0);
		expect(simpleMatch.score['player2']).toEqual(0);
	});

	describe('match simulation', () => {
		test('simple match (5 points to win, three inaccuracies allowed', () => {
			const simpleMatch = new SimpleMatch({ ...baseRules, inaccuraciesAllowed: 2 });
			simpleMatch.addParticipants(['player1', 'player2']);

			// Question asked, 0-1
			simpleMatch.askQuestion('Who is the first WWE World Heavyweight Champion?', 'Seth Rollins');
			let result = simpleMatch.receiveAndEvaluateAnswer('seth rollins', 'player2');

			expect(result).toEqual(CORRECT);
			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(1);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Question asked, 0-2
			simpleMatch.askQuestion('Who is the first WWE Universal Champion?', 'Finn Balor');
			result = simpleMatch.receiveAndEvaluateAnswer('Finn balor', 'player1');

			expect(result).toEqual(INACCURATE);
			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(1);

			result = simpleMatch.receiveAndEvaluateAnswer('finn balor', 'player2');

			expect(result).toEqual(CORRECT);
			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(2);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Wrong question, 0-3
			simpleMatch.askQuestion('What AEW stands for?', 'All Elite Wrestling');
			result = simpleMatch.receiveAndEvaluateAnswer('world wrestling entertainment', 'player1');

			expect(result).toEqual(WRONG);
			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(3);

			// Unanswered, 0-3
			simpleMatch.askQuestion('What IWGP stands for?', 'International Grand Prix Wrestling');
			simpleMatch.cancelQuestion();

			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(3);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Question asked after several inaccuracies and with a +1, 1-3
			simpleMatch.askQuestion(
				"In AEW, Nick Gage tried to cut Jericho's face with a pizza cutter while there was on air an AD from... what company?",
				'Pizza Hut',
			);

			result = simpleMatch.receiveAndEvaluateAnswer('Pizza hut', 'player2');
			expect(result).toEqual(INACCURATE);
			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(3);

			result = simpleMatch.receiveAndEvaluateAnswer('pizza Hut', 'player1');
			expect(result).toEqual(INACCURATE);
			expect(simpleMatch.score['player1']).toEqual(0);
			expect(simpleMatch.score['player2']).toEqual(3);

			result = simpleMatch.receiveAndEvaluateAnswer('pizza hutt', 'player1');
			expect(result).toEqual(CORRECT_PLUS_ONE);
			expect(simpleMatch.score['player1']).toEqual(1);
			expect(simpleMatch.score['player2']).toEqual(3);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Another +1, 2-3
			simpleMatch.askQuestion('Who was the first TNT Champion?', 'Cody Rhodes');
			result = simpleMatch.receiveAndEvaluateAnswer('coddy rhodes', 'player1');
			expect(result).toEqual(CORRECT_PLUS_ONE);
			expect(simpleMatch.score['player1']).toEqual(2);
			expect(simpleMatch.score['player2']).toEqual(3);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Inaccuracy + wrong answer, 2-4
			simpleMatch.askQuestion('True or false: John Cena won the WWE Intercontinental Title two times', 'false');
			result = simpleMatch.receiveAndEvaluateAnswer('False', 'player1');
			expect(result).toEqual(INACCURATE);
			expect(simpleMatch.score['player1']).toEqual(2);
			expect(simpleMatch.score['player2']).toEqual(3);

			result = simpleMatch.receiveAndEvaluateAnswer('true', 'player1');
			expect(result).toEqual(WRONG);
			expect(simpleMatch.score['player1']).toEqual(2);
			expect(simpleMatch.score['player2']).toEqual(4);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Too many inaccuracies, 3-4
			simpleMatch.askQuestion('Name the finisher of Kenny Omega', 'One winged angel');
			result = simpleMatch.receiveAndEvaluateAnswer('One winged angel', 'player2');
			expect(result).toEqual(INACCURATE);
			expect(simpleMatch.score['player1']).toEqual(2);
			expect(simpleMatch.score['player2']).toEqual(4);

			result = simpleMatch.receiveAndEvaluateAnswer('one winged Angel', 'player2');
			expect(result).toEqual(INACCURATE);
			expect(simpleMatch.score['player1']).toEqual(2);
			expect(simpleMatch.score['player2']).toEqual(4);

			result = simpleMatch.receiveAndEvaluateAnswer('one Winged angel', 'player2');
			expect(result).toEqual(WRONG_BY_TOO_MANY_INACCURACIES);
			expect(simpleMatch.score['player1']).toEqual(3);
			expect(simpleMatch.score['player2']).toEqual(4);

			expect(simpleMatch.getWinner()).not.toBeDefined();

			// Right answer, 3-5, end of the match
			simpleMatch.askQuestion('Who were the first AEW World Tag Team Champions?', 'SCU');
			result = simpleMatch.receiveAndEvaluateAnswer('scu', 'player2');
			expect(result).toEqual(CORRECT);
			expect(simpleMatch.score['player1']).toEqual(3);
			expect(simpleMatch.score['player2']).toEqual(5);

			expect(simpleMatch.getWinner()).toEqual('player2');
		});
	});
});
