export type FunctionTestCase<
  TArgs,
  TFunction extends (...args: TArgs[]) => unknown,
> = {
  name: string;
  args: TArgs[];
  expectedResult: ReturnType<TFunction>;
};
