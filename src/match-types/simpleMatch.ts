import { AnswerResult, evaluateAnswer } from '../logic/evaluateAnswer.js';

type ScoreSheet = Record<string, number>;

type QuestionData = {
	question: string;
	expectedAnswer: string;
	givenAnswers: { answer: string; from: string }[];
	isCanceled: boolean;
	isCorrectAnswer: boolean;
};

type MatchHistory = QuestionData[];

// TODO: Add a state to make sure we're expecting a question or an answer, or whatever
export class SimpleMatch {
	score: ScoreSheet = {};
	currentQuestion: QuestionData;
	matchHistory: MatchHistory = [];

	constructor(participants: string[]) {
		participants.forEach((participant) => (this.score[participant] = 0));
	}

	getCurrentResult(): string {
		return Object.entries(this.score)
			.map(([participant, points]) => `${participant}: ${points}`)
			.join(', ');
	}

	askQuestion(question: string, expectedAnswer: string): void {
		this.currentQuestion = {
			question,
			expectedAnswer,
			givenAnswers: [],
			isCanceled: false,
			isCorrectAnswer: false,
		};
	}

	cancelQuestion(): void {
		this.currentQuestion.isCanceled = true;
		this.matchHistory.push(this.currentQuestion);
		this.currentQuestion = null;
	}

	receiveAndEvaluateAnswer(answer: string, from: string): AnswerResult {
		this.currentQuestion.givenAnswers.push({ answer, from });

		const answerEvaluation = evaluateAnswer(answer, this.currentQuestion.expectedAnswer);
		if (['VALID', 'VALID+1'].includes(answerEvaluation)) {
			this.currentQuestion.isCorrectAnswer = true;
			this.matchHistory.push(this.currentQuestion);
			this.currentQuestion = null;
		}

		return answerEvaluation;
	}

	getWinner(): string | undefined {
		const [participant, points] = Object.entries(this.score).find(([, points]) => points === 5);

		return participant;
	}
}
