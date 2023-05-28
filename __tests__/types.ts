export type FunctionTestCase<TArgs extends unknown[], TFunction extends (...args: TArgs) => unknown> = {
	name: string;
	args: TArgs;
	expectedResult: ReturnType<TFunction>;
};

// TODO: How to make a positive number?
type ValidatePositiveInteger<T extends number> = T extends 0 ? never : T;
export type PositiveNumber = ValidatePositiveInteger<number>;
