import { PositiveNumber } from '../../__tests__/types.js';
import {
	AnswerResult,
	CORRECT,
	CORRECT_PLUS_ONE,
	INACCURATE,
	WRONG,
	WRONG_BY_TOO_MANY_INACCURACIES,
	evaluateAnswer,
} from '../logic/evaluateAnswer.js';

type ScoreSheet = Record<string, number>;

export type Rules = {
	pointsNeeded: PositiveNumber;
	inaccuraciesAllowed: PositiveNumber;
};

type QuestionData = {
	question: string;
	expectedAnswer: string;
	givenAnswers: { answer: string; from: string; is: AnswerResult }[];
	isCanceled: boolean;
	answeredCorrectly: boolean;
	answeredBy?: string;
};

type MatchHistory = QuestionData[];

export class SimpleMatch {
	private _rules: Rules;
	private _score: ScoreSheet = {};
	private _currentQuestion: QuestionData;
	private _matchHistory: MatchHistory = [];

	get score(): ScoreSheet {
		return this._score;
	}

	constructor(rules: Rules) {
		this._rules = rules;
	}

	addParticipants(participants: string[]): void {
		participants.forEach((participant) => (this._score[participant] = 0));
	}

	askQuestion(question: string, expectedAnswer: string): void {
		this._currentQuestion = {
			question,
			expectedAnswer: expectedAnswer.toLowerCase(),
			givenAnswers: [],
			isCanceled: false,
			answeredCorrectly: false,
		};
	}

	private archiveQuestion(): void {
		this._matchHistory.push(this._currentQuestion);
		this._currentQuestion = null;
	}

	cancelQuestion(): void {
		this._currentQuestion.isCanceled = true;
		this.archiveQuestion();
	}

	receiveAndEvaluateAnswer(answer: string, from: string): AnswerResult | null {
		if (!this._currentQuestion) return null;
		const { inaccuraciesAllowed } = this._rules;

		const noInaccuracies =
			this._currentQuestion.givenAnswers.filter((answer) => answer.from === from).length === inaccuraciesAllowed;
		const answerEvaluation = evaluateAnswer(answer, this._currentQuestion.expectedAnswer, { noInaccuracies });

		switch (answerEvaluation) {
			case CORRECT:
			case CORRECT_PLUS_ONE:
				this._score[from] += 1;
				this._currentQuestion.answeredCorrectly = true;
				this._currentQuestion.answeredBy = from;
				this._currentQuestion.givenAnswers.push({ answer, from, is: answerEvaluation });
				this._matchHistory.push(this._currentQuestion);
				this._currentQuestion = null;
				break;
			case INACCURATE:
				this._currentQuestion.givenAnswers.push({ answer, from, is: answerEvaluation });
				break;
			case WRONG_BY_TOO_MANY_INACCURACIES:
			case WRONG: {
				const otherParticipant = Object.keys(this._score).find((participant) => participant !== from);
				this._score[otherParticipant] += 1;
				this._currentQuestion.answeredCorrectly = false;
				this._currentQuestion.givenAnswers.push({ answer, from, is: answerEvaluation });
				this.archiveQuestion();
				break;
			}
			default:
				throw new Error(`Unexpected case: ${answerEvaluation}`);
		}
		return answerEvaluation;
	}

	getWinner(): string | undefined {
		const { pointsNeeded } = this._rules;
		const [participant] = Object.entries(this._score).find(([, points]) => points === pointsNeeded) || [];
		return participant;
	}
}
